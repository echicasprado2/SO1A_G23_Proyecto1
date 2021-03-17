import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Home from './Home';
import ShowData from './ShowData';
import DeptosInfectados from './DeptosInfectados';
import InfectadosState from './InfectadosState';
import InfectadosTipo from './InfectadosTipo';
import LastCases from './LastCases';
import Edad from './Edad';
import Menu from './Menu';

function App() {
  return (
    
      
      <Router>
        <Menu/>
        <Switch>
          <Route path='/' exact component={Home}/>
          <Route path='/data' exact component={ShowData} />
          <Route path='/depto/top5' exact component={DeptosInfectados} />
          <Route path='/cases/state' exact component={InfectadosState} />
          <Route path='/cases/infectedtype' exact component={InfectadosTipo} />
          <Route path='/cases/last' exact component={LastCases} />
          <Route path='/cases/agesrange' exact component={Edad} />
        </Switch>
      </Router>
    
  );
}

export default App;
