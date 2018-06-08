import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import moment from 'moment';
import EventDetail from './EventDetail.jsx';
var FaStarO = require('react-icons/lib/fa/star-o');
var FaStarC = require('react-icons/lib/fa/star');
var FaLineChart = require('react-icons/lib/fa/line-chart');
var FaClose = require('react-icons/lib/fa/close');

class EventCard extends Component {
  constructor(props) {
    super(props);
  }
 
  render() {
    const { title, date, id, summary } = this.props.event;
    const formatted = moment(date).fromNow();

    return (
    <div>
      <li className="event-item" key={id}>
        <div className="event-item-top">
          <Link style={{"textDecoration": "none", "color": "black", "padding": "10px"}} to={{
            pathname: `/event/${id}/articles`,
            state: { title , date }}}>

            <h2 className="li-header">{title}</h2>
             
            <div value={id} className="event-text">
              <p>{summary}</p>
            </div>
          </Link>
        </div>
    
        <div className="event-item-bottom">    
          <p className="event-card-date">{formatted}</p>  
          <div className = "event-icons">
            <FaLineChart onClick={() => this.props.open(id)} className="event-chart-icon"/>
            <FaStarO 
              style={{display: this.props.saved ? 'none' : 'block'}}
              className="event-star-icon" 
              onClick={(e) => {this.props.add(e, id)}}/>
            <FaStarC 
              style={{display: this.props.saved ? 'block' : 'none'}}
              className="event-star-icon" 
              onClick={(e) => {this.props.remove(e, id)}}/>
          </div>
        </div>    
      </li>
      <div className="modal" style={{ display: this.props.selected === id ? 'block' : 'none' }}>
            <div className="modal-content">
              <FaClose style={{"color":"darkgrey", "fontSize": 60}} onClick={this.props.close}/>
              <EventDetail title={title} eventId={id}/>
            </div>
          </div>
      <hr/>
    </div>)
  }
}

export default EventCard;