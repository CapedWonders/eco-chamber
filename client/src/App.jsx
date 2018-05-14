import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Header from './Header.jsx';
import Main from './Main.jsx';
// import sampleSources from '../../db/testData.js';
import { get } from './helpers/api';

class App extends Component {
  constructor(props) { 
    super(props);
    this.state = { 
      // articles: sampleSources.sampleArticles, 
      // events: sampleSources.sampleEvents,
      // sources: sampleSources.sampleSources 
    };
  }

  componentDidMount() {
    // get('/categories').then(categories => console.log(categories));
    // get('/events', { categoryId: 1 }).then(events => console.log(events));
    // get('/sources', { eventId: 1 }).then(sources => console.log(sources));
  }

  render() {  
    return (
      <div className="onboarding">
        <Header/>
        <Main state={this.state}/>
      </div>
    )  
  }; 
}

export default App;
