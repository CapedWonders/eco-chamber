import Chart from 'chart.js';
import React from 'react';
import { Radar } from 'react-chartjs-2';



class EventSentimentChartRadar extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const leftData = this.props.left.sentiment 
      ? 
      {
        label: 'Left',
        backgroundColor: 'rgba(15, 27, 255, 0.2)',
        borderColor: 'rgba(15, 27, 255,1)',
        pointBackgroundColor: 'rgba(179,181,198,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(179,181,198,1)',
        data: [this.props.left.fear, this.props.left.disgust, this.props.left.anger, this.props.left.sadness, this.props.left.joy]
      }
      : null; 

    const rightData = this.props.right.sentiment 
      ? 
      {
        label: 'Right',
        backgroundColor: 'rgba(255, 15, 27,0.2)',
        borderColor: 'rgba(255, 15, 27,1)',
        pointBackgroundColor: 'rgba(179,181,198,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(179,181,198,1)',
        data: [this.props.right.fear, this.props.right.disgust, this.props.right.anger, this.props.right.sadness, this.props.right.joy]
      }
      : null; 

    const centerData = this.props.center.sentiment 
      ? 
      {
        label: 'Center',
        backgroundColor: 'rgba(0, 0, 0,0.2)',
        borderColor: 'rgba(0, 0, 0,1)',
        pointBackgroundColor: 'rgba(179,181,198,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(179,181,198,1)',
        data: [this.props.center.fear, this.props.center.disgust, this.props.center.anger, this.props.center.sadness, this.props.center.joy]
      }
      : null; 

    const calculateDataSets = () => {
      let datasets = [];

      if (leftData) {
        datasets.push(leftData);
      }
      if (rightData) {
        datasets.push(rightData);
      }
      if (centerData) {
        datasets.push(centerData)
      }
      return datasets;
    }

    const data = {
      labels: ['fear', 'disgust', 'anger', 'sadness', 'joy'],
      datasets: calculateDataSets()
    };

    if (data.datasets.length > 0) {
      return (
        <div className='sentiment-chart'>
          <Radar data={data} />
        </div>    
      )
    } else {
      return (<div></div>)
    }
  }
};

export default EventSentimentChartRadar