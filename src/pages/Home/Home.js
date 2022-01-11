import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'

import Header from '../../components/Header/Header'

import { AuthContext } from '../../components/Auth'

function Home() {
  const { currentUser } = useContext(AuthContext)

  return (
    <>
      <Box>Home</Box>
      {currentUser ? (
        <>
          <Box>You are logged in</Box>
          <Link to="/dashboard">View Dashboard</Link>
        </>
      ) : (
        <>
          <Box>You are not logged in</Box>
          <Link to="/login">Login</Link>
          <Box> or </Box>
          <Link to="/signup">Sign up</Link>
        </>
      )}
    </>
  )
}

export default Home
