import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../helpers/Auth';

const onClick = () => {
  Auth.deleteJWT();
};

const Navbar = () => {
  const loggedInComponents = (
    <div className="nav-right">
      <Link to="/topEvents">Top Events</Link>
      <Link to="/myEvents">My Events</Link>
      <Link to="/" onClick={onClick}>Logout</Link>
    </div>
  );

  const loggedOutComponents = (
    <div className="nav-right">
      <Link to="/topEvents">Top Events</Link>
      <Link to="/signup">Sign Up</Link>  
      <Link to="/signin">Log in</Link>
    </div>
  );

  const rightNavComponents = Auth.getJWT() ? loggedInComponents : loggedOutComponents;

  return (
    <div className="navbar"> 
      <Link to="/" className="title">
        <h1>Eco-Chamber</h1>
      </Link>
      {rightNavComponents}
    </div>
  );
};

export default Navbar;
