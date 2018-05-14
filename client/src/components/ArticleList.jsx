import React, { Component } from 'react';

class ArticleList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const articles = this.props.articles.map(({ id, title, url }) => {
      return (
        <li key={id}>
          <a href={url} target="_blank">{title}</a>
        </li>
      );
    });

    return (
      <ul>
        {articles}
      </ul>
    );
  }
}

export default ArticleList;
