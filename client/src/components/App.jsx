import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Api from '../helpers/Api';
import Categories from './Categories.jsx';
import Navbar from './Navbar.jsx'
import Events from './Events.jsx';
import Event from './Event.jsx';
import Home from './Home.jsx';
import Signup from './Signup.jsx';
import Signin from './Signin.jsx'

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return ( 
      <div>
        <Navbar/>
        <Categories />
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path="/category/:categoryId/events" component={Events}/>
          <Route path="/event/:eventId/articles" component={Event}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/signin" component={Signin}/>
        </Switch>
      </div>
    );
  }
}

export default App;






