import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import logo from './assets/img/logo.svg';
import './assets/css/App.css';


import Editor from './components/Editor';
import Home from './components/Home';
import NoMatch from './components/NoMatch';


function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/editor" component={Editor} />
          <Route component={NoMatch} />
        </Switch>
      </Router>

    </React.Fragment>
  );
}

export default App;
