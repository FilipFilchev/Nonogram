import React, { useState, useEffect } from 'react';
import './matrix.css';

const Matrix = () => {
  const [gridSize, setGridSize] = useState(5);
  const [playerGrid, setPlayerGrid] = useState([]);
  const [backendGrid, setBackendGrid] = useState(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);



  const fetchNewPuzzle = async () => {
    console.log(`Fetching new puzzle data`);
    try {
      // const response = await fetch(`http://localhost:5000/data?size=${gridSize}`);
      const response = await fetch(`https://nonogram-server-ff86d4a3cb11.herokuapp.com/data?size=${gridSize}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data from backend:", data);
      setBackendGrid(data.Grid);
      setRowHints(data.Row_hints);
      setColHints(data.Col_hints);
      console.log(rowHints, colHints)
      setPlayerGrid(data.Grid.map(row => row.map(() => 0))); // Initialize player grid with zeros
      setMessage('');
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage(`Error fetching new puzzle: ${error.message}`);
    }
  };
  // Fetch new puzzle only on component mount or when gridSize changes
  useEffect(() => {
    fetchNewPuzzle();
  }, [gridSize]);

  
  const handleBoxClick = (rowIndex, colIndex) => {
    // Check if the clicked box should reduce a life
    const shouldReduceLife = playerGrid[rowIndex][colIndex] !== 2 && backendGrid[rowIndex][colIndex] !== 1;
  
    setPlayerGrid(current =>
      current.map((row, rIdx) =>
        rIdx === rowIndex ? row.map((col, cIdx) => {
          if (cIdx === colIndex) {
            if (backendGrid[rowIndex][colIndex] === 1) {
              // If backend grid cell is filled, fill the player cell
              return 1;
            } else {
              // If backend grid cell is empty, mark with X
              return col === 2 ? 0 : 2; // Toggle X mark
            }
          }
          return col;
        }) : row
      )
    );
  
    // Reduce life if necessary, outside the map function
    if (shouldReduceLife) {
      setLives(lives => Math.max(lives - 1, 0));
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderGrid = () => {
    const baseSquareSize = windowWidth < 650 ? Math.max(20, 300 / gridSize) : Math.max(20, 400 / gridSize);
    const squareSize = Math.min(baseSquareSize, 100); // Limit the maximum size
    //const squareSize = Math.max(20, 400 / gridSize); // Adjust size based on gridSize
    const rowHintWidth = Math.max(20, 0 / gridSize) * 2; // Adjust row hint width based on gridSize
    const colHintWidth = Math.max(20, 0 / gridSize) * 2; // Adjust row hint width based on gridSize

    return (
      <>
        <div className="hints-container">
          <div className="top-left-corner-hint"></div>
          {colHints.map((hint, index) => (
            <div className="col-hint" key={index} style={{ width: `${squareSize}px` }}>
              {hint.map((h, idx) => (
              <div key={idx} className="single-col-hint">
                  {h}
                </div>
              ))}
            </div>
          ))}
           </div>
  
        {playerGrid.map((row, rowIndex) => (

          
          <div className="grid-row-with-hints" key={rowIndex} style={{ alignItems: 'center' }}>
            <div className="row-hints">
              {rowHints[rowIndex].join(' ')}
            </div>
            <div className="grid-row">
              {row.map((cell, colIndex) => (
                <div
                  className={`grid-square ${cell === 2 ? 'x-marked' : ''}`}
                  style={{ backgroundColor: cell === 1 ? "black" : "white", width: `${squareSize}px`, height: `${squareSize}px` }}
                  onClick={() => handleBoxClick(rowIndex, colIndex)}
                  key={`${rowIndex}-${colIndex}`}
                />
              ))}
            </div>
          </div>
        ))}
      </>
    );
  };

  const renderLives = () => {
    return Array.from({ length: lives }, (_, i) => (
      <span key={i} className="heart-icon">❤️</span>
    ));
  };
  
  

  const checkSolution = () => {
    // Check solution logic remains the same, with adjustment for lives increase
    if (JSON.stringify(playerGrid) === JSON.stringify(backendGrid)) {
      window.alert("You Win! Loading new puzzle...");
      setMessage("You Win! Loading new puzzle...");
      setScore(score + 10);
      setGridSize(prevSize => prevSize + 1); // Increase grid size
      setLives(lives => lives + 1); // Increase lives by 1
    } else {
      console.log("Solution incorrect. Player needs to keep trying.");
      console.log("Player grid at check:", JSON.stringify(playerGrid));
      console.log("Backend grid for comparison:", JSON.stringify(backendGrid));
      //setMessage("Keep trying!");
      setLives(lives - 1);
      if (lives <= 1) {
        setGridSize(5); // Reset Grid Size to 5x5
        fetchNewPuzzle(); // Fetch a new puzzle
        window.alert("Game Over & Respawn");
        setMessage("Game Over & Respawn");
        setScore(0);
        setLives(3);
      } else {
        setMessage("Incorrect. Try again!");
      }
    }
  };
  
  

  return (
    <div className="nonogram-container">
      <h1>Nonogram Puzzle Game</h1>
      
      <div className="score">Score: {score}</div>
      <div className="lives">Lives: {lives}</div>
      <div className="lives">{renderLives()}</div>
      <div className="grid-container">{renderGrid()}</div>
      <button className="solve-button" onClick={checkSolution}>Solve | Respawn</button>
      <div className="message">{message}</div>
      <div className='rowHints'>Row Hints: {rowHints}</div>
      <div className='rowHints'>Col Hints: {colHints}</div>
      {backendGrid && (
        <div className="backend-grid-list">
          <h2>BackEnd Matrix for Testing:</h2>
          {backendGrid.map((row, index) => (
            <div key={index}>{row.join(', ')}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matrix;


// import React, { useState, useEffect } from 'react';
// import './matrix.css';

// const Matrix = () => {
//   const [gridSize, setGridSize] = useState(5);
//   const [playerGrid, setPlayerGrid] = useState([]);
//   const [backendGrid, setBackendGrid] = useState(null);
//   const [message, setMessage] = useState('');
//   const [score, setScore] = useState(0);
//   const [lives, setLives] = useState(3);
//   const [rowHints, setRowHints] = useState([]);
//   const [colHints, setColHints] = useState([]);

//   const fetchNewPuzzle = async () => {
//     console.log(`Fetching new puzzle of size ${gridSize}x${gridSize}`);
//     try {
//       const response = await fetch(`http://localhost:5000/grid?size=${gridSize}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Fetched grid from backend:", data);
//       setBackendGrid(data);
//       setPlayerGrid(data.map(row => row.map(() => 0))); // Initialize player grid with zeros
//       setMessage('');
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setMessage(`Error fetching new puzzle: ${error.message}`);
//     }
//   };

//   // Fetch new puzzle only on component mount or when gridSize changes
//   useEffect(() => {
//     fetchNewPuzzle();
//   }, [gridSize]);

//   const handleBoxClick = (rowIndex, colIndex) => {
//     setPlayerGrid(current =>
//       current.map((row, rIdx) =>
//         rIdx === rowIndex ? row.map((col, cIdx) => {
//           if (cIdx === colIndex) {
//             // Cycle through: 0 -> 1 (filled) -> 2 (marked with X) -> back to 0 (empty)
//             return (col + 1) % 3;
//           }
//           return col;
//         }) : row
//       )
//     );
//   };

//   const renderGrid = () => {
//     return (
//       <div style={{ display: 'inline-block' }}>
//         {playerGrid.map((row, rowIndex) => (
//           <div className="grid-row" key={rowIndex}>
//             {row.map((cell, colIndex) => (
//               <div
//                 className={`grid-square ${cell === 2 ? 'x-marked' : ''}`}
//                 style={{ backgroundColor: cell === 1 ? "black" : "white" }}
//                 onClick={() => handleBoxClick(rowIndex, colIndex)}
//                 key={`${rowIndex}-${colIndex}`}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//     );
//   };
  

//   const checkSolution = () => {
//     console.log("Checking solution...");
//     console.log("Current player grid:", playerGrid);
//     console.log("Current backend grid:", backendGrid);
  
//     if (JSON.stringify(playerGrid) === JSON.stringify(backendGrid)) {
//       setMessage("You Win! Loading new puzzle...");
//       setScore(score + 10);
//       console.log("You win! Grid size will be increased.");
//       setGridSize(prevSize => prevSize + 1); // Increase grid size
//     } else {
//       console.log("Solution incorrect. Player needs to keep trying.");
//       console.log("Player grid at check:", JSON.stringify(playerGrid));
//       console.log("Backend grid for comparison:", JSON.stringify(backendGrid));
//       //setMessage("Keep trying!");
//       setLives(lives - 1);
//       if (lives <= 1) {
//         setGridSize(5); // Reset Grid Size to 5x5
//         fetchNewPuzzle(); // Fetch a new puzzle
//         setMessage("Game Over & Respawn");
//         setScore(0);
//         setLives(3);
//       } else {
//         setMessage("Incorrect. Try again!");
//       }
//     }
//   };
  

//   return (
//     <div className="nonogram-container">
//       <h1>Nonogram Puzzle Game</h1>
//       <div className="score">Score: {score}</div>
//       <div className="lives">Lives: {lives}</div>
//       <div className="grid-container">{renderGrid()}</div>
//       <button className="solve-button" onClick={checkSolution}>Solve</button>
//       <div className="message">{message}</div>
//       {backendGrid && (
//         <div className="backend-grid-list">
//           <h2>BackEnd Matrix:</h2>
//           {backendGrid.map((row, index) => (
//             <div key={index}>{row.join(', ')}</div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Matrix;

