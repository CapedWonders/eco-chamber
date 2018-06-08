import React from 'react';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';

class EventWordCloud extends React.Component {
  constructor(props) {
    super(props);
  }
  

  fontSizeMapper = (word) => {
    return word.value / this.props.size
  }

  shouldComponentUpdate(newProps) {
    const oldData = this.props.data;
    const newData = newProps.data;
    //make sure to render the first time
    if (oldData.length === 0 && newData.length > 0) {
      return true;
    }
    //only re-render if the word algorithm has changed
    for (const item in oldData) {
      if (oldData[item].text !== newData[item].text || oldData[item].value !== newData[item].value) {
        return true;
      }
    }
    return false;
  }

  render() {
    return (
      
        <WordCloud
          width={this.props.width}
          height={this.props.height}
          data={this.props.data}
          fontSizeMapper={this.fontSizeMapper}
          padding={2}
        />
 
    );
   } 
};

export default EventWordCloud