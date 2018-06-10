import React, { Component } from 'react';
import moment from 'moment';
import ArticleDetail from './ArticleDetail.jsx';
import FaClose from 'react-icons/lib/fa/close';

class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      showModal: false
    }
  }

  toggleSelected = (e) => {
    this.props.toggleArticle(this.props.article);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  showModal = () => {
    this.toggleSelected();
    this.setState({showModal: true});
  }

  closeModal = () => {
    this.setState({showModal: false});
  }

  render() {
    let preview = this.props.article.body.split(' ').slice(0, 10).join(' ') + '...';
    let isSelected = this.props.selected.filter(x=> x.id === this.props.article.id).length > 0;
    let isRated = this.props.ratings.filter(rating => rating.article.id === this.props.article.id).length > 0;

    return ( 
      <div>
        <div onClick={this.toggleSelected} className={isSelected ? 'article article-selected' : 'article'}>
          <div className="article-title">
            <p>{this.props.article.title}</p>            
          </div>
          <div className="article-card-bottom">
            <p className="preview">{preview}</p>
            <div className="article-date">
              <p>{moment(this.props.article.date).fromNow()}</p>
            </div>   
          </div>
        </div>
      </div>
    )
  }
}

export default Article;