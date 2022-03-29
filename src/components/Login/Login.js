import React, { useState, useContext } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
// import { makeStyles } from '@material-ui/core'
// import { styled } from '@mui/material/styles'

import _isEmpty from 'lodash/isEmpty'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
// import Link from '@mui/material/Link'
// import theme from '../../Theme/theme'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'

import Header from '../Header/Header'
import { AuthContext } from '../Auth'
import firebase from '../../config'

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
    // height: 'calc(100vh)',
    marginTop: '64px',
    minHeight: 'calc(100vh - 102px)',
    [theme.breakpoints.down('sm')]: {
      marginTop: '56px',
      width: '90%',
      // height: 'calc(100vh - 56px)',
      minHeight: 'calc(100vh - 91px)',
    },
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '500px',
    padding: '32px',
    backgroundColor: '#F9F9F9',
    borderRadius: '25px',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      padding: '16px',
    },
  },
  img: {
    width: '400px',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  link: {
    textDecoration: 'none',
  },
}))

function Login() {
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState(false)
  const [errorPassword, setErrorPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  })

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    })
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleSubmit = async () => {
    try {
      if (_isEmpty(email)) {
        setErrorEmail(true)
      } else if (_isEmpty(values.password)) {
        setErrorPassword(true)
      } else {
        setLoading(true)
        await firebase.auth().signInWithEmailAndPassword(email, values.password)
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
        <Box className={classes.img}>
          <img src="/images/arduinoStock2.png" alt="arduino_stock" width="100%" />
        </Box>
        <Box className={classes.card} mt={4}>
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
          <FormControl variant="outlined" style={{ margin: '16px' }} fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              error={values.password ? false : errorPassword}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )}
              label="Password"
            />
          </FormControl>
          <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">
              Do not have an account yet ?
              <Link to="/signup" className={classes.link}>
                <Button>
                  Create one
                </Button>
              </Link>
            </Typography>
            <Button variant="outlined" color="primary" onClick={handleSubmit}>Submit</Button>
          </Box>

        </Box>
      </Box>
    </Box>
  )
}

export default Login
