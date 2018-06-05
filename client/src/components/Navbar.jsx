import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../helpers/Auth';
var Bars = require('react-icons/lib/fa/bars');

const onClick = () => {
  Auth.deleteJWT();
};

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const loggedInComponents = (
      <div className="nav-right">
        <Link to="/user/profile">My Profile</Link>
        <Link to="/" onClick={onClick}>Logout</Link>
      </div>
    );

    const loggedOutComponents = (
      <div className="nav-right">
        <Link to="/signup">Sign Up</Link>  
        <Link to="/signin">Log in</Link>
      </div>
    );

    const rightNavComponents = Auth.getJWT() ? loggedInComponents : loggedOutComponents;

    return (
      <div className="navbar"> 
        <div className="title"> 
          <Bars onClick={this.props.toggle} style={{marginTop: 0, fontSize: 20}} className="side-menu-icon"/>
          <h1>Eco-Chamber</h1> 
        </div>
        {rightNavComponents}
      </div>
    );
  }
};

export default Navbar;
