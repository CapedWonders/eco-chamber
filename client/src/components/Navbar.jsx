import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../helpers/Auth';
import SearchBar from './SearchBar.jsx';
import Bars from 'react-icons/lib/fa/bars';

const onClick = () => {
  Auth.deleteJWT();
};

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  renderLoggedInLinks = () => {
    return (
      <div className="nav-right">
        <Link to="/user/profile">My Profile</Link>
        <Link to="/" onClick={onClick}>Logout</Link>
      </div>
    );
  }

  renderLoggedOutLinks = () => {
    return (
      <div className="nav-right">
        <Link to="/signup">Sign Up</Link>  
        <Link to="/signin">Log in</Link>
      </div>
    );
  }

  render() {
    const loggedInLinks = this.renderLoggedInLinks();
    const loggedOutLinks = this.renderLoggedOutLinks()
    const rightNavLinks = Auth.getJWT() ? loggedInLinks : loggedOutLinks;

    return (
      <div className="navbar"> 
        <div className="title"> 
          <Bars onClick={this.props.toggle} style={{marginTop: 0, fontSize: 20}} className="side-menu-icon"/>
          <Link to="/" style={{ "textDecoration": "none", "color": "white" }}>
            <h1>Eco-Chamber</h1>
          </Link>
        </div>
        <SearchBar/>
        {rightNavLinks}
      </div>
    );
  }
};

export default Navbar;
