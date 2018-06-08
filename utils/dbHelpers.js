const db = require('../models/index');
const Op = db.Sequelize.Op;

const isBalanced = articles => {
  const leftSources = ['motherjones.com', 'huffingtonpost.com', 'msnbc.com', 'nytimes.com', 'theguardian.com'];
  const rightSources = ['breitbart.com', 'foxnews.com', 'ijr.com', 'theblaze.com', 'wnd.com', 'washingtontimesreporter.com'];
  let balanced = { right: 0, left:0}
  for (const article of articles) {
    if (leftSources.includes(article.Source.uri)) {
      balanced.left ++;
    } else if (rightSources.includes(article.Source.uri)) {
      balanced.right++;
    }
  }
  return balanced.right > 0 && balanced.left > 0;
};

 const countValidSources = articles => {
  let sources = [];
  for (const article of articles) {
    if (!sources.includes(article.Source.uri)) {
      sources.push(article.Source.uri);
    }
  }
  return sources.length;
};

const sortEventsNewestFirst = events => {
  return events.sort((a, b) => {
    a = new Date(a.date);
    b = new Date(b.date);
    return a>b ? -1 : a<b ? 1: 0;
  });
};

const calculateDate = (daysAgo) => {
  return new Date(new Date() - (24*daysAgo) * 60 * 60 * 1000);
};

const averageSentiment = sentiments => {
  let totals = {};
  let numSentiments = 0;
  for (const sentiment of sentiments) {
    for (const item of sentiment) {
      numSentiments += 1;
      totals['sentiment'] = totals['sentiment'] ? totals['sentiment'] += item.sentiment : item.sentiment;
      totals['fear'] = totals['fear'] ? totals['fear'] += item.fear : item.fear;
      totals['disgust'] = totals['disgust'] ? totals['disgust'] += item.disgust : item.disgust;
      totals['anger'] = totals['anger'] ? totals['anger'] += item.anger : item.anger;
      totals['joy'] = totals['joy'] ? totals['joy'] += item.joy : item.joy;
      totals['sadness'] = totals['sadness'] ? totals['sadness'] += item.sadness : item.sadness;
      totals['labels'] = totals['labels'] ? totals['labels'].concat([item.label]) : [item.label];
    } 
  }
  //average all values
  for (let  item in totals) {
    if (item !== 'labels') {
      totals[item] = totals[item] / numSentiments;
    }   
  }

  return totals;
};


const calculateSentiment = event => {
  const leftSources = ['motherjones.com', 'huffingtonpost.com', 'msnbc.com', 'nytimes.com', 'theguardian.com'];
  const rightSources = ['breitbart.com', 'foxnews.com', 'ijr.com', 'theblaze.com', 'wnd.com', 'washingtontimesreporter.com'];
  const centerSources = ['hosted.ap.org', 'npr.org', 'thehill.com'];

  const leftArticles = event.Articles.filter(article => leftSources.includes(article.Source.uri));
  const rightArticles = event.Articles.filter(article => rightSources.includes(article.Source.uri));
  const centerArticles = event.Articles.filter(article => centerSources.includes(article.Source.uri));

  const leftSentiments = leftArticles.map(article => article.Sentiments);
  const rightSentiments = rightArticles.map(article => article.Sentiments);
  const centerSentiments = centerArticles.map(article => article.Sentiments);

  const result = {
    left: averageSentiment(leftSentiments),
    right: averageSentiment(rightSentiments),
    center: averageSentiment(centerSentiments)
  }

  return result
};

const getBalancedEvents = async(categoryId, daysAgo) => {
  // limit initial events to ones created by our system in the last 5 days
  const searchDate = calculateDate(daysAgo);

  const events = await db.Event.findAll({
    include: [{
      model: db.Subcategory,
      where: { categoryId }
    },
    {
      model: db.Article,
      include: db.Source
    }],
    where: {
      createdAt: {
        [Op.gt]: searchDate
      }
    }
  });

  //only return events that have associated articles and have been reported by at least 4 sources
  let filteredByArticles = events.filter(event => event.Articles.length > 0);
  let filteredBySources = filteredByArticles.filter(event => countValidSources(event.Articles) > 3);
  //only returnbalanced events
  let filteredBySpectrum = filteredBySources.filter(event => isBalanced(event.Articles));

  //sort results to come back newest first
  const sorted = sortEventsNewestFirst(filteredBySpectrum);
  return sorted;
};

const getBiasedEvents = async(daysAgo) => {
  const sourceUris = {
    left: ['motherjones.com', 'huffingtonpost.com', 'msnbc.com', 'nytimes.com', 'theguardian.com', 'latimes.com'],
    right: ['ijr.com', 'theblaze.com', 'wnd.com', 'foxnews.com', 'breitbart.com', 'washingtontimesreporter.com']
  }
  
  const searchDate = calculateDate(daysAgo);

  const events = await db.Event.findAll({
    include: [
    {
      model: db.Article,
      include: db.Source
    }],
    where: {
      createdAt: {
        [Op.gt]: searchDate
      }
    }
  });

  let results = {left:[], right:[]};

  //only return events that have at lest 3 articles 
  for (const event of events) {
    if (event.Articles.length > 3) {
      let right = event.Articles.filter(article => sourceUris.right.includes(article.Source.uri));
      let left = event.Articles.filter(article => sourceUris.left.includes(article.Source.uri));

      if (right.length === 0 && left.length > 0) {
        results.left.push(event);
      } else if (left.length === 0 & right.length > 0) {
        results.right.push(event);
      }
    }
  }

  results.right = sortEventsNewestFirst(results.right);
  results.left = sortEventsNewestFirst(results.left);

  return results;
};

const getTopEvents = async(daysAgo) => {
  const searchDate = calculateDate(daysAgo);

  const events = await db.Event.findAll({
    include: [{
      model: db.Article,
      include: db.Source
    }],
    where: {
      createdAt: {
        [Op.gt]: searchDate
      }
    }
  });

  //only consider events that have associated articles and have been reported by at least 8 sources
  let filteredBySources = events.filter(event => countValidSources(event.Articles) > 7);
  
  return sortEventsNewestFirst(filteredBySources);
}

const getEventSentiment = async(eventId) => {
  const event = await db.Event.find({
    include: [
    {
      model: db.Article,
      include: [db.Source, db.Sentiment]
    }],
    where: { id: eventId }
  });

  const result = calculateSentiment(event);
  return result;
};
  

module.exports = {
  getBalancedEvents,
  getTopEvents,
  getEventSentiment,
  getBiasedEvents
}