import React, { Component } from 'react';
import ArticleList from './ArticleList.jsx';
import FaCaretLeft from 'react-icons/lib/fa/caret-left';
import FaCaretRight from 'react-icons/lib/fa/caret-right';


class Source extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title } = this.props.source;
    const { image } = this.props.source;

    return (
      <div className={this.props.show ? "showSource" : "hideSource"}>
        <div className="source-image">       
          <FaCaretLeft onClick={(e) => this.props.toggle(e, 'left')} className="fa-caret-left"/>
          <img src={image}></img>
          <FaCaretRight onClick={(e) => this.props.toggle(e, 'right')} className="fa-caret-right"/>
        </div>
        <div className="source-title">       
          <h2>{title}</h2>
        </div>
        <ArticleList 
          getRatings={this.props.getRatings} 
          ratings={this.props.ratings} 
          selected={this.props.selected} 
          toggleArticle={this.props.toggleArticle} 
          articles={this.props.articles}
        /> 
      </div>
    );
  }
}

export default Source;