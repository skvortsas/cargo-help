// react things
import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
// components
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Login from './components/Login';
import NavBar from './components/NavBar';
import Main from './components/main/Main';
import WayList from './components/wayList/WayList';
import Wheels from './components/wheels/Wheels';
// utils
import history from "./utils/history";
// views
import ExternalApi from './views/ExternalApi';
// auth0 things
import { useAuth0 } from "./react-auth0-spa";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
      <Router history={history}>
        {
          isAuthenticated
          ? <NavBar />
          : false
        }
        { 
          !isAuthenticated
          ? <Login />
          : <Redirect to='/profile' /> 
        }
        <Switch>
          <Route path="/" exact />
          <PrivateRoute exact path="/profile" component={ Profile } />
          <PrivateRoute exact path="/external-api" component={ ExternalApi } />
          <PrivateRoute exact path='/main' component={ Main } />
          <PrivateRoute path='/way-list' component={ WayList } />
          <PrivateRoute path='/wheels' component={ Wheels } />
        </Switch>
      </Router>
  );
}

export default App;