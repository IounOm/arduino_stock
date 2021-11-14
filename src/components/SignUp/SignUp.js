import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import firebaseConfig from '../../config'

function SignUp() {
  const [currentUser, setCurrentUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    try {
      firebaseConfig.auth().createUserWithEmailAndPassword(email, password)
      setCurrentUser(true)
    } catch (err) {
      alert(err)
    }
  }

  if (currentUser) {
    return <Redirect to="/dashboard" />
  }

  return (
    <>
      <Box>
        <Box>Sign Up</Box>
        <TextField
          variant="outlined"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <TextField
          variant="outlined"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Button variant="outlined" onClick={(e) => handleSubmit(e)}>Submit</Button>
      </Box>
    </>
  )
}

export default SignUp
