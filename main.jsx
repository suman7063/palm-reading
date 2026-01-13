import React from 'react';
import ReactDOM from 'react-dom/client';
import PalmReadingApp from './palm-reading-react.jsx';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PalmReadingApp />
  </React.StrictMode>
);
