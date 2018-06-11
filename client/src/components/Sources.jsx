import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Source from './Source.jsx';


class Sources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: this.props.sources,
      selected: this.props.sources[0],
      selectedIndex: 0
    };
  }

  toggleSelected = (e, leftOrRight) => {
    e.preventDefault();
    let currentIndex = this.state.selectedIndex;
    let sources = this.state.sources;

    if (leftOrRight === 'left') {
      if (currentIndex === 0) {
        this.setState({ selectedIndex: this.state.sources.length -1, selected: this.state.sources[this.state.sources.length -1]});
      } else {
        this.setState({ selectedIndex: currentIndex - 1, selected: this.props.sources[currentIndex - 1] });
      }    
    } else {
      if (currentIndex === this.state.sources.length -1) {
        this.setState({ selectedIndex: 0, selected: this.props.sources[0] });
      } else {
        this.setState({ selectedIndex: currentIndex + 1, selected: this.props.sources[currentIndex + 1] });
      }     
    }
  }

  renderSources = () => {
    return this.props.sources.map(({ Articles, ...source }) => {
      return (
        <div key={source.id}>
          <Source getRatings={this.props.getRatings} ratings={this.props.ratings} selected={this.props.selected} toggleArticle={this.props.toggleArticle} toggle={this.toggleSelected} articles={Articles} show={this.state.selected.id === source.id ? true: false} source={source}/>       
        </div>
      );
    });
  }
  render() { 
    const sourcesAll = this.renderSources();
  
    return (
      <div className="sources-list">
        <h3 className="num-sources">{this.props.sources.filter(source => source.Articles.length > 0).length}</h3>
        {sourcesAll}
      </div>
    )
  }
}

export default Sources;
 