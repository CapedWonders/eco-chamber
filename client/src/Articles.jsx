import React from 'react';




const Articles = (props) => {
  console.log(props);
  return (
    <div className="articles-container">
      <div>{props.articles}</div> 
    </div>
  )
  
}





export default Articles;