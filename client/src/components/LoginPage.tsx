import React from 'react'


const LoginButton = () => {
    return (
      <button type='submit'> Login with 42</button>
    )
}

type Props = {
}

const LoginPage = (props: Props) => {



  return (
    <div className='login-page'>

      <h1> CatPong </h1>
      <a href="#login">Login</a>
      {/* <button type='submit'> Login with 42</button> */}

    </div>
    
  )
}

export default LoginPage