import axios from 'axios';
import React from 'react';
import { Button } from '../components/button';

/**
 * TODO
 * Add password form section
 * Add confrim password section
 * create way to tell users that thier passwords don't match
 * create upload api
 */
class CreateUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      usernameForm: null
    }
  }

  handleUsernameChange(e) {
    console.log(e)
    console.log(e.target.value)
    this.setState({ usernameForm: e.target.value });
  }

  handleUpload() {
    //get data from state for username, password, and password confrim
    const {usernameForm} = this.state
    
    //How do we check for a matching password and notify the user?
      //HINT: Use state variables!!!
    
    //if passwords match and are valid inputs (no empty text or just whitespace!!), notify users, else upload new user info to backend
    axios({
      method: 'post',
      url: 'api/create_users',
      data: {
        username: usernameForm,
      }
    })
      .then(response => {
        //if the user is successfully made, log in user
        if (response.status === 201) {
          //how do we log in user? 
          //hint: look at code in home.js
          //looking at previous code is always a good idea!
        }
        //why would we not have a user successfully made? 
        //what should we show to the user if thier account fails to be made?
        else {
          //create a state varaible to trigger notification for user
        }
      }).catch(error => {
        console.error(error)
      });
  }

  render() {
    const {usernameForm} = this.state
    
    return (
      <div className="container h-75 text-center">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Username"
            autoFocus
            required
            onChange={e => this.handleUsernameChange(e)}
          />
        </div>
        
        </div>
        <div>
        Looks like you are typing {usernameForm} 
        </div>
        <Button
          size="lg"
          type="primary"
          onClick={() => {} /*what goes here?*/}
          text="Create Account"
        />
      </div>
    );
  }
}

export default CreateUser;
