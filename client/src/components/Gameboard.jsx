import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Api from '../helpers/Api';
import WordMap from './WordMap.jsx';
import BarChart from './BarChart.jsx';
import analyzeArticleTitles from '../helpers/WordMap.js';
import BarChartHelper from '../helpers/BarChart.js';

class Gameboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEventId: '',
      events: [],
      sources: {right:[], center: [], left:[]},
      articles: [],
      weightedWords: [],
      selectedEvent: {Articles: []},
      selectedArticle: [],
      articleIndex: 0,
      completed: false,
      correct: null,
      score: {
        left: {
          correct: 0,
          incorrect: 0
        },
        right: {
          correct: 0,
          incorrect: 0
        },
        center:{
          correct: 0,
          incorrect: 0
        } 
      }      
    };

    this.setSources = this.setSources.bind(this);
    this.setEvent = this.setEvent.bind(this);
    this.setArticles = this.setArticles.bind(this);
    this.getWordMapData = this.getWordMapData.bind(this);
    this.newArticle = this.newArticle.bind(this);
    this.randomizeArticles = this.randomizeArticles.bind(this);
    this.finishedGame = this.finishedGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeArticle = this.handleChangeArticle.bind(this);
    this.resetScore = this.resetScore.bind(this);
  }

 componentDidMount() {
   Api.get('/gameEvents').then(events => {
     this.setState({ events, selectedEvent: events[0] }, () => {
      this.setEvent(events[0].id);
      this.setSources();
    });
   }); 
  } 

  newArticle() {
    let current = this.state.articleIndex;
    let newIndex = current === this.state.articles.length -1 ? 0 : current + 1;
    if (newIndex === 0) {
      this.finishedGame();
    } else {
       this.setState({articleIndex: newIndex, selectedArticle: this.state.articles[newIndex], correct: null});
    }  
  }

  finishedGame() {
    this.setState({finished: true});
  }

  setEvent(eventId) {
    let previous = this.state.selectedEvent.id;
    let event = this.state.events.filter(event => event.id === eventId)[0];
   
    let score = { left: {correct:0, incorrect:0}, right: {correct:0, incorrect: 0}, center: {correct: 0, incorrect: 0}};
    this.setState({ correct: null, finished: false, selectedEvent: event, score, eventId: event.id }, () =>  {
      this.getWordMapData(event.Articles);  
      this.setArticles("all");
      this.setSources();
    });
  }

  setSources() {
    let event = this.state.selectedEvent;
    let sources = {
      right: event.Articles.filter(article => article.Source.bias === 1 || article.Source.bias === 2).map(article => article.Source),
      center: event.Articles.filter(article => article.Source.bias === 0).map(article => article.Source),
      left: event.Articles.filter(article => article.Source.bias === -1 || article.Source.bias === -2).map(article => article.Source),
    }
    this.setState({ sources: sources });
  }
  
  resetScore() {
    let score = { left: {correct:0, incorrect:0}, right: {correct:0, incorrect: 0}, center: {correct: 0, incorrect: 0}};
    this.setState({ score, finished: false, correct: null, articleIndex: 0 });
  }

  setArticles(numArticles) {
    let event = this.state.selectedEvent;
    let articles = this.randomizeArticles(event.Articles);
    if (numArticles !== "all") {
      articles = articles.slice(0, parseInt(numArticles));
    }
    this.setState({ articles, selectedArticle: articles[0] }); 
    this.resetScore();
  }

  getWordMapData(articles) {
    const data = analyzeArticleTitles(articles);
    this.setState({ titleWords: data.words, weightedWords: data.weighted });
  }

  randomizeArticles(articles) { 
    var currentIndex = articles.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = articles[currentIndex];
      articles[currentIndex] = articles[randomIndex];
      articles[randomIndex] = temporaryValue;
    }

    return articles;
  }

  calculateBias(spectrum) {

    let sources = {
      left: [-1, -2],
      right: [1, 2],
      center: [0]
    };

    let currentScore = this.state.score;

    if (sources[spectrum].includes(this.state.articles[this.state.articleIndex].Source.bias)) {
      currentScore[spectrum].correct = currentScore[spectrum].correct + 1;
      this.setState({correct: true, score: currentScore});
    } else {
      currentScore[spectrum].incorrect = currentScore[spectrum].incorrect + 1;
      this.setState({correct: false, score: currentScore});
    }
  }

  handleChange(event) {
    this.setState({currentEventId: event.target.value}, () => this.setEvent(parseInt(this.state.currentEventId)));
  }

  handleChangeArticle(event) {
    this.setArticles(event.target.value);  
  }

  render() {
    const sources = this.state.sources;
    const rightSources = [... new Set(sources.right.map(source => source.image))].map(image => <img key={image} src={image}></img>);
    const centerSources = [... new Set(sources.center.map(source => source.image))].map(image => <img key={image} src={image}></img>);
    const leftSources = [... new Set(sources.left.map(source => source.image))].map(image => <img key={image} src={image}></img>);
    
    const eventOptions = this.state.events.map((event) => {
      let truncated = event.title.split(' ').slice(0, 8).join(' ');
      return (<option key={event.id} value={event.id}>{truncated + "..."}</option>);
    });

    const correct = this.state.correct === true
      ? (
        <div className="correct">
          <h3>Correct!</h3>
          <img src={this.state.selectedArticle.Source.image}></img>
          <p>{this.state.selectedArticle.Source.title}</p>
        </div>
        )
      : this.state.correct === false ? (<div id="try-again">Try Again</div>)
      : (<div></div>)

    const helper = new BarChartHelper(this.state.score, null);
    const barData = helper.formatDataForGameResults();

    const finished = this.state.finished 
      ? (<div className="game-results">
          <BarChart data={barData} width={200} height={100}/>
        </div>)
      : (<div>
          <div className="game-article">
            {correct}
          </div>
            <p className="remaining">{this.state.articles.length - this.state.articleIndex} articles remaining</p> 
            <button onClick={this.newArticle}>Next Article</button> 
        </div>)

    return this.state.events.length === 0 
      ? (<div className="loading"><div className="loading-spinner"></div></div>) 
      : (
        <div className="game-board">
          <h2>Is the article title from the left, center, or right side of the political spectrum?</h2>
          <hr/>
          <div className="game-cols">

            <div className ="game-event-col">
              <div className="game-title"> 
                <h1 className="game-number">1</h1>
                <h3>SELECT EVENT</h3>
              </div>
              <form>
                <select value={this.state.value} onChange={(e) => this.handleChange(e)}>
                  {eventOptions}
                </select>               
              </form>
              <Link to={"/event/" + this.state.eventId + "/articles"}>
                <WordMap size="20" width="350" height="200" className="word-map" data={this.state.weightedWords}/> 
              </Link>
              <div className="game-title">
                <h1 className="game-number">2</h1>
                <h3>SELECT NUMBER OF ARTICLES</h3>
              </div>
              <form>         
                <select value={this.state.numArticles} onChange={this.handleChangeArticle}>
                  <option value="all">All articles ({this.state.selectedEvent.Articles.length})</option> 
                  <option value="5">5 articles</option>
                  <option value="10">10 articles</option>
                  <option value="15">15 articles</option>                                         
                </select>                 
              </form> 
            </div>

            <div className="game-bias-col">
              <div className="game-title">
                <h1 className="game-number">3</h1>
                <h3>GUESS SPECTRUM</h3>
              </div>
              <a style={{color: 'inherit', textDecoration: 'none'}} target="_about" href={this.state.selectedArticle.url}>
                <div className="game-article-title">{this.state.selectedArticle.title}</div>
              </a>

              <div className="game-bias">
                <div onClick={() => this.calculateBias('right')} className="right">
                  RIGHT
                </div>
                <div onClick={() => this.calculateBias('center')} className="center">
                  CENTER
                </div>
                <div onClick={() => this.calculateBias('left')} className="left">
                  LEFT
                </div>               
              </div>
            </div> 

             <div className="game-results-col">
               <div className="game-title">
                 <h1 className="game-number">4</h1>
                 <h3>VIEW RESULTS</h3>
               </div>
              {finished}        
            </div>                  
            </div>
            
        </div>          
      )  
  }
}

export default Gameboard;