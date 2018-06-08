import React, { Component } from 'react';
import Api from '../helpers/Api';
import moment from 'moment';
import EventSentimentRadarChart from './EventSentimentRadarChart.jsx';
import BarChart from './BarChart.jsx';
import BarChartHelper from '../helpers/BarChart.js';

class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { left: {labels:[]}, right: {labels:[]}, center: {labels:[]}, articles: [], sources:[] };
  }

  componentDidMount() {
    let { eventId } = this.props;
    Api.get('/eventSentiment', { eventId }).then(sentiments => {
      this.setState({ left: sentiments.left , right: sentiments.right, center: sentiments.center });  
    }); 
    Api.get('/events/articles', { eventId }).then(event => {
      let sources = this.extractSources(event.Articles);
      this.setState({articles: event.Articles, sources: sources});
    });
  }

  extractSources(articles) {
    let sourceUris = [];
    let sources = [];

    for (const article of articles) {
      if (!sourceUris.includes(article.Source.uri)) {
        let source = {image: article.Source.image, title: article.Source.title};
        sourceUris.push(article.Source.uri);
        sources.push(source);
      }
    }
    return sources;
  }

  countLabels = (labels) => {
    let results = {positive: 0, negative: 0, neutral: 0};
    if (labels && labels.length > 0) {
      for (const label of labels) {
        results[label] = results[label] +=1;
      }
    }
    return results;
  }

  render() {
    const sources = this.state.sources.map(source => {
      return (
        <div key={source.id} className="event-source">
          <img src={source.image}></img>
          <h3>{source.title}</h3>
        </div>
      )
    });

    const labelData = {
      left: this.countLabels(this.state.left.labels),
      right: this.countLabels(this.state.right.labels),
      center:this.countLabels(this.state.center.labels)
    };

    const helper = new BarChartHelper(null, labelData);
    const data = helper.formatDataForEventResults();
   
    return (
      <div className="event-detail">     
        <h1 className="event-detail-title">{this.props.title}</h1>
        <h2>REPORTING SOURCES</h2>

        <div className="event-sources">
          {sources}
        </div>

        <div className="event-charts">
          <div className="event-radar">
            <h2>EVENT EMOTION ANALYSIS</h2>
            <EventSentimentRadarChart 
              left={this.state.left} 
              right={this.state.right}
              center={this.state.center}
              eventId={this.props.eventId} />
          </div> 

          <div className="event-bar">
            <h2>ARTICLE SENTIMENT</h2>
            <BarChart width={400} height={200} data={data}/>
          </div>
        </div>

      </div>     
    );
  }
}

export default EventDetail;
