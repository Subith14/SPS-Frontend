import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './game.css'
import { Link } from 'react-router-dom';

const GameHistory = () => {
  const [games, setGames] = useState([]);

  // Fetch all games from the backend
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        console.log(response.data);
        
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="game-history">
      <Link className='btn btn-danger mt-4 mx-2' to={'/game'}> Back </Link>
      <h1 className='text-center mt-5 text-light'>Game History</h1>
      {games.length === 0 ? (
        <p className='data mx-2 text-light'>No games found.</p>
      ) : (
        <ul className='box my-3'>
          {games.map((game, index) => (
            <li className='list' key={index}>
              <h3>Game: {index+1}</h3>
              <p>Player 1: {game.player1}</p>
              <p>Player 2: {game.player2}</p>
              <p>Final Winner: {game.finalWinner}</p>
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
