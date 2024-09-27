import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import Game from './components/Game';
import GameHistory from './components/GameHistory';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
<Route path='/' element={<WelcomePage/>}/>
<Route path='/game' element={<Game/>}/>
<Route path='/history' element={<GameHistory/>}/>
      </Routes>
    
    
    <Footer/>
    </div>
  );
}

export default App;
