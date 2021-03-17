import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Home from './Home';
import ShowData from './ShowData';
import DeptosInfectados from './DeptosInfectados';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/data' exact component={ShowData} />
        <Route path='/depto/top5' exact component={DeptosInfectados} />
      </Switch>
    </Router>
  );
}

export default App;
