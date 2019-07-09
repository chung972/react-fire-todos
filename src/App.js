import React, { Component } from 'react';
import { Route, Link, Switch, Redirect, BrowserRouter as Router } from "react-router-dom";
import { login, logout, auth, createTodo, removeTodo, updateComplete, database } from "./utils/firebaseService";

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

function Dashboard({user, text, todos, handleSubmit, handleChange, handleRemove, handleComplete}) {
  // try not to have more than one h1 on any given page
  return (
    <div>
      <h2>Welcome to your Dashboard, {user.displayName.split(" ")[0]}</h2>
      <img 
        src={user.photoURL} 
        alt={user.displayName} 
        style={{height: 100, borderRadius: "50%", border: "3px solid black"}}
      />
      <hr />
      <h5>Here are your TODO items:</h5>
      <ul style={{listStyle: "none"}}>
        {
          todos.map(({id, text, completed})=>(
            <li key={id}>
              <input 
                type="checkbox"
                checked={completed}
                onChange={()=>handleComplete(id)}
              />&nbsp;|&nbsp;
              <span onClick={()=> handleRemove(id)}>X</span>
              &nbsp;{text}
            </li>
          ))
        }
      </ul>
      <form onSubmit={handleSubmit}>
        <input name="text" value={text} onChange={handleChange}/>
        <button>Add TODO</button>
      </form>
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
      user: null,
      text: "",
      todos:[],
      dbRef: null,
    }
  }


handleChange = e => {
  this.setState({
    [e.target.name] : e.target.value
  })
};

handleSubmit = e => {
  const {dbRef, text} = this.state;
  e.preventDefault();
  createTodo(dbRef, {
    text,
    completed: false
  }).then(()=>this.setState({text:""}));
};

handleRemove = todoId => {
  removeTodo(this.state.dbRef, todoId);
};

handleComplete = todoId => {
  updateComplete(this.state.dbRef, todoId);
}

handlePopulateTodos = () => {
  database.ref(this.state.dbRef).on("value", snapshot => {
    const newStateArr = [];
    snapshot.forEach(childSnapshot => {
      newStateArr.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    this.setState({todos: newStateArr});
  });
}

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ 
          authenticated: true,
          user,
          dbRef: `users/${user.uid}/todos` 
        }, this.handlePopulateTodos);
      } else {
        this.setState({ 
          authenticated: false,
          user: null,
          dbRef: null
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
            component={Home} />
          <PrivateRoute 
            authenticated={this.state.authenticated} 
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            handleRemove={this.handleRemove}
            handleComplete={this.handleComplete}
            user={this.state.user} 
            text={this.state.text} 
            todos={this.state.todos}
            path="/dashboard" 
            component={Dashboard} />
          <Route 
            path="/login" 
            render={props => (
              <Login
                {...props}
                authenticated={this.state.authenticated}
              />
            )}/>
        </Switch>
      </Router>
    );
  };
}

export default App;
