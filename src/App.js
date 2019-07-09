import React, { Component } from 'react';
import { Route, Link, Switch, Redirect, BrowserRouter as Router } from "react-router-dom";


// PRIVATE ROUTE
function PrivateRoute({ authenticated, component: Component, ...rest }){
  return(
    <Route
      render={props =>(
        authenticated ? <Component {...rest} {...props} /> : <Redirect to="/login"/>
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

function Dashboard() {
  // try not to have more than one h1 on any given page
  return (
    <div>
      <h2>Welcome to your Dashboard</h2>
    </div>
  );
}

function Login() {
  return (
    <div>
      <h2>You need to be logged in to see this page</h2>
      <button>Login with Google</button>
    </div>
  );
}

// PARENT COMPONENT
class App extends Component {

  constructor() {
    super();
    this.state = {
      authenticated: false
    }
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
        </ul>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute authenticated={this.state.authenticated} path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    );
  };
}

export default App;
