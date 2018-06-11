import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Api from '../helpers/Api';
import EventList from './EventList.jsx';
import Auth from '../helpers/Auth.js';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      showModal: false,
      selected: null,
      savedEvents: [],
    };
  }

  componentDidMount() {
    this.updateEvents();
    this.getSavedEvents();
  }

  componentWillReceiveProps(props) {
    this.updateEvents(props);
  }

  updateEvents = (props = this.props) => {
    const { categoryId } = props.match.params;
    Api.get('/events', { categoryId }).then(events => this.setState({ events }));
  }

  getSavedEvents = () => {
    if (Auth.getJWT()) {
      Api.get('/users/user-events').then(savedEvents => this.setState({ savedEvents }));
    }
  }

  saveEvent = (e, eventId) => {  
    Api.post('/users/user-events', { eventId }).then(res => this.getSavedEvents());
  }

  removeSaved = (e, eventId) => {  
    Api.delete('/users/user-events', { eventId }).then(res => this.getSavedEvents());
  }

  closeModal = () => {
    this.setState({ selected: null});
  }

  showModal = (id) => {
    this.setState({ selected: id});
  }

  render() {
    const title = `This week's full spectrum events`;
    return (
      <ul className="events-container">
        <EventList
          title={title}
          selected={this.state.selected}
          open={this.showModal} 
          close= {this.closeModal} 
          add={this.saveEvent} 
          remove={this.removeSaved} 
          saved={this.state.savedEvents} 
          events={this.state.events} 
        />
      </ul>
    );
  }
}

export default Events;
