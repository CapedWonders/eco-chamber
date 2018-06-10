
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Categories from './Categories.jsx';
import Navbar from './Navbar.jsx';
import Events from './Events.jsx';
import Event from './Event.jsx';
import Signup from './Signup.jsx';
import Signin from './Signin.jsx';
import TopEvents from './TopEvents.jsx';
import Gameboard from './Gameboard.jsx';
import SingleSided from './SingleSided.jsx';
import Profile from './Profile.jsx';
import Sidebar from'./Sidebar.jsx';
import About from './About.jsx';
import SearchResults from './SearchResults.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSidebar: false
    }
  }

  toggleSidebar = () => {
    const current = this.state.showSidebar;
    const toggled = current ? false : true;
    this.setState({showSidebar: toggled});
  }

  render() {
    const show = this.state.showSidebar ? "block" : "none";
    return ( 
      <div>
        <div className="header">
          <Navbar toggle={this.toggleSidebar}/>
          <Categories/>
          <Sidebar toggle={this.toggleSidebar} show={show}/>         
        </div>
        <Switch>
          <Route exact path='/' component={TopEvents}/>
          <Route path="/category/:categoryId/events" component={Events}/>
          <Route path="/event/:eventId/articles" component={Event}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/signin" component={Signin}/>
          <Route path="/topEvents" component={TopEvents}/>
          <Route path="/game" component={Gameboard}/>
          <Route path="/events/single-sided" component={SingleSided}/>
          <Route path="/user/profile" component={Profile}/>
          <Route path="/about" component={About}/>
          <Route path="/search-results/:query" component={SearchResults}/>
        </Switch>
      </div>
    );
  }
}

export default App;
