import React from 'react'
import Header from '../components/Header'
import SigninSignupComponent from '../components/SigninSignup'

function Signup() {
  return (
    <div>
      <Header />
      <div className="wrapper">
        <SigninSignupComponent />
      </div>
    </div>
  )
}

export default Signup
