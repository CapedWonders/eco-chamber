import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Api from '../helpers/Api';
import Sources from './Sources.jsx';
import ArticleList from './ArticleList.jsx';
import CompareArticles from './CompareArticles.jsx';
import moment from 'moment';
import WordMap from './WordMap.jsx';
import analyzeArticleTitles from '../helpers/WordMap.js';

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderedSources: [],
      articles: [],
      titleWords:{},
      weightedWords: [],
      selectedArticles: [],
      showModal: false,
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
    }); 
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

        this.setState({selectedArticles: state}, () => this.compareArticles());
      }   
    }
  }

  clearSelectedArticles() {
    this.setState({selectedArticles:[]});
  }

  compareArticles(e) {
    if (this.state.selectedArticles.length === 2) {
      this.setState({showModal: true});
    }
  }

  closeModal() {
    this.setState({showModal: false});
  }

  render() {
    const sources = this.state.orderedSources.map(x => {
      return (
        <li key={x[0].bias}>
          <Sources selected={this.state.selectedArticles} toggleArticle={this.toggleSelectedArticle} sources={x}/>
        </li>
      )
    });
  
    const articleDetails = 
    this.state.selectedArticles.length === 2 
      ? <CompareArticles clear= {this.clearSelectedArticles} close={this.closeModal} show={this.state.showModal} articles={this.state.selectedArticles}/>
      : <CompareArticles clear={this.clearSelectedArticles} show={this.state.showModal} articles={[{id: 1, title: '', body: '', sourceImage: '', Sentiments: [] }, {id: 1, title: '', body: '', sourceImage: '', Sentiments: [] }]}/>

    return (
      <div>
        <div className="event-top">        
          <WordMap width="500" height="300"className="word-map" data={this.state.weightedWords}/>    
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