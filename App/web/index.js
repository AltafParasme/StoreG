import React from 'react';
import {render} from 'react-dom';
import App from './components';

const rootElement = document.getElementById('app');

render(<App />, rootElement);

if (module.hot) {
  module.hot.accept();
}
