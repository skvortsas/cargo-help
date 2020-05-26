// react things
import React, { useState } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
// components
import PrivateRoute from "./components/PrivateRoute";
import Login from './components/Login';
import NavBar from './components/NavBar';
import Main from './components/main/Main';
import WayList from './components/wayList/WayList';
import Wheels from './components/wheels/Wheels';
import Statistics from './components/statistics/Statistics';
// utils
import history from "./utils/history";
// auth0 things
import { useAuth0 } from "./react-auth0-spa";

function App() {
  const { isAuthenticated } = useAuth0();
  const [chosenWayList, setChosenWayList] = useState({
                                                      number: '0',
                                                      year: '1999'  
                                                      });
  const [chosenWheel, setChosenWheel] = useState({
                                                number: '0',
                                                year: '1999'  
                                                });

  return (
      <Router history={history}>
        {
          isAuthenticated
          ? <PrivateRoute path='' component={ NavBar } />
          : false
        }
        { 
          !isAuthenticated
          ? <Login />
          : <Redirect to='/main' /> 
        }
        <Switch>
          <Route path="/" exact />
          <PrivateRoute exact path='/main' component={Main} />
          <PrivateRoute path='/way-list' wayList={chosenWayList} setWayList={setChosenWayList} component={WayList} />
          <PrivateRoute exact path='/wheels' wayList={chosenWheel} setWayList={setChosenWheel} component={Wheels} />
          <PrivateRoute exact path='/statistics' component={Statistics} />
        </Switch>
      </Router>
  );
}

export default App;