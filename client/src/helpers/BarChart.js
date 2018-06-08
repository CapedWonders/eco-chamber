'use strict'

export default class BarChartHelper {
  constructor(score, labels) {
    this.score=score;
    this.labels=labels;
  }

  formatDataForGameResults() {   
    const data = {
      labels: ['Left', 'Center', 'Right'],
      datasets: [
        {
          label: 'Correct',
          backgroundColor: 'rgba(0, 128, 128, 0.2)',
          borderColor: 'rgba(0, 128, 228 ,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(0, 128, 128, 0.4)',
          hoverBorderColor: 'rgba(0, 128, 128, 1)',
          data: [this.score.left.correct, this.score.center.correct, this.score.right.correct]
        },
         {
          label: 'Incorrect',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(0, 0, 0, 0.4)',
          hoverBorderColor: 'rgba(0, 0, 0, 1)',
          data: [this.score.left.incorrect, this.score.center.incorrect, this.score.right.incorrect]
        }
      ]
    }
    return data;
  }

  formatDataForEventResults() {
    const data = {
      labels: ['Left', 'Center', 'Right'],
      datasets: [
       {
          label: 'Positive',
          backgroundColor: 'rgba(0, 128, 128, 0.2)',
          borderColor: 'rgba(0, 128, 128, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(0, 128, 128, 0.8)',
          hoverBorderColor: 'rgba(0, 128, 128, 1)',
          data: [this.labels.left.positive, this.labels.center.positive, this.labels.right.positive]
        },
         {
          label: 'Neutral',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(0, 0, 0, 0.8)',
          hoverBorderColor: 'rgba(0, 0, 0, 1)',
          data: [this.labels.left.neutral, this.labels.center.neutral, this.labels.right.neutral]
        },
         {
          label: 'Negative',
          backgroundColor: 'rgba(255, 255, 0, .4)',
          borderColor: 'rgba(255, 255, 0, .8)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255, 255, 0, 1)',
          hoverBorderColor: 'rgba(255, 255, 0, .8)',
          data: [this.labels.left.negative, this.labels.center.negative, this.labels.right.negative]
        },
      ]
    }
    return data;
  }
};



