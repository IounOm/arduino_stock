import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'

import firebaseConfig from '../../config'

function SignUp() {
  const [currentUser, setCurrentUser] = useState(null)
  const [errorEmail, setErrorEmail] = useState(false)
  const [errorPassword, setErrorPassword] = useState(false)
  const [values, setValues] = useState({
    email: '',
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
      if (_isEmpty(values.email)) {
        setErrorEmail(true)
      } else if (_isEmpty(values.password)) {
        setErrorPassword(true)
      } else {
        const myUser = await firebaseConfig.auth().createUserWithEmailAndPassword(values.email, values.password)
        const uid = _get(myUser, 'user.uid')
        // await firebase.firestore().collection('users').doc(uid).add(data)
        setCurrentUser(true)
      }
    } catch (err) {
      alert(err)
    }
  }

  // if (currentUser) {
  //   return <Redirect to="/profile" />
  // }

  return (
    <>
      <Box>
        <Box>Sign Up</Box>
        <TextField
          variant="outlined"
          label="Email"
          onChange={handleChange('email')}
          error={values.email ? false : errorEmail}
          value={values.email}
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
        <Button variant="outlined" onClick={handleSubmit}>Submit</Button>
      </Box>
    </>
  )
}

export default SignUp
