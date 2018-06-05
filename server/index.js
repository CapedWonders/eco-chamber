const db = require('../models/index');
const Op = db.Sequelize.Op;

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const boom = require('boom');
const exjwt = require('express-jwt');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const app = express();

const wrap = fn => (...args) => fn(...args).catch(args[2]);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(require('../swagger.json')));

// categories
app.get('/api/categories', wrap(async (req, res) => {
  const categories = await db.Category.findAll();
  res.json(categories);
}));

// events
app.get('/api/events', wrap(async (req, res) => {
  const { categoryId } = req.query;
  //only return events that have been reported on by the right and the left
  const leftSources = ['motherjones.com', 'huffingtonpost.com', 'msnbc.com', 'nytimes.com', 'theguardian.com'];
  const rightSources = ['breitbart.com', 'foxnews.com', 'ijr.com', 'theblaze.com', 'wnd.com', 'washingtontimesreporter.com'];
  
  // limit initial events to ones created by our system in the last 5 days
  const daysAgo = new Date(new Date() - (24*5) * 60 * 60 * 1000);

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
        [Op.gt]: daysAgo
      }
    }
  });

  const countValidSources = articles => {
    let sources = [];
    for (const article of articles) {
      if (!sources.includes(article.Source.uri)) {
        sources.push(article.Source.uri);
      }
    }
    return sources;
  }

  const isBalanced = articles => {
    let balanced = { right: 0, left:0}
    for (const article of articles) {
      if (leftSources.includes(article.Source.uri)) {
        balanced.left ++;
      } else if (rightSources.includes(article.Source.uri)) {
        balanced.right++;
      }
    }
    return balanced.right > 0 && balanced.left > 0;
  }

  //only return events that have associated articles and have been reported by at least 4 sources
  let filteredByArticles = events.filter(event => event.Articles.length > 0);
  let filteredBySources = filteredByArticles.filter(event => countValidSources(event.Articles).length > 3);
  let filteredBySpectrum = filteredBySources.filter(event => isBalanced(event.Articles));


  //sort results to come back newest first
  const sorted = filteredBySpectrum.sort((a, b) => {
    a = new Date(a.date);
    b = new Date(b.date);
    return a>b ? -1 : a<b ? 1 : 0;
  });

  //only send back the info client cares about
  let results = sorted.map(x => {
    return {
      id: x.id,
      uri: x.uri,
      title: x.title,
      summary: x.summary,
      date: x.date
    }
  });
 
  res.json(results);
}));

//top events
app.get('/api/topEvents', wrap(async (req, res) => {
  
  // limit top events to ones created by our system in the last 5 days
  const daysAgo = new Date(new Date() - (24*5) * 60 * 60 * 1000);

  const events = await db.Event.findAll({
    include: [{
      model: db.Article,
      include: db.Source
    }],
    where: {
      createdAt: {
        [Op.gt]: daysAgo
      }
    }
  });

  const countValidSources = articles => {
    let sources = [];
    for (const article of articles) {
      if (!sources.includes(article.Source.uri)) {
        sources.push(article.Source.uri);
      }
    }
    return sources;
  }

  //only consider events that have associated articles and have been reported by at least 8 sources
  let filteredBySources = events.filter(event => countValidSources(event.Articles).length > 7);
  

  //sort results to come back newest first
  const sorted = filteredBySources.sort((a, b) => {
    a = new Date(a.date);
    b = new Date(b.date);
    return a>b ? -1 : a<b ? 1 : 0;
  });

  //only send back the info client cares about
  let results = sorted.map(x => {
    return {
      id: x.id,
      uri: x.uri,
      title: x.title,
      summary: x.summary,
      date: x.date
    }
  }); 
  res.json(results);
}));

// top events with articles and sources included for game
app.get('/api/gameEvents', wrap(async  (req, res) => {
  // limit top events to ones created by our system in the last 5 days
  const daysAgo = new Date(new Date() - (24*5) * 60 * 60 * 1000);

  const events = await db.Event.findAll({
    include: [{
      model: db.Article,
      include: db.Source
    }],
    where: {
      createdAt: {
        [Op.gt]: daysAgo
      }
    }
  });

  const countValidSources = articles => {
    let sources = [];
    for (const article of articles) {
      if (!sources.includes(article.Source.uri)) {
        sources.push(article.Source.uri);
      }
    }
    return sources;
  }

  //only consider events that have associated articles and have been reported by at least 8 sources
  let filteredBySources = events.filter(event => countValidSources(event.Articles).length > 7);

  res.send(filteredBySources);
}));

// event sentiment
app.get('/api/eventSentiment', wrap(async (req, res) => {
  const { eventId } = req.query;
  
  const event = await db.Event.find({
    include: [
    {
      model: db.Article,
      include: [db.Source, db.Sentiment]
    }],
    where: { id: eventId }
  });

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
      } 
    }
    //average all values
    for (let  item in totals) {
      totals[item] = totals[item] / numSentiments;
    }

    return totals;
  }

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

  const result = calculateSentiment(event);
  res.json(result);
}));

