import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Home from './Home';
import ShowData from './ShowData';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/data' exact component={ShowData} />
      </Switch>
    </Router>
  );
}

export default App;
