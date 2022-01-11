import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { makeStyles } from '@mui/styles'

import _isEmpty from 'lodash/isEmpty'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
// import theme from '../../Theme/theme'

import Header from '../Header/Header'
import { AuthContext } from '../Auth'
import firebaseConfig from '../../config'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#eaeff1',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '500px',
    height: 'calc(100vh - 80px)',
  },
}))

function Login() {
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorEmail, setErrorEmail] = useState(false)
  const [errorPassword, setErrorPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    try {
      if (_isEmpty(email)) {
        setErrorEmail(true)
      } else if (_isEmpty(password)) {
        setErrorPassword(true)
      } else {
        setLoading(true)
        await firebaseConfig.auth().signInWithEmailAndPassword(email, password)
        setLoading(false)
      }
    } catch (err) {
      alert(err)
    }
  }

  const { currentUser } = useContext(AuthContext)
  if (currentUser) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box className={classes.box}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          SIGN IN
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          label="Email"
          error={email ? false : errorEmail}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          style={{ margin: '16px' }}
        />
        <TextField
          variant="outlined"
          fullWidth
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          error={password ? false : errorPassword}
          value={password}
          style={{ margin: '16px' }}
        />
        <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">
            {'Do not have an account yet ? '}
            <Link href="/signup" underline="none">Create one.</Link>
          </Typography>
          <Button variant="outlined" color="primary" onClick={(e) => handleSubmit(e)}>Submit</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Login
