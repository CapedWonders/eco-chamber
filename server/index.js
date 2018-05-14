const db = require('../models/index');

const bodyParser = require('body-parser');
const express = require('express');
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
  // TODO: limit events to last X days
  const { Subcategories } = await db.Category.findById(categoryId, {
    include: [{
      model: db.Subcategory,
      include: db.Event,
    }],
  });

  let events = [];
  let ids = {};
  for (const subcategory of Subcategories) {
    for (const event of subcategory.Events) {
      if (!ids[event.id]) {
        events.push(event);
        ids[event.id] = true;
      }
    }
  }

  res.json(events);
}));

// sources
app.get('/api/sources', wrap(async (req, res) => {
  const { eventId } = req.query;
  const sourceUris = ['huffingtonpost.com', 'msnbc.com', 'nytimes.com', 'hosted.ap.org', 'thehill.com', 'foxnews.com', 'breitbart.com'];
  const sources = await db.Source.findAll({
    where: {
      uri: sourceUris,
    },
    include: [{
      model: db.Article,
      where: { eventId },
      required: false
    }],
  });
  res.json(sources);
}));

// serve index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.listen(3000, () => console.log('Listening on port 3000!'));
