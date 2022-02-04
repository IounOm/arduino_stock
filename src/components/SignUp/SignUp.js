import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { makeStyles } from '@mui/styles'

import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'
import _repeat from 'lodash/repeat'

import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'

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

function SignUp() {
  const classes = useStyles()
  const [currentUser, setCurrentUser] = useState(null)
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    showPassword: false,
    errorName: false,
    errorEmail: false,
    errorPassword: false,
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
      if (_isEmpty(values.name)) {
        setValues({ ...values, errorName: true })
      } else if (_isEmpty(values.email)) {
        setValues({ ...values, errorEmail: true })
      } else if (_isEmpty(values.password)) {
        setValues({ ...values, errorPassword: true })
      } else {
        const myUser = await firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
        const uid = _get(myUser, 'user.uid')
        const passNum = values.password.length
        await firebase.firestore().collection('users').doc(uid).set({
          image: '',
          name: values.name,
          note: '',
          email: values.email,
          password: _repeat('*', passNum),
          tag: [],
        })
        setCurrentUser(true)
      }
    } catch (err) {
      alert(err)
    }
  }

  if (currentUser) {
    return <Redirect to="/home" />
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
            label="Name"
            onChange={handleChange('name')}
            error={values.name ? false : values.errorName}
            value={values.name}
            style={{ margin: '16px' }}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Email"
            onChange={handleChange('email')}
            error={values.email ? false : values.errorEmail}
            value={values.email}
          />
          <FormControl variant="outlined" style={{ margin: '16px' }} fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              error={values.password ? false : values.errorPassword}
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
            <Button variant="outlined" color="primary" onClick={handleSubmit}>Submit</Button>
          </Box>

        </Box>
      </Box>
    </Box>
  )
}

export default SignUp