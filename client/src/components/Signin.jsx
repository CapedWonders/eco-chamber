import React, { Component } from 'react';
import Api from '../helpers/Api';
import Auth from '../helpers/Auth';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onClick = () => {
    const { email, password } = this.state;
    Api.get('/auth/login', { email, password }).then(jwt => {
      Auth.setJWT(jwt);
      this.props.history.push('/');
    });
  }

  render() {
    return (
      <div className="wrapper">
        <div className="form-signin">
          <h2 className="form-signin-heading">Please login</h2>
          <input onChange={this.onChange} type="text" className="form-control" name="email" placeholder="Email Address" required=""/>
          <input onChange={this.onChange} type="password" className="form-control" name="password" placeholder="Password" required=""/>      
          <button className="btn btn-lg btn-primary btn-block" onClick={this.onClick}>Login</button>   
        </div>
      </div>
    );
  }
}

export default Signin; 
