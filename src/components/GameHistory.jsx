import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import './game.css';
import { Link } from 'react-router-dom';

// Initial state for useReducer
const initialState = {
  games: [],
  loading: true,
  error: null
};

// Reducer function to handle state changes
const gameHistoryReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        ...state,
        games: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        games: [],
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

const GameHistory = () => {
  // Using useReducer instead of useState
  const [state, dispatch] = useReducer(gameHistoryReducer, initialState);

  // Fetch all games from the backend
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('https://sps-backend-fto8.onrender.com/api/games');
        console.log(response.data);
        
        // Dispatch success action with the games data
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (error) {
        console.error('Error fetching games:', error);
        
        // Dispatch error action if there's an issue with fetching
        dispatch({ type: 'FETCH_ERROR', payload: 'Error fetching games' });
      }
    };

    fetchGames();
  }, []);

  const { games, loading, error } = state;

  return (
    <div className="game-history">
      <Link className='btn btn-danger mt-4 mx-2' to={'/game'}> Back </Link>
      <h1 className='text-center mt-5 text-light'>Game History</h1>
      
      {loading ? (
        <p className='text-light'>Loading...</p>
      ) : error ? (
        <p className='text-light'>{error}</p>
      ) : games.length === 0 ? (
        <p className='data mx-2 text-light'>No games found.</p>
      ) : (
        <ul className='box my-3'>
          {games.map((game, index) => (
            <li className='list' key={index}>
              <h3>Game: {index + 1}</h3>
              <p>Player 1: {game.player1}</p>
              <p>Player 2: {game.player2}</p>
              <p>Final Winner: {game.final_winner !== 'Tie' ? game.final_winner : 'MATCH DRAW'}</p>
              <p>Rounds:</p>
              <ul>
                {game.rounds.map((round, i) => (
                  <li key={i}>
                    Round {round.roundNumber}: {game.player1} chose {round.player1Choice}, {game.player2} chose {round.player2Choice} - Winner: {round.winner}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameHistory;
