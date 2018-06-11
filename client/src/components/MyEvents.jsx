import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Api from '../helpers/Api';
import EventList from './EventList.jsx';

class MyEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedEvents: [],
      selected: null
    };
  }

  componentDidMount() {
    Api.get('/users/user-events').then(savedEvents => {
      this.setState({ savedEvents });
    });
  }

  removeSaved = (e, eventId) => {
    Api.delete('/users/user-events', { eventId }).then(savedEvents => {
      this.setState({ savedEvents });
    });
  }

  closeModal = () => {
    this.setState({ selected: null});
  }

  showModal = (id) => {
    this.setState({ selected: id});
  }

  renderEvents = () => {
    return this.state.savedEvents.length === 0 
      ? (<ul className="events-container"><h1>No Saved Events</h1></ul>)
      : (
          <ul className="events-container">
            <h1> My Saved Events </h1>
              <EventList 
                selected={this.state.selected}
                open={this.showModal} 
                close= {this.closeModal} 
                remove={this.removeSaved} 
                saved={this.state.savedEvents} 
                events={this.state.savedEvents} 
              />
          </ul>
        );
  }

  render() {
    const show = this.renderEvents();
    return show
  }
};

export default MyEvents;
