import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import styles from './styles.css';

const Catagories = (props) => (

  <div className="wrapper">
    <div><Link to='/events'>World</Link></div>
    <div><Link to='/events'>US</Link></div>
    <div><Link to='/events'>Politics</Link></div>
    <div><Link to='/events'>Business</Link></div>
    <div><Link to='/events'>Tech</Link></div>
    <div><Link to='/events'>Art</Link></div>
    <div><Link to='/events'>Science</Link></div>
    <div><Link to='/events'>Sport</Link></div>
    <div><Link to='/events'>Food</Link></div>
  </div>
)

 




export default Catagories;