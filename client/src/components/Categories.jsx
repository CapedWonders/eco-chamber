import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import Api from '../helpers/Api';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      categories: [], 
    };
  }

  componentDidMount() {
    Api.get('/categories').then(categories => {
      categories.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      this.setState({ categories });
    });
  }

  render() {
    const categories = this.state.categories.map(({ id, name }) => {
      return (
        <NavLink to={`/category/${id}/events`} className="category" activeClassName="selected-category" key={id}>
          {name}
        </NavLink>       
      );
    });

    return (
      <div className="categories">
        {categories}
      </div>
    );
  }
}

export default Categories;
