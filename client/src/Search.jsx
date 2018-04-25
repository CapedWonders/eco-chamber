import React, { Component } from 'react';



class Search extends Component {
  render(){
    return (
      <div className="search container">
        <form className='search form'>
          <span><input type="text" className="search rounded" placeholder="Search..."/></span>
        </form>
      </div>
    )
  }
}

export default Search;