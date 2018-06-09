import Chart from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

class BarChart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Bar
          data={this.props.data}
          width={this.props.width}
          height={this.props.height}
          options={{
            falseresponsive: false, 
            maintainAspectRatio: true
          }}
        />
      </div>
    );
  }
};

export default BarChart