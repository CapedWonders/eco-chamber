const db = require('../models/index');
const Op = db.Sequelize.Op;
const helpers = require('../utils/dbHelpers.js');

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

// events by category
app.get('/api/events', wrap(async (req, res) => {
  const { categoryId } = req.query;

  // limit initial events to ones created by our system in the last 5 days
  const events = await helpers.getBalancedEvents(categoryId, 5);

  //only send back the info client cares about
  let results = events.map(x => {
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

//single event information with associated articles and sources
app.get('/api/events/articles', wrap(async (req, res) => {
  const { eventId } = req.query;
  const event = await db.Event.find({
    where: {
      id: eventId
    },
    include: {
      model: db.Article,
      include: {
        model: db.Source
      }
    }
  });
  res.json(event);
}));

app.get('/api/events/search', wrap(async (req, res) => {
  const { query } = req.query;
  const queries = query
    .split(' ')
    .map(word => {
      return { summary: { [Op.like]: `%${word}%` } }
    });

  const events = await db.Event.findAll({
    where: { [Op.and]: queries },
    order: [['date', 'DESC']],
  });

  res.json(events);
}));

//top events
app.get('/api/topEvents', wrap(async (req, res) => {
  
  // limit top events to ones created by our system in the last 5 days
  const events = await helpers.getTopEvents(5)

  //only send back the info client cares about
  let results = events.map(x => {
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
  const events = await helpers.getTopEvents(5);
  res.json(events);
}));

// event sentiment
app.get('/api/eventSentiment', wrap(async (req, res) => {
  const { eventId } = req.query;
  const result = await helpers.getEventSentiment(eventId);
  res.json(result);
}));

//single-sided events - reported on by left only and right only
app.get('/api/events/single-sided', wrap(async (req, res) => {
  let results = await helpers.getBiasedEvents(5);

  //only return what the client cares about
  results.right = results.right.map(event => {
    return {
      id: event.id,
      uri: event.uri,
      title: event.title,
      summary: event.summary,
      date: event.date
    }
  });

  results.left = results.left.map(event => {
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
