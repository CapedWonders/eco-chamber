import React, { Component } from 'react';

class Source extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title } = this.props.source;

    return (
      <div>
        {title}
      </div>
    );
  }
}

export default Source;
