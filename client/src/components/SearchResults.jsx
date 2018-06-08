import React, { Component } from 'react';
import Api from '../helpers/Api';
import Auth from '../helpers/Auth';
import EventList from './EventList.jsx';

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      showModal: false,
      selected: null,
      savedEvents: [],
      loading: true,
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
    let { query } = props.match.params;
    Api.get('/events/search', { query }).then(events => {
      this.setState({
        events,
        loading: false,
      });
    });
  }

  getSavedEvents = () => {
    if (Auth.getJWT()) {
      Api.get('/users/user-events').then(savedEvents => this.setState({ savedEvents }));
    } 
  }

  removeSaved = (e, eventId) => {  
    Api.delete('/users/user-events', { eventId }).then(res => this.getSavedEvents());
  }

  saveEvent = (e, eventId) => {
    Api.post('/users/user-events', { eventId }).then(res => this.getSavedEvents());
  }

  closeModal = () => {
    this.setState({ selected: null});
  }

  showModal = (id) => {
    this.setState({ selected: id});
  }

  render() {
    let searchResults;

    if (this.state.loading) {
      searchResults = <div className="loading"><div className="loading-spinner"></div></div>;
    } else if (this.state.events.length === 0) {
      searchResults = <ul className="events-container"><h1>No Results</h1></ul>;
    } else {
      searchResults = (
        <ul className="events-container">
          <h1> Search Results </h1>
          <EventList 
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

    return searchResults;
  }
}

export default SearchResults;
