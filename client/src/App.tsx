import './App.css';
import LoginPage from './components/LoginPage';
import GamePage from './components/GamePage';


function App() {

  const loggedIn: boolean = true;
  return (
        <>
          {loggedIn ? <GamePage /> : <LoginPage/>}
        </>
  );
}

export default App;
