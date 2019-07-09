import React, { Component } from 'react';
import { Route, Link, Switch, Redirect, BrowserRouter as Router } from "react-router-dom";
import { login, logout, auth } from "./utils/firebaseService";

const linkStyle = {
  textDecoration: "underline",
  color: "rebeccapurple",
  cursor: "pointer"
}


// PRIVATE ROUTE
function PrivateRoute({ authenticated, component: Component, ...rest }) {
  return (
    <Route
      render={props => (
        authenticated ? <Component {...rest} {...props} /> : <Redirect to="/login" />
      )}
    />
  );
}

// CHILD COMPONENTS
function Home() {
  // these are (if it wasn't obvious) FUNCTIONal components
  // they do NOT have state
  return (
    <div>
      <h1>Welcome to React Firebase TODOs</h1>
    </div>
  );
}

function Dashboard({user}) {
  // try not to have more than one h1 on any given page
  return (
    <div>
      <h2>Welcome to your Dashboard, {user.displayName.split(" ")[0]}</h2>
      <img 
        src={user.photoURL} 
        alt={user.displayName} 
        style={{height: 100, borderRadius: "50%", border: "3px solid black"}}
      />
    </div>
  );
}

function Login({authenticated}) {
  if(authenticated) return <Redirect to="/dashboard" />
  return (
    <div>
      <h2>You need to be logged in to see this page</h2>
      <button onClick={login}>Login with Google</button>
    </div>
  );
}

// PARENT COMPONENT
class App extends Component {

  constructor() {
    super();
    this.state = {
      authenticated: false,
      user: null
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ 
          authenticated: true,
          user
        });
      } else {
        this.setState({ 
          authenticated: false,
          user: null 
        });
      }
    });
  }

  render() {
    return (
      <Router>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          {
            this.state.authenticated &&
            <li style={linkStyle}>
              <span onClick={logout}>Logout</span>
            </li>
          }
        </ul>
        <Switch>
          <Route 
            exact path="/" 
            component={Home}
          />
          <PrivateRoute 
            authenticated={this.state.authenticated} 
            user={this.state.user} 
            path="/dashboard" 
            component={Dashboard} 
          />
          <Route 
            path="/login" 
            render={props => (
              <Login
                {...props}
                authenticated={this.state.authenticated}
              />
            )}
          />
        </Switch>
      </Router>
    );
  };
}

export default App;
