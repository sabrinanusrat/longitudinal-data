import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import SingleStudyPatients from './SingleStudyPatients.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      studies: []
    }
    axios.get('http://www.cbioportal.org/api/studies')
      .then(response => {
        this.setState({
          //studies: response.data

          studies: response.data.filter(s => s.studyId=='lgg_ucsf_2014')
          
        })
      })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">CBioPortal Studies</h1>
        </header>
        <div className="portal">
          <ul className="list studies-list">
            {this.state.studies.map(study => {
              return (<SingleStudyPatients key={study.studyId} study={study}></SingleStudyPatients>);
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
