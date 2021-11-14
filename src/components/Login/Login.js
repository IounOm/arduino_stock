import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router-dom'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { AuthContext } from '../Auth'
import firebaseConfig from '../../config'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    try {
      firebaseConfig.auth().signInWithEmailAndPassword(email, password)
    } catch (err) {
      alert(err)
    }
  }

  const { currentUser } = useContext(AuthContext)
  if (currentUser) {
    return <Redirect to="/dashboard" />
  }

  return (
    <>
      <Box>
        <Box>Login</Box>
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

export default Login
