import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'

import SearchIcon from '@mui/icons-material/Search'

import { AuthContext } from '../Auth'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '8px 24px',
  },
  color: {
    color: '#fff',
    '&.MuiInputBase-root-MuiOutlinedInput-root': {
      color: '#fff',
    },
  },
  inputColor: {
    color: '#fff',
    '&.Mui-focused': {
      color: '#fff',
    },
  },
}))

function Header(props) {
  const { children } = props
  const { currentUser } = useContext(AuthContext) // check login
  const classes = useStyles()
  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
  ]

  return (
    <>
      <AppBar className={classes.root} position="sticky">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            {/* <img src="/images/arduinoStock.png" alt="" width="50px" /> */}
            <img src="/images/arduinoStock2.png" alt="" width="160px" />
            {/* <Typography variant="h5" fontWeight="bold" color="#fff">
              ARDUINO STOCK
            </Typography> */}
          </Box>
          <Autocomplete
            freeSolo
            sx={{
              width: 300,
              display: 'inline-block',
              '& input': {
                // width: 300,
                // bgcolor: 'background.paper',
                color: '#fff',
                // color: (theme) => theme.palette.getContrastText(theme.palette.background.paper),
              },
            }}
            options={top100Films.map((option) => option.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Tag"
                color="button"
                className={classes.color}
                // InputProps={{
                //   className: classes.inputColor,
                //   // endAdornment: <IconButton edge="end"><SearchIcon /></IconButton>,
                // }}
              />
            )}
          />
          <Stack direction="row" spacing={2}>
            <Button variant="text" style={{ color: '#fff', padding: '8px 16px' }}>Sign Up</Button>
            <Button variant="text" style={{ color: '#fff', padding: '8px 16px' }}>Login</Button>
          </Stack>
        </Stack>
      </AppBar>
      {children}
    </>
  )
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Header
