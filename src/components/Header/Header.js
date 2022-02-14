import React, { useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { styled, alpha } from '@mui/material/styles'

import _map from 'lodash/map'
import _kebabCase from 'lodash/kebabCase'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import Hidden from '@mui/material/Hidden'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'

import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'

import { getUser } from '../../redux/selectors/user.selector'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '10px 0px 0px 10px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  // marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(0)})`,
    paddingRight: `calc(1em + ${theme.spacing(0)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4A04C',
    borderRadius: '0px 10px 10px 0px',
    marginRight: theme.spacing(2),
    height: '39px',
    width: '39px',
  },
}))

function Header(props) {
  const { children } = props
  const classes = useStyles()
  const history = useHistory()
  const myUser = useSelector(getUser)
  const {
    userName,
    userEmail,
    userPassword,
    userImage,
    userNote,
    userContact,
    userId,
  } = myUser
  const [anchorEl, setAnchorEl] = useState(null)
  const userLists = ['Profile', 'Group Project', 'Logout']

  const isMenuOpen = Boolean(anchorEl)

  const handleClickUserList = (type) => {
    if (type === 'Logout') {
      console.log('logout')
    } else {
      setAnchorEl(null)
      history.push(`/${_kebabCase(type)}`)
    }
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const menuId = 'munuDestop'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: { mt: '8px' },
      }}
    >
      {_map(userLists, (list) => (
        <MenuItem
          key={list}
          onClick={() => handleClickUserList(list)}
        >
          {list}
        </MenuItem>
      ))}
    </Menu>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Hidden smDown>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              // sx={{ mr: 2 }}
            >
              <img src="/images/arduinoStock2.png" alt="arduinoStock" width="125px" />
            </IconButton>
          </Hidden>
          <Hidden smUp>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => history.push('/home')}
            >
              <img src="/images/arduinoStock.png" alt="arduinoStock" width="30px" />
            </IconButton>
          </Hidden>
          <Search>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{
                'aria-label': 'search',
                // maxLength: 50,
              }}
            />
          </Search>
          <Box className={classes.searchIcon}>
            <IconButton color="search" borderRadius="0" size="small">
              <SearchIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ p: 0 }}
              // edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
            >
              <Avatar
                alt=""
                src={userImage}
              />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              edge="end"
            >
              <Avatar
                alt="5555"
                src={userImage}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {children}
    </Box>
  )
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Header
