import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router-dom'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import firebaseConfig from '../../config'
import { AuthContext } from '../Auth'

function Dashboard() {
  const { currentUser } = useContext(AuthContext)

  if (!currentUser) {
    return <Redirect to="/Login" />
  }

  return (
    <>
      <Box>
        <Box>Welcome, you are now login</Box>
        <Button variant="outlined" onClick={() => firebaseConfig.auth().signOut()}>Sign out</Button>
      </Box>
    </>
  )
}

export default Dashboard
