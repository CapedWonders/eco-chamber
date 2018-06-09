import React, { Component } from 'react';
import moment from 'moment';
import ArticleSentimentRadarChart from './ArticleSentimentRadarChart.jsx';
import Api from '../helpers/Api';
import Auth from '../helpers/Auth';

class ArticleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      informed: '',
      titleBias: '',
      articleBias: '',
      sourceTrust: '',
    }
  }

  handleOptionChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: parseInt(value) });
  }

  handleSubmit = (e) => {
    let jwt = Auth.getJWT();
    if (!jwt) {
      alert("You must be logged in to review articles");
    } else {
      if (this.state.informed !== '' && this.state.titleBias !== '' && this.state.articleBias !== '' && this.state.sourceTrust !== '') {
        this.saveRating(this.props.article.id);  
      } else {
        alert("Please answer all questions to save your review");
      }       
    }
  }

  saveRating = (articleId) => {
    const { informed, titleBias, articleBias, sourceTrust } = this.state;
    Api.post('/users/user-ratings', { informed, titleBias, articleBias, sourceTrust, articleId })
       .then(res => {
          this.setState({ informed: '', titleBias: '', articleBias: '', sourceTrust: ''});
          this.props.getRatings();
      });    
  }

  render() {
    const form = this.props.rated ? <div><h3>You have already rated this article</h3></div> :
      <div className="article-rating">
        <form>
          <div className="radio">
            <p>I am more informed after reading this article</p>
            <label>
              <input name="informed" type="radio" value={-1}
                     checked={this.state.informed === -1} 
                     onChange={this.handleOptionChange}/>
              No
            </label>
          </div>
          <div className="radio">
            <label>
              <input name="informed" type="radio" value={0} 
                     checked={this.state.informed === 0} 
                     onChange={this.handleOptionChange} />
              Somewhat
            </label>
          </div>
          <div className="radio">
            <label>
              <input name="informed" type="radio" value={1} 
                     checked={this.state.informed === 1} 
                     onChange={this.handleOptionChange} />
              Yes
            </label>
          </div>
        </form>

        <form>
          <div className="radio">
            <p>How biased is this article title?</p>
            <label>
              <input name="titleBias" type="radio" value={-1}
                     checked={this.state.titleBias === -1} 
                     onChange={this.handleOptionChange}/>
              Not biased
            </label>
          </div>
          <div className="radio">
            <label>
              <input name="titleBias" type="radio" value={0}
                     checked={this.state.titleBias === 0} 
                     onChange={this.handleOptionChange} />
              Somewhat biased
            </label>
          </div>
          <div className="radio">
            <label>
              <input name="titleBias" type="radio" value={1} 
                     checked={this.state.titleBias === 1} 
                     onChange={this.handleOptionChange} />
              Very biased
            </label>
          </div>
        </form>

        <form>
          <div className="radio">
            <p>How biased is this article?</p>
            <label>
              <input name="articleBias" type="radio" value={-1}
                     checked={this.state.articleBias === -1} 
                     onChange={this.handleOptionChange}/>
              Not biased
            </label>
          </div>
          <div className="radio">
            <label>
              <input name="articleBias" type="radio" value={0}
                     checked={this.state.articleBias === 0} 
                     onChange={this.handleOptionChange} />
              Somewhat biased
            </label>
          </div>
          <div className="radio">
            <label>
              <input name="articleBias" type="radio" value={1} 
                     checked={this.state.articleBias === 1} 
                     onChange={this.handleOptionChange} />
              Very biased
            </label>
          </div>
        </form>

        <form>
          <div className="radio">
            <p>After reading this article, how much do you trust its source?</p>
            <label>
              <input name="sourceTrust" type="radio" value={-1}
                     checked={this.state.sourceTrust === -1} 
                     onChange={this.handleOptionChange}/>
              Less
            </label>
          </div>
          <div className="radio">
            <label>
              <input name="sourceTrust" type="radio" value={0} 
                     checked={this.state.sourceTrust === 0} 
                     onChange={this.handleOptionChange} />
              The same
            </label>
          </div>
          <div className="radio">
            <label>
              <input name="sourceTrust" type="radio" value={1} 
                     checked={this.state.sourceTrust === 1} 
                     onChange={this.handleOptionChange} />
              More
            </label>
          </div>
        </form>
        <button onClick={this.handleSubmit}>Submit Review</button>  
      </div>   
             

    const Sentiments = this.props.article.Sentiments;

    const chart = this.props.article.Sentiments.length === 0 
        ? (<div></div>)
        : (<ArticleSentimentRadarChart sentiments={this.props.article.Sentiments}/>);

    return (  

      <div className="article-detail">
        <div className="article-detail-top">
          <div className="article-source">
            <img src={this.props.article.sourceImage}></img>
            <a href={this.props.article.url} target="_blank"><h2>{this.props.article.title}</h2></a>
            <div className="article-date">
              <p>{moment(this.props.article.date).fromNow()}</p>
            </div>  
          </div>
          {chart}         
        </div>    
        
        <div className="article-detail-body">
          <p>{this.props.article.body}</p>
          {form}
        </div>
      </div>     
    )
  }
}

export default ArticleDetail;
