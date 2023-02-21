import './App.css';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
// import { useState } from 'react';


function App() {

  const loggedIn: boolean = true;



  return (
        <>
          {loggedIn ? <HomePage /> : <LoginPage/>}
          {/* {communityPage ? <> } */}
        </>
  );
}

export default App;
