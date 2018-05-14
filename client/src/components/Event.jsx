import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Api from '../helpers/Api';
import Source from './Source.jsx';
import ArticleList from './ArticleList.jsx';

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: [],
    };
  }

  componentDidMount() {
    this.updateSources();
  }

  componentWillReceiveProps(props) {
    this.updateSources(props);
  }

  updateSources = (props = this.props) => {
    const { eventId } = props.match.params;
    Api.get('/sources', { eventId }).then(sources => this.setState({ sources }));
  }

  render() {
    const sources = this.state.sources.map(({ Articles, ...source }) => {
      return (
        <li key={source.id}>
          <Source source={source}/>
          <ArticleList articles={Articles}/>
        </li>
      );
    });
  
    return (
      <ul>
        {sources}
      </ul>
    );
  }
}

export default Event;
