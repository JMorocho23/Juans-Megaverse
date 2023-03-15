import React, { useState, useEffect } from 'react';
import { addPolyanet, addSoloon, addCometh, getMap,  deletePolyanet, deleteSoloon, deleteCometh } from '../apiUtil';

/**
 * Function that automaticlly generates the Polyanet positions based on some math from the coordinates
 * @returns the Polyanet postions for the cross
 */
const generateCrossPositions = () => {
    const positions = [];
    for (let i = 0; i < 11; i++) {
      if (i >=2 && i <= 8 ) {
        positions.push([i, i ]);
        positions.push([i, 10 - i]);
      }
    }
    return positions;
  };

  /**
   * A delay function that helps the call of API's to avoid getting timed out, varies but could be better optimized if the rate limit was a known
   * @param {*} milliseconds 
   * @returns 
   */
const delay = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  
const PolyanetCross = ({ candidateId }) => {
  const [loading, setLoading] = useState(false);
  const [cross, setCross] = useState(Array(11).fill().map(() => Array(11).fill('🌌')));
  const [savedPolyanets, setSavedPolyanets] = useState([]);
  const [currentMap, setCurrentMap] = useState(null);

  /**
   * Function that updates the map with saved polyanets
   */
  const updateCrossWithSavedPolyanets = () => {
    const newCross = cross.map((rowArray, rowIndex) =>
      rowArray.map((cell, colIndex) =>
        savedPolyanets.some(([row, col]) => rowIndex === row && colIndex === col)
          ? '🪐'
          : cell
      )
    );
    setCross(newCross);
  };

  /**
   * Function that loads the map for phase 2
   */
  const fetchCurrentMap = async () => {
    try {
      const mapData = await getMap(candidateId);
      setCurrentMap(mapData);
    } catch (error) {
      console.error('Error fetching map data:', error);
    }
  };

  /**
   * First one loads the map for phase 2.
   * Second loads the savedPolyanets just cause it was easier to test locally then deleting over and over
   */
  useEffect(() => {
    fetchCurrentMap();
  }, []);

  useEffect(() => {
    updateCrossWithSavedPolyanets();
  }, [savedPolyanets]);
  
  /**
   * Used to clear the map of phase 1 same sometimes used to just clear everything and sometimes tuned to targer specific parts
   */
  const deletePreviousCross = async () => {
    const crossPositions = generateCrossPositions();
    for (const [row, col] of crossPositions) {
      try {
        await deletePolyanet(candidateId, row, col);
        await delay(1000);
      } catch (error) {
        console.warn(`Failed to delete Polyanet at row ${row} and col ${col}:`, error);
      }
    }
  };

  /**
   * Used to generate the incial cross from phase 1
   */
  const createCross = async () => {
    setLoading(true);
    const crossPositions = generateCrossPositions();
    // Create new Polyanet cross
    try {
        for (const [row, col] of crossPositions) {
          await addPolyanet(candidateId, row, col);
          await delay(1000);
          const newSavedPolyanets = [...savedPolyanets, [row, col]];
          setSavedPolyanets(newSavedPolyanets);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while creating the Polyanet cross.');
      }
    setLoading(false);
  };

  /**
   * Used to clear the entire map of 2 phase back to default 
   * Side Note: Had to tune the this function around to sometimes target specifc shapes or specific areas of the map
   * tuning either the rows or the cols to target more spefic spot or 1 spot in particular
   */
  const deleteCurrentMap = async() => {
    for (let row = 0; row < currentMap.length; row++) {
        for (let col = 0; col < currentMap[row].length; col++) {
          const cell = currentMap[row][col];
    
          if (cell.startsWith('POLYANET')) {
            await deletePolyanet(candidateId, row, col);
            await delay(2000);
          } else if (cell.endsWith('SOLOON')) {
            await deleteSoloon(candidateId, row, col);
            await delay(2000);
          } else if (cell.endsWith('COMETH')) {
            await deleteCometh(candidateId, row, col);
            await delay(2000);

          }
        }
      }
  }

  /**
   * Used to generate the 2 phase of the Megaverse, using the currentMap and sending request to the correct API's
   */
  const generateMapPositions = async() => {
    for (let row = 0; row < currentMap.length; row++) {
        for (let col = 0; col < currentMap[row].length; col++) {
          const cell = currentMap[row][col];
    
          if (cell.startsWith('POLYANET')) {
            await addPolyanet(candidateId, row, col);
            await delay(2000);
            //console.log(row, col);
          } else if (cell.endsWith('SOLOON')) {
            const color = cell.split('_')[0];
            await addSoloon(candidateId, row, col, color.toLowerCase());
            await delay(2000);
            //console.log(row, col, color.toLowerCase());
          } else if (cell.endsWith('COMETH')) {
            const direction = cell.split('_')[0];
            await addCometh(candidateId, row, col, direction.toLowerCase());
            await delay(2000);
            //console.log(row, col, direction.toLowerCase());
          }
        }
      }
  };

  return (
    <div>
      <h1>Polyanet Cross</h1>
      {cross.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cell, colIndex) => (
            <span key={colIndex}>{cell}</span>
          ))}
        </div>
      ))}
      <button onClick={createCross} disabled={loading}>
        {loading ? 'Creating Polyanet Cross...' : 'Create Polyanet Cross'}
      </button>
      <br/><br/>
      <button onClick={generateMapPositions} disabled={loading}>
        {loading ? 'Creating Crossmint Logo...' : 'Create Crossmint Logo'}
      </button>
      <br/><br/>
      <button onClick={deletePreviousCross} disabled={loading}>
        Delete Polyanet Cross
      </button>
      <br/><br/>
      <button onClick={deleteCurrentMap} disabled={loading}>
        Delete Crossmint Logo
      </button>
    </div>
  );
};


export default PolyanetCross;
