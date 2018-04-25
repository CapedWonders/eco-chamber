import React, { Component } from 'react';
import Header from './Header.jsx';
import Main from './Main.jsx'
import sampleSources from '../../db/testData.js';



class App extends Component {
  constructor(props) {
  super(props);
  this.state = {
    articles: sampleSources.sampleArticles,
    events: sampleSources.sampleEvents,
    sources: sampleSources.sampleSources
  }
}

  render() {
    return (
      <div>
        <Header/> 
        <Main state={this.state}/>
      </div> 
    )  
  }; 
}




export default App;
