import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './game.css'
import { Link } from 'react-router-dom';



const Game = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [round, setRound] = useState(1);
  const [rounds, setRounds] = useState([]);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [finalWinner, setFinalWinner] = useState('');
  const [gameOver, setGameOver] = useState(false);  

  const choices = ['Stone', 'Paper', 'Scissors'];

  const determineWinner = (p1, p2) => {
    if (p1 === p2) return 'Tie';
    if (
      (p1 === 'Stone' && p2 === 'Scissors') ||
      (p1 === 'Scissors' && p2 === 'Paper') ||
      (p1 === 'Paper' && p2 === 'Stone')
    ) {
      return 'Player 1';
    }
    return 'Player 2';
  };

  const playRound = () => {
    if (round > 6) return;  

    const winner = determineWinner(player1Choice, player2Choice);

    if (winner === 'Player 1') {
      setScore((prevScore) => ({ ...prevScore, player1: prevScore.player1 + 1 }));
    } else if (winner === 'Player 2') {
      setScore((prevScore) => ({ ...prevScore, player2: prevScore.player2 + 1 }));
    }

    const roundWinner = winner === 'Player 1' ? player1 : (winner === 'Player 2' ? player2 : 'Tie');

    const newRound = { 
      roundNumber: round, 
      player1Choice, 
      player2Choice, 
      winner: roundWinner // Save the winner's name or "Tie"
    };
    
    setRounds((prevRounds) => [...prevRounds, newRound]);

    if (round < 6) {
      setRound(round + 1);
    } else {
      setGameOver(true);
      // Determine the final winner or tie
      if (score.player1 === score.player2) {
        setFinalWinner('Tie');
      } else {
        setFinalWinner(score.player1 > score.player2 ? player1 : player2);
      }
    }

    setPlayer1Choice(null);
    setPlayer2Choice(null);
  };

  const saveGame = useCallback(async () => {
    const finalGameData = { player1, player2, rounds, finalWinner };
    try {
      await axios.post('http://localhost:5000/api/save-game', finalGameData);
      alert('Game saved successfully!');
    } catch (error) {
      alert('Error saving game:', error);
    }
  }, [player1, player2, rounds, finalWinner]);  // Dependencies for saveGame

  useEffect(() => {
    if (gameOver) {
      saveGame();
    }
  }, [gameOver, saveGame]); 

  

  // Reset the game state for a new game
  const startNewGame = () => {
    setPlayer1('');
    setPlayer2('');
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setRound(1);
    setRounds([]);
    setScore({ player1: 0, player2: 0 });
    setFinalWinner('');
    setGameOver(false);
  };

  // Function to handle choice selection with player name validation
  const handleChoiceSelection = (player, choice) => {
    if (!player1 || !player2) {
      alert('Please fill the player names before making a choice!');
      return;
    }

    if (player === 'Player 1') {
      setPlayer1Choice(choice);
    } else if (player === 'Player 2') {
      setPlayer2Choice(choice);
    }
  };

  return (
    <div className="game-container">

      <div className='history '>
      <Link className='btn btn-danger mt-2' to={'/history'}>Game History</Link>
      </div>
      

      {/* Conditionally render round number or game over message */}
      {gameOver ? <h2 className='text-center fw-bold my-5'>Game Over!</h2> : <h2 className='text-center fw-bold my-4'>Round {round}</h2>}

      {!gameOver && (
        <>
          <div className='d-flex justify-content-center'>
            <input className='form-control w-25 mx-3' 
              type="text" 
              placeholder="Player 1 Name" 
              value={player1} 
              onChange={(e) => setPlayer1(e.target.value)} 
            />
            <input className='form-control w-25 '
              type="text" 
              placeholder="Player 2 Name" 
              value={player2} 
              onChange={(e) => setPlayer2(e.target.value)} 
            />
          </div>

          <div className="choices d-flex justify-content-around my-5">
            <div>
              <h3 className='text-center mb-4'>Player 1: <span className='text-warning fw-bold'>{player1}</span></h3>
              {choices.map((choice) => (
                <button className='btn btn-primary mx-2' key={choice} onClick={() => handleChoiceSelection('Player 1', choice)}>
                  {choice}
                </button>
              ))}
            </div>
            <div>
              <h3 className='text-center mb-4'>Player 2: <span className='text-warning fw-bold'>{player2}</span></h3>
              {choices.map((choice) => (
                <button className='btn btn-primary mx-2' key={choice} onClick={() => handleChoiceSelection('Player 2', choice)}>
                  {choice}
                </button>
              ))}
            </div>
          </div>

          {/* Play round button */}
         <div className='d-flex justify-content-center'>
         {player1Choice && player2Choice && (
            <button className='btn btn-success' onClick={playRound}>Play Round</button>
          )}
         </div>
        </>
      )}

      {/* Display final winner or tie when the game is over */}
      {gameOver && (
        <h2 className='text-center'>
        {score.player1 === score.player2
          ? 'The Game is a Tie!'
          : (
            <>
              <span className='text-warning fw-bold fs-1'>{finalWinner}</span> Wins the Game!
            </>
          )}
      </h2>
      
      )}

      {/* Display the score */}
      <div className='mb-5'>
        <h2 className='text-center my-4 fw-bold'>Score</h2>
        <div className='d-flex justify-content-around my-5'>
         <div>
         <p className='fw-bold'>Player 1</p>
         <h3 className='fw-bold '>{player1}: <span className='text-danger'>{score.player1}</span></h3>
         </div>
        <div>
        <p className='fw-bold'>Player 2</p>
        <h3 className='fw-bold'>{player2}: <span className='text-danger'>{score.player2}</span></h3>
        </div>
        </div>
      </div>

      {/* New Game Button: appears when the game is over */}
      <div className='newgame d-flex justify-content-center'>
      {gameOver && (
        <button onClick={startNewGame} className="new-game-button btn btn-success mb-5 mt-5">
          Start New Game
        </button>
      )}
      </div>
    </div>
  );
};

export default Game;
