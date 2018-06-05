import React, { Component } from 'react';
import Article from './Article.jsx';

class ArticleList extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const sorted = this.props.articles.sort((a, b) => a.date < b.date);
  
    const articles = this.props.articles.length ? sorted.map(article => {
      return (
        <Article getRatings={this.props.getRatings} ratings={this.props.ratings} selected={this.props.selected} toggleArticle={this.props.toggleArticle} key={article.id} article={article}/>
      )
    }) : 
    <div></div>
     
    return (
      <div className="article-body">
        {articles}
      </div>
    );
  }
}

export default ArticleList;