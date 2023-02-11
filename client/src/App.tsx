import './App.css';
import LoginPage from './components/LoginPage';
import TestPage from './components/TestPage';


function App() {

  const loggedIn: boolean = true;
  return (
        <>
          {loggedIn ? <TestPage /> : <LoginPage/>}
        </>
  );
}

export default App;
