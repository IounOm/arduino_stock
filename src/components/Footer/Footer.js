import React, { useState, useEffect } from 'react'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { styled, alpha } from '@mui/material/styles'

import _map from 'lodash/map'
import _kebabCase from 'lodash/kebabCase'
import _get from 'lodash/get'
import _split from 'lodash/split'

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
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Grid from '@mui/material/Grid'

import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import MemoryIcon from '@mui/icons-material/Memory'
import LogoutIcon from '@mui/icons-material/Logout'
import PublishIcon from '@mui/icons-material/Publish'
import DraftsIcon from '@mui/icons-material/Drafts'

import { getUser } from '../../redux/selectors/user.selector'
import * as userAction from '../../redux/actions/user.action'

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
  root: {
    '& .css-1t29gy6-MuiToolbar-root': {
      paddingLeft: ({
        pathname, pId, gId, gpId,
      }) => `${
        (pathname === '/project/create'
        || pathname === `/project/edit/${pId}`
        || pathname === `/group-project/${gId}/project/edit/${gpId}`)
          ? '250px' : '24px'
      }`,
      paddingRight: ({
        pathname, pId, gId, gpId,
      }) => `${
        (pathname === '/project/create'
        || pathname === `/project/edit/${pId}`
        || pathname === `/group-project/${gId}/project/edit/${gpId}`)
          ? '250px' : '24px'
      }`,
    },
    [theme.breakpoints.down('lg')]: {
      '& .css-1t29gy6-MuiToolbar-root': {
        paddingLeft: '24px !important',
        paddingRight: '24px !important',
      },
    },
    [theme.breakpoints.down('md')]: {
      '& .css-1t29gy6-MuiToolbar-root': {
        paddingLeft: '24px !important',
        paddingRight: '24px !important',
      },
    },
    [theme.breakpoints.down('sm')]: {
      '& .css-1t29gy6-MuiToolbar-root': {
        paddingLeft: '16px !important',
        paddingRight: '16px !important',
      },
    },
  },
}))

function Header() {
  const location = useLocation()
  const { pathname } = location

  const projectId = _split(pathname, '/', 4)
  const pId = projectId[projectId.length - 1]

  const groupId = _split(pathname, '/', 3)
  const groupProjectId = _split(pathname, '/', 6)
  const gId = projectId[groupId.length - 1]
  const gpId = groupProjectId[groupProjectId.length - 1]

  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const myUser = useSelector(getUser)
  const {
    userName,
    userEmail,
    userPassword,
    userImage,
    userNote,
    userContact,
    userId,
    save,
    publish,
  } = myUser

  return (
    <>
      {(pathname === '/project/create' || pathname === `/project/edit/${pId}` || pathname === `/group-project/${gId}/project/edit/${gpId}` || pathname === '/404') ? (
        <>
        </>
      ) : (
        <Box sx={{ backgroundColor: '#616569' }}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} md={12}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  // sx={{ mr: 2 }}
                  onClick={() => history.push('/home')}
                >
                  <img src="/images/arduinoStock2.png" alt="arduinoStock" width="125px" />
                </IconButton>
                <Typography variant="h6" fontWeight="bold" color="#fff">
                  Arduino Stock
                </Typography>
              </Box>
            </Grid> */}
            <Grid item xs={12} md={12}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Typography variant="body2" color="#fff">
                  Copyright© 2022 Arduino Stock
                  {/* Copyright 2022 Arduino Stock. Design By Ioun | Boonyupin | Thanadol */}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  )
}

export default Header
