import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Api from '../helpers/Api';
import Auth from '../helpers/Auth';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      bias: ''
    };
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }


  onClick = () => {
    Api.post('/users', this.state)
      .then(() => {
        return Api.get('/auth/login', this.state);
      })
      .then(jwt => {
        Auth.setJWT(jwt);
        this.props.history.push('/');
      });
  }

  render() {
    return (
      <div>
        <div className="register-page">
          <h1>Register</h1>
          <p>Please fill in this form to create an account.</p>
          <hr/>

          <label htmlFor="email"><b>Email</b></label>
          <input type="text" placeholder="Enter Email" name="email" value={this.state.email} onChange={this.onChange} required></input>

          <label htmlFor="psw"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name="password" value={this.state.password} onChange={this.onChange} required></input>

          <label><b>Political Identity</b></label>
          <br/>
          <select name="bias" value={this.state.bias} onChange={this.onChange}>
            <option value="-2">Far Left</option>
            <option value="-1">Left of Center</option>
            <option value="0">Center</option>
            <option value="1">Right of Center</option>
            <option value="2">Far Right</option>
            <option value="">None of the above</option>
          </select>
          <h4>Not sure?  Take this <a href="https://www.pbs.org/newshour/politics/fit-2016-political-party-quiz" target="_blank">pew research quiz!</a></h4>
          <br/>

          <hr/>
          <button type="submit" className="registerbtn" onClick={this.onClick}>Register</button>
          <p>Already have an account? <Link to="/signin">Sign in</Link>.</p>
        </div>        
      </div>
    );
  }
}

export default Signup; 
