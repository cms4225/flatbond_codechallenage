import React, { Component } from 'react';
import { Route, Switch } from "react-router";
import Home from './home/home.js';
import ShowFlatbond from './home/showFlatbond.js';
import 'antd/dist/antd.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact={true} path="/" component={Home}/>
          <Route path="/home" component={Home}/>
          <Route path="/show" component={ShowFlatbond}/>
        </Switch>
      </div>
    );
  }
}

export default App;
