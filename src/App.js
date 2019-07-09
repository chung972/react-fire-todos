import React, { Component } from 'react';
import { Route, Link, Switch, Redirect, BrowserRouter as Router } from "react-router-dom";


// CHILD COMPONENTS
function Home() {
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
  render() {
    return (
      Home()
    );
  };
}

export default App;
