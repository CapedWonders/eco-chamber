import React, { Component } from 'react';
import moment from 'moment';
import ArticleDetail from './ArticleDetail.jsx';
var FaClose = require('react-icons/lib/fa/close');

class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      showModal: false
    }
    this.toggleSelected = this.toggleSelected.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  toggleSelected(e) {
    this.props.toggleArticle(this.props.article);
  }

  showModal() {
    this.toggleSelected();
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false})
  }

  render() {

    let isSelected = this.props.selected.filter(x=> x.id === this.props.article.id).length > 0;
    let isRated = this.props.ratings.filter(rating => rating.article.id === this.props.article.id).length > 0;

    return ( 
      <div>
        <div className="modal" style={{ display: this.state.showModal ? 'block' : 'none' }}>
          <div className="modal-content">
            <FaClose style={{"color":"darkgrey", "fontSize": 60}}onClick={this.closeModal}/>
            <ArticleDetail getRatings={this.props.getRatings} rated={isRated} article={this.props.article}/>
          </div>
        </div>

        <div onClick={this.toggleSelected} className={isSelected ? 'article article-selected' : 'article'}>
          <div className="article-title">
            <p>{this.props.article.title}</p>
          </div>
          <div className="article-card-bottom">
            <div className="article-date">
              <p>{moment(this.props.article.date).fromNow()}</p>
            </div>
            <button onClick={this.showModal} >View</button>     
          </div>
        </div>
      </div>
    )
  }
}

export default Article;