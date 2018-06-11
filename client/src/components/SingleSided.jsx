import React, { Component } from 'react';
import Api from '../helpers/Api';
import Auth from '../helpers/Auth';
import EventList from './EventList.jsx';

class SingleSided extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      rightEvents: [],
      leftEvents: [],
      showModal: false,
      selected: null,
      savedEvents: [],
      bias: 'left',
    };
  }

  componentDidMount() {
    this.updateEvents().then(res => this.getSavedEvents());
  }

  componentWillReceiveProps(props) {
    this.updateEvents(props);
  }

  updateEvents = () => {
    return Api.get('/events/single-sided').then(events => this.setState({rightEvents: events.right, leftEvents: events.left}));   
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

  handleChange = (e) => {
    this.setState({bias: e.target.value});
  }

  renderList = () => {
    const biasedEvents = this.state.bias === 'left' ? this.state.leftEvents : this.state.rightEvents;
    return biasedEvents.length === 0 
      ? (<div className="loading"><div className="loading-spinner"></div></div>)
      : (          
          <EventList
            add={this.saveEvent}
            remove={this.removedSaved} 
            selected={this.state.selected}
            open={this.showModal} 
            close= {this.closeModal} 
            remove={this.removeSaved} 
            saved={this.state.savedEvents} 
            events={biasedEvents} 
          />    
        );
  }

  render() {  
    const show = this.renderList();

    return (
      <ul className="events-container">                 
        <h1> Single Sided Events</h1>
        <form>         
          <select value={this.state.bias} onChange={this.handleChange}>
            <option value="left">Reported by left only</option> 
            <option value="right">Reported by right only</option>                                        
          </select>                 
        </form>     
        {show}
      </ul>
    )
  }
};

export default SingleSided;
