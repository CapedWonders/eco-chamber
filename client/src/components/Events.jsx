import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Api from '../helpers/Api';
import moment from 'moment';
import EventDetail from './EventDetail.jsx';
var FaStarO = require('react-icons/lib/fa/star-o');
var FaStarC = require('react-icons/lib/fa/star');
var FaLineChart = require('react-icons/lib/fa/line-chart');
var FaClose = require('react-icons/lib/fa/close');

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      showModal: false,
      selected: null,
      savedEvents: []
    };
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getSavedEvents = this.getSavedEvents.bind(this);
  }

  componentDidMount() {
    this.getSavedEvents();
  }

  componentWillReceiveProps(props) {
    this.updateEvents(props);
  }

  updateEvents = (props = this.props) => {
    const { categoryId } = props.match.params;
    Api.get('/events', { categoryId }).then(events => this.setState({ events }));
  }

  getSavedEvents() {
    Api.get('/users/user-events').then(savedEvents => this.setState({ savedEvents }));
  }
  
  onClick = (e, eventId) => {  
    Api.post('/users/user-events', { eventId }).then(res => this.getSavedEvents());
  }

  removeSaved = (e, eventId) => {  
    Api.delete('/users/user-events', { eventId }).then(res => this.getSavedEvents());
  }

  closeModal() {
    this.setState({ selected: null});
  }

  showModal(id) {
    this.setState({ selected: id});
  }

  render() {
    
    const events = this.state.events.map(({ id, title, summary, date, Articles }) => {
      let formatted = moment(date).fromNow();

      return (
        <div className="event-list" key = {id}>
          <li className="event-item">
            <Link style={{"textDecoration": "none", "color": "black", "padding": "10px"}} to={{
              pathname: `/event/${id}/articles`,
              state: { title, date }}}>
              <h2  className="li-header">{title}</h2>
              <p>{formatted}</p>
            </Link>
            
            <div className="event-list-item-right">      
              <div value={id} className="event-text">
                <p>{summary}</p>
              </div>

              <div className = "event-icons">
                <FaLineChart onClick={() => this.showModal(id)} className="event-chart-icon"/>
                
                <FaStarO 
                  style={{display: this.state.savedEvents.filter(event => event.id === id).length === 0
                    ? 'block'
                    : 'none' }}
                  className="event-star-icon" 
                  onClick={(e) => {this.onClick(e, id)}}/>
                <FaStarC 
                  style={{display: this.state.savedEvents.filter(event => event.id === id).length > 0
                    ? 'block'
                    : 'none' }}
                  className="event-star-icon" 
                  onClick={(e) => {this.removeSaved(e, id)}}/>
              </div>

               <div className="modal" style={{ display: this.state.selected === id ? 'block' : 'none' }}>
                <div className="modal-content">
                  <FaClose style={{"color":"darkgrey", "fontSize": 60}} onClick={this.closeModal}/>
                  <EventDetail eventId={id}/>
                </div>
              </div>
            </div>    
          </li>
        <hr/>
      </div>

      );
    });
  
    return (
      <ul className="events-container">
        {events}
      </ul>
    );
  }
}

export default Events;
