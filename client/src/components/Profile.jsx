import React, { Component } from 'react';
import MyEvents from './MyEvents.jsx';
import Api from '../helpers/Api.js';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratings:[],
      leftRatings: [],
      rightRatings: [],
      centerRatings: []
    }
  }

  componentDidMount() {
    this.getRatings();
  }

  getRatings = () => {
    Api.get('/users/user-ratings')
       .then(ratings => this.setState({ ratings }, () => this.analyzeRatings()));
  }

  analyzeRatings = (ratings=this.state.ratings) => {
    const leftRatings = ratings.filter(rating => rating.source.bias === -1 || rating.source.bias === -2);
    const centerRatings = ratings.filter(rating => rating.source.bias === 0);
    const rightRatings = ratings.filter(rating => rating.source.bias === 1 || rating.source.bias === 2);

    this.setState({ leftRatings, centerRatings, rightRatings});
  }

  calculateBias = (ratings, titleOrArticleBias) => {
    if (ratings.length > 1) {
       const average = ratings.map(rating => rating[titleOrArticleBias]).reduce((a, b) => a + b ) / ratings.length;
       const rounded = Math.round(average);
       return rounded === -1 
          ? "Not Biased" 
          : rounded === 0 
            ? "Somewhat biased" 
            : rounded === 1 
              ? "Very Biased" 
              : rounded.toString();
    } else if (ratings.length === 1) {
      const bias = ratings[0][titleOrArticleBias];
      return bias === -1
        ? "Not Biased"
        : bias === 0
          ? "Somewhat Biased"
          : bias === 1
            ? "Very Biased"
            : bias.toString();
    }
    return null;
  }

  renderTitleBias = (leftRightOrCenter) => {
    return this.state[leftRightOrCenter + 'Ratings'].length === 0
      ? (<div></div>)
      : (<p>Titles: {this.calculateBias(this.state[leftRightOrCenter + 'Ratings'], 'titleBias')}</p>);
  }

  renderArticleBias = (leftRightOrCenter) => {
    return this.state[leftRightOrCenter + 'Ratings'].length === 0
      ? (<div></div>)
      : (<p>Articles: {this.calculateBias(this.state[leftRightOrCenter + 'Ratings'], 'articleBias')}</p>);

  }

  render() {
    const leftTitleBias = this.renderTitleBias('left');
    const centerTitleBias = this.renderTitleBias('center');
    const rightTitleBias = this.renderTitleBias('right');

    const leftArticleBias = this.renderArticleBias('left');
    const centerArticleBias = this.renderArticleBias('center');
    const rightArticleBias = this.renderArticleBias('right');

    return (
      <div className="profile">
        <div className="profile-data">
          <h1>My Rated Articles</h1>
          <div className = "ratings">           
            <div className="rating-data">
              <h4>LEFT</h4>
              <p>Articles reviewed: {this.state.leftRatings.length}</p>
              {leftTitleBias}
              {leftArticleBias}
            </div>
            <div className="rating-data">
              <h4>CENTER</h4>
              <p>Articles reviewed: {this.state.centerRatings.length}</p>
              {centerTitleBias}
              {centerArticleBias}
            </div>
            <div className="rating-data">
              <h4>RIGHT</h4>
              <p>Articles reviewed: {this.state.rightRatings.length}</p>
              {rightTitleBias}
              {rightArticleBias}
            </div>
          </div>    
        </div>
        <div className="profile-events">
          <MyEvents/>
        </div>
      </div>
    )
  }
}

export default Profile;