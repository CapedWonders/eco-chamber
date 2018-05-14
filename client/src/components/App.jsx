import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Api from '../helpers/Api';
import Category from './Category.jsx';
import Event from './Event.jsx';
import Home from './Home.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }

  componentDidMount() {
    Api.get('/categories').then(categories => this.setState({ categories }));
  }

  render() {
    const categories = this.state.categories.map(({ id, name }) => {
      return (
        <Link to={`/category/${id}`} className="CategoryLink" key={id}>
          {name}
        </Link>
      );
    });

    return (
      <div>
        <header>
          <h1>
            Eco-Chamber
          </h1>
          {categories}
        </header>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path="/category/:categoryId" component={Category}/>
          <Route path="/event/:eventId" component={Event}/>
        </Switch>
      </div>
    );
  }
}

export default App;
