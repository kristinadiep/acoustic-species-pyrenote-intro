import axios from 'axios';
import React from 'react';
import { Button } from '../components/button';


import setAuthorizationToken from '../utils'; // kat: for logging in, we'll see if this works

/**
 * TODO
 * Add password form section (yup!)
 * Add confrim password section (yup!)
 * create way to tell users that thier passwords don't match
 * create upload api
 */
class CreateUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = { // kat: our state variables
      usernameForm: null,
      passwordForm: null,
      passwordConfirm: null
    }
  }

  handleUsernameChange(e) {
    console.log(e)
    console.log(e.target.value)
    this.setState({ usernameForm: e.target.value });
  }

  handlePasswordChange(e) {
    console.log(e)
    console.log(e.target.value)
    this.setState({ passwordForm: e.target.value });
  }

  handleConfirmChange(e) {
    console.log(e)
    console.log(e.target.value)
    this.setState({ passwordConfirm: e.target.value });
  }

  handleUpload() {
    //get data from state for username, password, and password confrim
    console.log("in handleUpload")
    const {usernameForm, passwordForm, passwordConfirm} = this.state
    
    //How do we check for a matching password and notify the user?
      //HINT: Use state variables!!!
    console.log(usernameForm, passwordForm);
    if (!passwordConfirm || passwordConfirm == '' || passwordConfirm !== passwordForm ) {
      console.log("passwordconfirm doesnt exist, or doesnt match");
      // kat: should also notify user
      alert("Passwords don't match!") // kat: way to have text appear on the page itself within html?
      // kat: then what? should we return before the axios func? how does response become 201 anyway?
    }
    
    //if passwords match and are valid inputs (no empty text or just whitespace!!), notify users, else upload new user info to backend
    axios({
      method: 'post',
      url: 'api/create_users',
      data: {
        username: usernameForm, passwordForm
      }
    })
      .then(response => {
        console.log("Within handleUpload");  // kat thing
        //if the user is successfully made, log in user
        if (response.status === 201) {
          console.log("within response.status === 201")
          //how do we log in user? 
          //hint: look at code in home.js
          //looking at previous code is always a good idea!

          // kat note: copy-pasted from loginForm.js
          const { access_token, username, is_admin } = response.data;
          localStorage.setItem('access_token', access_token);

          setAuthorizationToken(access_token);

          // store.set('username', username);
          // store.set('isAdmin', is_admin);
          // store.set('isUserLoggedIn', true);
          // history.push('/upload');
        }
        //why would we not have a user successfully made? 
        //what should we show to the user if thier account fails to be made?
        else {
          //create a state varaible to trigger notification for user
        }
      }).catch(error => {
        console.error("no bueno!")
        console.error(error);
        console.log(error);
      });
  }

  render() {
    const {usernameForm} = this.state
    const {passwordForm} = this.state
    
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
            {/* kat: putting all three inputs inside this one div is kinda uggo (no space in between)
            but trying to copy src/containers/loginForm.js so far makes it one row, so just stick to this for now */}
            <input
              type="text"
              className="form-control"
              id="password"
              placeholder="New Password"
              required
              onChange={e => this.handlePasswordChange(e)}
            />
            <input
              type="text"
              className="form-control"
              id="password-confirm"
              placeholder="New Password (confirm)"
              required
              onChange={e => this.handleConfirmChange(e)}
            />
          </div>
        </div>
        <div>
        Looks like you are typing {usernameForm} 
        </div>
        <Button
          size="lg"
          type="primary"
          onClick={() => this.handleUpload() /*what goes here?*/}
          text="Create Account"
        />
      </div>
    );
  }
}

export default CreateUser;
