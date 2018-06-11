import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../helpers/Auth';
import Collapsible from 'react-collapsible';
const Earth = require('react-icons/lib/io/earth')

class Sidebar extends Component {
  constructor(props) {
    super(props)
  }

  renderLoggedInLinks = () => {
    return (
      <div className="sidebar-menu">
        <Collapsible className="menu-events-list" trigger="View News Events">
          <Link onClick={this.props.toggle} className="sidebar-event-item" to="/topEvents">Top Events</Link>
          <Link onClick={this.props.toggle} className="sidebar-event-item" to="/events/single-sided">Single Sided Events</Link>
          <Link onClick={this.props.toggle} className="sidebar-event-item" to="/category/11/events">Full Spectrum Events</Link>
        </Collapsible>
        <Link onClick={this.props.toggle} className="sidebar-menu-item" to="/game">Play Game</Link>  
        <Link onClick={this.props.toggle} className="sidebar-menu-item" to="/user/profile">My Profile</Link>    
        <Link onClick={this.props.toggle} className="sidebar-menu-item" to="/about">About</Link>  
      </div>
    );
  }

  renderLoggedOutLinks = () => {
    return (
      <div className="sidebar-menu">
        <Collapsible className="menu-events-list" trigger="View News Events">
          <Link onClick={this.props.toggle} className="sidebar-event-item" to="/topEvents">Top Events</Link>
          <Link onClick={this.props.toggle} className="sidebar-event-item" to="/events/single-sided">Single Sided Events</Link>
          <Link onClick={this.props.toggle} className="sidebar-event-item" to="/category/11/events">Full Spectrum Events</Link>
        </Collapsible>
        <Link onClick={this.props.toggle} className="sidebar-menu-item" to="/game">Play Game</Link> 
        <Link onClick={this.props.toggle} className="sidebar-menu-item" to="/about">About</Link>       
      </div>
    );
  }

  render() {
    const loggedInLinks = this.renderLoggedInLinks();
    const loggedOutLinks = this.renderLoggedOutLinks();
    const sideNavLinks = Auth.getJWT() ? loggedInLinks : loggedOutLinks;

    return (
      <div style={{display: this.props.show}} className="sidebar"> 
        {sideNavLinks}
      </div>
    );
  }
};

export default Sidebar;