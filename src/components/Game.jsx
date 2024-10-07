import React, { useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import './game.css';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Reducer function to handle state transitions
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PLAYER_NAME':
      return {
        ...state,
        [action.payload.player]: action.payload.name,
      };
    case 'SET_CHOICE':
      return {
        ...state,
        [action.payload.player]: action.payload.choice,
      };
    case 'UPDATE_SCORE':
      return {
        ...state,
        score: {
          ...state.score,
          [action.payload.winner]: state.score[action.payload.winner] + 1,
        },
      };
    case 'ADD_ROUND':
      return {
        ...state,
        rounds: [...state.rounds, action.payload],
      };
    case 'INCREMENT_ROUND':
      return {
        ...state,
        round: state.round + 1,
      };
    case 'SET_FINAL_WINNER':
      return {
        ...state,
        finalWinner: action.payload,
        gameOver: true,
        finalWin: action.payload,  // Store final winner
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
};

// Initial state for the game
const initialState = {
  player1: '',
  player2: '',
  player1Choice: null,
  player2Choice: null,
  round: 1,
  rounds: [],
  score: { player1: 0, player2: 0 },
  finalWinner: '',
  finalWin: '',  // Add this to initialState
  gameOver: false,
};

const Game = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const { player1, player2, player1Choice, player2Choice, round, rounds, score, finalWinner, gameOver, finalWin } = state;

  const choices = ['Stone', 'Paper', 'Scissors'];

  const determineWinner = (p1, p2) => {
    if (p1 === p2) return "Tie";
    if (
      (p1 === 'Stone' && p2 === 'Scissors') ||
      (p1 === 'Scissors' && p2 === 'Paper') ||
      (p1 === 'Paper' && p2 === 'Stone')
    ) {
      return 'Player 1';
    }
    return 'Player 2';
  };

  const playRound = useCallback(() => {
    if (round > 6) return;

    const winner = determineWinner(player1Choice, player2Choice);

    if (winner === 'Player 1') {
      dispatch({ type: 'UPDATE_SCORE', payload: { winner: 'player1' } });
    } else if (winner === 'Player 2') {
      dispatch({ type: 'UPDATE_SCORE', payload: { winner: 'player2' } });
    }

    const roundWinner = winner === 'Player 1' ? player1 : winner === 'Player 2' ? player2 : "Tie";

    dispatch({
      type: 'ADD_ROUND',
      payload: {
        roundNumber: round,
        player1Choice,
        player2Choice,
        winner: roundWinner,
      },
    });

    if (round < 6) {
      dispatch({ type: 'INCREMENT_ROUND' });
    } else {
      dispatch({ type: 'SET_FINAL_WINNER', payload: finalWinner });
    }

    dispatch({ type: 'SET_CHOICE', payload: { player: 'player1Choice', choice: null } });
    dispatch({ type: 'SET_CHOICE', payload: { player: 'player2Choice', choice: null } });
  }, [player1Choice, player2Choice, round, finalWinner, player1, player2]);

  useEffect(() => {
    if (gameOver) {
      const saveGame = async () => {
        let finalWinner1 = "";
        if (score.player1 === score.player2) {
          finalWinner1 = "Tie";
        } else if (score.player1 > score.player2) {
          finalWinner1 = player1;
        } else if (score.player1 < score.player2) {
          finalWinner1 = player2;
        }

        const finalGameData = { player1, player2, rounds, finalWinner: finalWinner1 };
        dispatch({ type: 'SET_FINAL_WINNER', payload: finalWinner1 });
        
        try {
          await axios.post('https://sps-backend-fto8.onrender.com/api/save-game', finalGameData);
          toast.success('Game saved..');
        } catch (error) {
          toast.error('Error saving game:', error);
        }
      };
      saveGame();
    }
  }, [gameOver, score, player1, player2, rounds]);

  const startNewGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const handleChoiceSelection = (player, choice) => {
    if (!player1 || !player2) {
      toast.error('Please fill in player names before making a choice!');
      return;
    }
    dispatch({ type: 'SET_CHOICE', payload: { player: player === 'Player 1' ? 'player1Choice' : 'player2Choice', choice } });
  };

  const handleNameChange = (player, name) => {
    dispatch({ type: 'SET_PLAYER_NAME', payload: { player, name } });
  };

  return (
    <div className="game-container">
      <Toaster position="top-center" reverseOrder={false} />
      <div className='history'>
        <Link className='btn btn-danger mt-2' to={'/history'}>Game History</Link>
      </div>

      {gameOver ? (
        <h2 className='text-center fw-bold my-5'>Game Over!</h2>
      ) : (
        <h2 className='text-center fw-bold my-4'>Round {round}</h2>
      )}

      {!gameOver && (
        <>
          <div className='d-flex justify-content-center'>
            <input
              className='form-control w-25 mx-3'
              type="text"
              placeholder="Player 1 Name"
              value={player1}
              onChange={(e) => handleNameChange('player1', e.target.value)}
            />
            <input
              className='form-control w-25'
              type="text"
              placeholder="Player 2 Name"
              value={player2}
              onChange={(e) => handleNameChange('player2', e.target.value)}
            />
          </div>

          <div className="choices d-flex justify-content-around my-5">
            <div>
              <h3 className='text-center mb-4'>Player 1: <span className='text-warning fw-bold'>{player1}</span></h3>
              {choices.map((choice) => (
                <button
                  className='btn btn-primary mx-2'
                  key={choice}
                  onClick={() => handleChoiceSelection('Player 1', choice)}>
                  {choice}
                </button>
              ))}
            </div>
            <div>
              <h3 className='text-center mb-4'>Player 2: <span className='text-warning fw-bold'>{player2}</span></h3>
              {choices.map((choice) => (
                <button
                  className='btn btn-primary mx-2'
                  key={choice}
                  onClick={() => handleChoiceSelection('Player 2', choice)}>
                  {choice}
                </button>
              ))}
            </div>
          </div>

          <div className='d-flex justify-content-center'>
            {player1Choice && player2Choice && (
              <button className='btn btn-success' onClick={playRound}>
                Play Round
              </button>
            )}
          </div>
        </>
      )}

      {gameOver && (
        <h2 className='text-center'>
          {score.player1 === score.player2 ? (
            'The Game is a Tie!'
          ) : (
            <>
              <span className='text-warning fw-bold fs-1'>{finalWin}</span> Wins the Game!
            </>
          )}
        </h2>
      )}

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