//single-sided events - reported on by left only and right only
app.get('/api/events/single-sided', wrap(async (req, res) => {
  const sourceUris = {
    left: ['motherjones.com', 'huffingtonpost.com', 'msnbc.com', 'nytimes.com', 'theguardian.com', 'latimes.com'],
    right: ['ijr.com', 'theblaze.com', 'wnd.com', 'foxnews.com', 'breitbart.com', 'washingtontimesreporter.com']
  }

  // limit initial events to ones created by our system in the last 5 days
  const daysAgo = new Date(new Date() - (24*5) * 60 * 60 * 1000);

  const events = await db.Event.findAll({
    include: [
    {
      model: db.Article,
      include: [{
        model: db.Source,
      }]
    }],
    where: {
      createdAt: {
        [Op.gt]: daysAgo
      }
    }
  });

  //only return events that have at least 4 associated articles and have been reported on by requested bias
  let filteredByArticles = events.filter(event => event.Articles.length > 3);
  let results = {left:[], right:[]};

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

  //sort results to come back newest first
  results.right = results.right.sort((a, b) => {
    a = new Date(a.date);
    b = new Date(b.date);
    return a>b ? -1 : a<b ? 1 : 0;
  }).map(event => {
    return {
      id: event.id,
      uri: event.uri,
      title: event.title,
      summary: event.summary,
      date: event.date
    }
  });

  results.left = results.left.sort((a, b) => {
    a = new Date(a.date);
    b = new Date(b.date);
    return a>b ? -1 : a<b ? 1 : 0;
  }).map(event => {
    return {
      id: event.id,
      uri: event.uri,
      title: event.title,
      summary: event.summary,
      date: event.date
    }
  });;
  res.json(results);
}))

// sources, for a given event, returned in order of bias from far left to far right
// includes Articles and Sentiments
app.get('/api/sources', wrap(async (req, res) => {
  const { eventId } = req.query;
  const sourceUris = [
    'motherjones.com', 'huffingtonpost.com', 'msnbc.com', 'nytimes.com', 'hosted.ap.org', 
    'thehill.com', 'foxnews.com', 'breitbart.com', 'npr.org', 'washingtontimesreporter.com', 
    'theguardian.com', 'latimes.com', 'ijr.com', 'theblaze.com', 'wnd.com'
  ];

  const sources = await db.Source.findAll({
    where: {  
      uri: sourceUris,
    },
    include: [{
      model: db.Article,
      where: { eventId },
      required: false,
      include: db.Sentiment,
    }],
    order:  ['bias'],
  });

  res.json(sources);
}));

// users
app.post('/api/users', wrap(async (req, res) => {
  const { email, password, bias } = req.body;
  const user = await db.User.findOne({ where: { email } });
  if (user) throw boom.badRequest('Email already exists');

  const hash = await bcrypt.hash(password, 10);
  const newUser = await db.User.create({ email, bias, password: hash });
  res.json(newUser);
}));

app.get('/api/users/user-events', exjwt({ secret: 'secret' }), wrap(async (req, res) => {
  const { id } = req.user;
  const user = await db.User.findById(id);
  if (!user) throw boom.notFound(`Cannot find user with id: ${id}`);

  const events = await user.getEvents();
  res.json(events);
}));

app.post('/api/users/user-events', exjwt({ secret: 'secret' }), wrap(async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  const user = await db.User.findById(userId);
  if (!user) throw boom.notFound(`Cannot find user with id: ${userId}`);

  const event = await db.Event.findById(eventId);
  if (!event) throw boom.notFound(`Cannot find event with id: ${eventId}`);

  await user.addEvent(event);
  res.json(user);
}));

app.delete('/api/users/user-events', exjwt({ secret: 'secret' }), wrap(async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.query;

  const user = await db.User.findById(userId);
  if (!user) throw boom.notFound(`Cannot find user with id: ${userId}`);

  const event = await db.Event.findById(eventId);
  if (!event) throw boom.notFound(`Cannot find event with id: ${eventId}`);

  await user.removeEvent(event);

  const events = await user.getEvents();
  res.json(events);
}));

app.get('/api/users/user-ratings', exjwt({ secret: 'secret' }), wrap(async (req, res) => {
  const userId = req.user.id;
  const user = await db.User.findById(userId);
  if (!user) throw boom.notFound(`Cannot find user with id: ${id}`);
  const ratings = await db.Rating.findAll({
    include: [{
      model: db.User,
      where: {
        id: userId
      }
    }, 
    {
      model: db.Article,
      include: db.Source
    }]
  });

  const results = ratings.map(rating => {
    return {
      article: rating.Article,
      source: rating.Article.Source,
      informed: rating.informed,
      articleBias: rating.articleBias,
      titleBias: rating.titleBias,
      sourceTrust: rating.sourceTrust
    }
  })

  res.json(results);
}));

app.post('/api/users/user-ratings', exjwt({ secret: 'secret' }), wrap(async (req, res) => {
  const userId = req.user.id;
  const { informed, titleBias, articleBias, sourceTrust, articleId } = req.body;

  const user = await db.User.findById(userId);
  const article = await db.Article.findById(articleId);
  const rating = await db.Rating.create({ informed, titleBias, articleBias, sourceTrust });

  await article.addRating(rating);
  await user.addRating(rating);
  res.json(user);
}));

// auth
app.get('/api/auth/login', wrap(async (req, res) => {
  const { email, password } = req.query;
  const user = await db.User.findOne({ where: { email } });
  if (!user) throw boom.badRequest('User does not exist');

  const authorized = await bcrypt.compare(password, user.password);
  if (!authorized) throw boom.unauthorized('Email/password incorrect');

  const token = jwt.sign({ id: user.id }, 'secret');
  res.json(token);
}));

// serve index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  if (err.isBoom) {
    const { payload } = err.output;
    res.status(payload.statusCode).json(payload);
  } else if (err.name === 'UnauthorizedError') {
    if (!req.user) res.status(401).json('Invalid jwt');
  } else {
    res.status(500).json('Whoops! Something went wrong. Check the server logs.');
  }
});

app.listen(3000, () => console.log('Listening on port 3000!'));
