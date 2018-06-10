import React, { Component } from 'react';
import moment from 'moment';
import ArticleDetail from './ArticleDetail.jsx';
var FaClose = require('react-icons/lib/fa/close');

class CompareArticles extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.clear();
    this.props.close();
  }

  render() {
    return ( 
      <div className="modal" style={{ display: this.props.show ? 'block' : 'none' }}>
        <div className="modal-content">
        <FaClose style={{"color":"darkgrey", "fontSize": 60}}onClick={this.handleClick}/>
          <div className="article-cols">
            <ArticleDetail rated={this.props.rated1} getRatings={this.props.getRatings} article={this.props.articles[0]}/>
            <ArticleDetail rated={this.props.rated2} getRatings={this.props.getRatings} article={this.props.articles[1]}/>
          </div>
        </div>
      </div>
    )
  }
}

export default CompareArticles;