import React, { Component } from 'react';
import EventCard from './EventCard.jsx';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    this.updateEvents();
  }

  componentWillReceiveProps(props) {
    this.updateEvents(props);
  }

  updateEvents = (props = this.props) => {
    let events = [...props.events];
    events.sort((a, b) => b.date.localeCompare(a.date));
    this.setState({ events });
  }

  render() {
    let events = this.state.events.length === 0
      ? <div className="loading"><div className="loading-spinner"></div></div>
      : this.state.events.map(event =>
          <EventCard  
            event={event} 
            key={event.id}
            selected={this.props.selected}
            open={this.props.open}
            close={this.props.close}
            add={this.props.add}
            remove={this.props.remove}
            saved={this.props.saved.filter(x=> x.id === event.id).length > 0}
          />
        );

    return (
      <div className="events-list">
        <h1>{this.props.title}</h1>
        {events}
      </div>
    );
  }
}

export default EventList;
