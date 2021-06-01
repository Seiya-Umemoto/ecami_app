import React from 'react';
import './App.css';
import Classifier from './components/Classifier/Classifier';
import SequenceList from './components/SequenceList/SequenceList';
// import Menu from './components/Menu/Menu';
import Navigation from './components/Navigation/Navigation';
import {Route, BrowserRouter, Switch} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Classifier} />
          <Route exact path='/list' component={SequenceList} />
          {/* <Route exact path='/menu' component={Menu} /> */}
          <Route exact path='*' component={Classifier} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
