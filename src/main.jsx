import React from 'react';
import ReactDOM from 'react-dom/client';
import StarRating from './components/StarRating';
import { useState } from 'react';
// import App from './App.jsx'
// import './index.css'

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating maxRating={5} size={50} onSetRating={setMovieRating} />
      <span>The rating was {movieRating}</span>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StarRating maxRating={5} size={30} message={['terrible', 'bad', 'not bad', 'good', 'amazing']} />
    <StarRating maxRating={5} color="red" size={50} />
    <Test />
  </React.StrictMode>
);
