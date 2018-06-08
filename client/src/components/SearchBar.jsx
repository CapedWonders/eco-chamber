import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
const FaSearch = require('react-icons/lib/fa/search');

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  onChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
  };

  onKeyUp = (e) => {
    if (e.key === 'Enter') {
      this.props.history.push(`/search-results/${this.state.value}`);
    }
  }

  render() {
    return (
      <div className="search-bar-container">
        <input
          onKeyUp={this.onKeyUp}
          onChange={this.onChange}
          size="40"
          className="search-input"
          placeholder="Search events..."
        />
        <Link to={`/search-results/${this.state.value}`}>
          <FaSearch style={{ color: 'white', fontSize: '20', marginTop: '0' }}/>
        </Link>
      </div>
    );
  }
};

export default withRouter(SearchBar);
