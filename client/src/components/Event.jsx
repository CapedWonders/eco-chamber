import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Api from '../helpers/Api';
import Sources from './Sources.jsx';
import ArticleList from './ArticleList.jsx';
import CompareArticles from './CompareArticles.jsx';
import ArticleDetail from './ArticleDetail.jsx';
import moment from 'moment';
import WordMap from './WordMap.jsx';
var FaClose = require('react-icons/lib/fa/close');
import analyzeArticleTitles from '../helpers/WordMap.js';
import Auth from '../helpers/Auth.js';

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderedSources: [],
      articles: [],
      titleWords:{},
      weightedWords: [],
      selectedArticles: [],
      showCompareModal: false,
      showArticleModal: false,
      selectedArticleforModal: [],
      ratings:[]
    };

    this.toggleSelectedArticle = this.toggleSelectedArticle.bind(this);
    this.compareArticles = this.compareArticles.bind(this);
    this.getMatchingSource = this.getMatchingSource.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.clearSelectedArticles = this.clearSelectedArticles.bind(this);
  }

  componentDidMount() {
    let { eventId } = this.props.match.params;
    Api.get('/sources', { eventId }).then(sources => {
      this.orderSources(sources);
      this.getAllArticles(sources);
      this.getWordMapData(this.state.articles);   
      this.getSavedRatings();
    }); 

  } 

  getSavedRatings = () => {
    let jwt = Auth.getJWT();
    if (jwt) {
      Api.get('/users/user-ratings').then(ratings => this.setState({ ratings }));
    }   
  }

  getAllArticles(allSources) {
    let allArticles = [];
    for (const source of allSources) {
      allArticles = allArticles.concat(source.Articles);
    }
    this.setState({articles: allArticles});
  }

  getWordMapData(articles) {
    const data = analyzeArticleTitles(articles);
    this.setState({ titleWords: data.words, weightedWords: data.weighted });
  }

  orderSources (allSources) {
    let farLeft = allSources.filter(source => source.bias === -2).sort((a, b) => a.Articles.length < b.Articles.length);
    let left = allSources.filter(source => source.bias === -1).sort((a, b) => a.Articles.length < b.Articles.length);
    let center = allSources.filter(source => source.bias === 0).sort((a, b) => a.Articles.length < b.Articles.length);
    let right = allSources.filter(source => source.bias === 1).sort((a, b) => a.Articles.length < b.Articles.length);
    let farRight = allSources.filter(source => source.bias === 2).sort((a, b) => a.Articles.length < b.Articles.length);
    
    this.setState({ "orderedSources": [ farLeft, left, center, right, farRight] });
  }

  getMatchingSource(sourceId) {
    let sources = this.state.orderedSources;
    for (const bias of sources) {
      for (const source of bias) {
        if (source.id === sourceId) {
          return source;
        }
      }
    }  
  }

  toggleSelectedArticle(article) { 

    let wasSelected = this.state.selectedArticles.filter(x => x.id === article.id);

    if (wasSelected.length > 0) {
      let current = this.state.selectedArticles;
      this.setState({selectedArticles: current.filter(x => x.id !== article.id) });
    } else {  
      if (this.state.selectedArticles.length === 2) {
        alert('please select two articles to compare');
      } else {
        let state = this.state.selectedArticles;
        let matchingSource = this.getMatchingSource(article.SourceId);
        article.sourceImage = matchingSource.image;
        article.bias = matchingSource.bias;
        state.push(article);
        state.sort((a, b) => a.bias > b.bias);

        this.setState({selectedArticles: state});
      }   
    }
  }

  clearSelectedArticles() {
    this.setState({selectedArticles:[]});
  }

  compareArticles(e) {
    if (this.state.selectedArticles.length === 2) {
      this.setState({showCompareModal: true});
    }
  }

  setArticleModal = (articleId) => {
    let matchingArticle = this.state.articles.filter(article => article.id === articleId);
    this.setState({selectedArticleforModal: matchingArticle[0], showArticleModal:true});
  }

  clearArticleModal = () => {
    this.setState({selectedArticleforModal: [], showArticleModal: false });
  }

  closeModal() {
    this.setState({showCompareModal: false});
  }

  render() {
    const articleModal = this.state.showArticleModal 
      ?  <div className="modal" style={{ display: 'block'}}>
          <div className="modal-content">
            <FaClose style={{"color":"darkgrey", "fontSize": 60}}onClick={this.clearArticleModal}/>
            <ArticleDetail 
              rated={this.state.ratings.filter(rating => rating.article.id === this.state.selectedArticleforModal.id).length > 0} 
              article={this.state.selectedArticleforModal}
            />
          </div>
        </div>
      : <div></div>

    const sources = this.state.orderedSources.map(x => {
      return (
        <li key={x[0].bias}>
          <Sources getRatings={this.getSavedRatings} ratings={this.state.ratings} selected={this.state.selectedArticles} toggleArticle={this.toggleSelectedArticle} sources={x}/>
        </li>
      )
    });

    const compareOne = 
    this.state.selectedArticles.length > 0
      ? <div id="article-compare-detail-one">
          <div className="article-compare-title">
            <FaClose onClick={()=> this.toggleSelectedArticle(this.state.selectedArticles[0])}/>
            {this.state.selectedArticles[0].title}
          </div>
          <button onClick={() => this.setArticleModal(this.state.selectedArticles[0].id)}>Rate Article</button>
        </div>
      : <div></div>

    const compareTwo = 
    this.state.selectedArticles.length === 2
      ? <div id="article-compare-detail-two">
          <div className="article-compare-title">
            <FaClose onClick={()=> this.toggleSelectedArticle(this.state.selectedArticles[1])}/>
            {this.state.selectedArticles[1].title}
          </div>
          <button onClick={() => this.setArticleModal(this.state.selectedArticles[1].id)}>Rate Article</button>
        </div>
      : <div></div>
  
    const articleDetails = 
    this.state.selectedArticles.length === 2 
      ? <CompareArticles clear= {this.clearSelectedArticles} close={this.closeModal} show={this.state.showCompareModal} articles={this.state.selectedArticles}/>
      : <CompareArticles clear={this.clearSelectedArticles} show={this.state.showCompareModal} articles={[{id: 1, title: '', body: '', sourceImage: '', Sentiments: [] }, {id: 1, title: '', body: '', sourceImage: '', Sentiments: [] }]}/>

    const compareButton = 
    this.state.selectedArticles.length === 2 
      ?  <div className="compare-bottom">
            <h3 onClick={this.compareArticles}>Compare Articles</h3>
          </div>
      : <div></div>

    return (
      <div>
        {articleModal}
        <div className="event-top">        
          <WordMap size="11" width="400" height="250"className="word-map" data={this.state.weightedWords}/>   
          <div className="compare-top">
            <div className="article-one">
              <h3>Select an article</h3>
              {compareOne}           
            </div>
            <div className="article-two">
              <h3>Select another article to compare</h3>
              {compareTwo}
            </div>
            {compareButton}
          </div>
          <div className="spectrum">
            <h2>left</h2>
            <h2>right</h2>
          </div>           
        </div>

        <div className="event-bottom">
          <div className="compare-articles">
            {articleDetails}
          </div> 

          <ul  className="articles-container">
            {sources}
          </ul>
        </div>
    </div>  
    );
  }
}

export default Event;