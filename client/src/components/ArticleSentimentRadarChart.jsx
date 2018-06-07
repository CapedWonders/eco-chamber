import Chart from 'chart.js';
import React from 'react';
import { Radar } from 'react-chartjs-2';

class ArticleSentimentChartRadar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const title = this.props.sentiments.filter(x => x.title)[0];
    const body = this.props.sentiments.filter(x => x.body)[0];
    const data = title && body ? {
      labels: ['fear', 'disgust', 'anger', 'sadness', 'joy'],
      datasets: [
        {
          label: 'Title Emotions',
          backgroundColor: 'rgba(112,52,171,0.2)',
          borderColor: 'rgba(112,52,171,1)',
          pointBackgroundColor: 'rgba(179,181,198,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(179,181,198,1)',
          data: [title.fear, title.disgust, title.anger, title.sadness, title.joy]
        },
        {
          label: 'Text Emotions',
          backgroundColor: 'rgba(0,128,128,0.2)',
          borderColor: 'rgba(0,128,128,1)',
          pointBackgroundColor: 'rgba(255,99,132,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,1)',
          data: [body.fear, body.disgust, body.anger, body.sadness, body.joy]
        }
      ]
    } : null;
    
    return data ? (
      <div className='sentiment-chart'>
        <Radar data={data} />
      </div>
    ) : <div></div>
  }
};

export default ArticleSentimentChartRadar
