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
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'

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
    height: 'calc(100vh - 72px)',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '500px',
    padding: '32px',
    backgroundColor: '#FCFBFB',
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

  const handleSubmit = async (e) => {
    try {
      if (_isEmpty(email)) {
        setErrorEmail(true)
      } else if (_isEmpty(values.password)) {
        setErrorPassword(true)
      } else {
        setLoading(true)
        await firebaseConfig.auth().signInWithEmailAndPassword(email, values.password)
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
              {'Do not have an account yet ? '}
              <Link href="/signup" underline="none">Create one.</Link>
            </Typography>
            <Button variant="outlined" color="primary" onClick={(e) => handleSubmit(e)}>Submit</Button>
          </Box>

        </Box>
      </Box>
    </Box>
  )
}

export default Login
