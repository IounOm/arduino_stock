import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'

import { AuthContext } from '../Auth'

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '16px 24px',
    backgroundColor: '#008184',
  },
  button: {
    color: '#fff',
  },
}))

function Header() {
  const { currentUser } = useContext(AuthContext) // check login
  const classes = useStyles()

  return (
    <>
      <AppBar className={classes.header} position="sticky" component="div">
        <Box>Header icon</Box>
        {/* <Autocomplete
          value={[]}
          onChange={(event, newValue) => setValue(newValue)}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
          id="controllable-states-demo"
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Controllable" />}
        /> */}
        <Box>55555</Box>
        <Box>
          <Button variant="text" className={classes.button}>Sign Up</Button>
          <Button variant="text" className={classes.button}>Login</Button>
        </Box>
      </AppBar>
    </>
  )
}

export default Header
