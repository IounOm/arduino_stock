import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import firebaseConfig from '../../config'
import { AuthContext } from '../Auth'
import * as userAction from '../../redux/actions/user.action'

function Dashboard() {
  const { currentUser } = useContext(AuthContext)
  const dispatch = useDispatch()

  if (!currentUser) {
    return <Redirect to="/Login" />
  }

  const handleLogout = () => {
    dispatch(userAction.logout())
  }

  return (
    <>
      <Box>
        <Box>Welcome, you are now login</Box>
        <Button variant="outlined" onClick={handleLogout}>Sign out</Button>
      </Box>
    </>
  )
}

export default Dashboard
