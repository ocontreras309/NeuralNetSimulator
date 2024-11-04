import { useState } from 'react';
import './App.css';
import React from 'react';
import { Fade } from '@mui/material';

import ClassificationTree from './ClassificationTree';
import RegressionTree from './RegressionTree';

const OPT_CLASSIFICATION_TREE = "classificationTree";
const OPT_REGRESSION_TREE = "regressionTree";

const content = {
  "classificationTree": <ClassificationTree />,
  "regressionTree": <RegressionTree />
}

function App() {
  const [contentId, setContentId] = useState(OPT_CLASSIFICATION_TREE);
  const [fadeIn, setFadeIn] = useState(true);
  const timeout = 200;
  
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleClick = function(id) {
    setFadeIn(false);
    sleep(timeout).then(() => {
      setContentId(id);
      setFadeIn(true);
    });
  }

  return (
    <div className='App-main'>
      <div className='container p-3 text-white rounded banner w-100 d-flex'>
        <div>
          <h1>Learn Machine Learning</h1>
          <h6 className='ms-auto'>Developed by <a href="https://www.linkedin.com/in/oscar-contreras/" className='text-warning' target='blank'>Oscar Contreras Carrasco</a> et al.</h6>
        </div>
        <div className='ms-auto'>
          <img src='robot.png' />
        </div>
      </div>
      <div class="container d-flex flex-row p-3">
        <button className={ (contentId === OPT_CLASSIFICATION_TREE) ? "btn btn-secondary w-100 rounded-pill menu-button mx-2" : "btn btn-info w-100 rounded-pill menu-button mx-2" } onClick={ () => handleClick(OPT_CLASSIFICATION_TREE) }>Classification tree</button>
        <button className={ (contentId === OPT_REGRESSION_TREE) ? "btn btn-secondary w-100 rounded-pill menu-button mx-2" : "btn btn-info w-100 rounded-pill menu-button mx-2" } onClick={ () => handleClick(OPT_REGRESSION_TREE) }>Regression tree</button>
      </div>
      <div className='container display-area'>
        <Fade in={ fadeIn } timeout={ timeout }>
          <div id="mainContent">
            {
              content[contentId]
            }
          </div>
        </Fade>
      </div>
    </div>
  );
}

export default App;
