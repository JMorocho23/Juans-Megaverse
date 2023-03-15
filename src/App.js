import React from 'react';
import PolyanetCross from './components/PolyanetCross';
import './App.css'

const App = () => {

  const candidateId = '659c2696-47a9-46df-8d93-56207d5a1af0';

  return (
    <div className="App">
      <h1>Polyanet Cross</h1>
      <p >Candidate ID: {candidateId}</p>
      <PolyanetCross candidateId={candidateId} />
      <small>wait this isnt crossmints website... This Juan's Megaverse </small>
    </div>
  );
};

export default App;