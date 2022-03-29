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
import _isEmpty from 'lodash/isEmpty'

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
  searchIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4A04C',
    borderRadius: '0px 10px 10px 0px',
    height: '39px',
    width: '39px',
  },
  buttonSave: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBar: {
    padding: '0 100px',
    [theme.breakpoints.up('sm')]: {
      padding: '0px',
    },
  },
}))

function Header(props) {
  const { children } = props
  const location = useLocation()
  const { pathname } = location

  const projectId = _split(pathname, '/', 4)
  const pId = projectId[projectId.length - 1]
  console.log('pathname55555', pId)

  const groupId = _split(pathname, '/', 3)
  const groupProjectId = _split(pathname, '/', 6)
  const gId = projectId[groupId.length - 1]
  const gpId = groupProjectId[groupProjectId.length - 1]
  console.log('groupIdgroupId', gId)
  console.log('projectId5555', gpId)

  const classes = useStyles({
    pathname, pId, gId, gpId,
  })
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
    isLogin,
  } = myUser
  const [anchorEl, setAnchorEl] = useState(false)
  const [anchorElSave, setAnchorElSave] = useState(false)
  const [userData, setUserData] = useState('')
  const [loading, setLoading] = useState(false)

  // const [switchClick, setSwitchClick] = useState(false)
  // const [saveProject, setSaveProject] = useState(false)

  const userLists = [
    { name: 'Profile', icon: <AccountBoxIcon fontSize="small" /> },
    { name: 'Project', icon: <MemoryIcon fontSize="small" /> },
    { name: 'Logout', icon: <LogoutIcon fontSize="small" /> },
  ]

  // const saveLists = [
  //   { name: 'Draft', icon: <DraftsIcon fontSize="small" /> },
  //   { name: 'Publish', icon: <PublishIcon fontSize="small" /> },
  // ]

  const isMenuOpen = Boolean(anchorEl)
  const isSaveMenuOpen = Boolean(anchorElSave)

  const handleClickSaveList = () => {
    // if (type === 'Draft') {
    //   setAnchorElSave(false)
    //   dispatch(userAction.saveProject(true))
    //   // history.push('/project')
    // } else if (type === 'Publish') {
    //   setAnchorElSave(false)
    //   dispatch(userAction.saveProject(true))
    //   // history.push('/project')
    // }
    dispatch(userAction.saveProject(true))
  }

  const handleQuery = async () => {
    setLoading(true)
    await setUserData(!_isEmpty(userId) ? userImage : '')
    setLoading(false)
  }

  const handleClickUserList = (type) => {
    if (type === 'Logout') {
      setAnchorEl(false)
      dispatch(userAction.logout())
      history.push('/login')
    } else {
      setAnchorEl(false)
      history.push(`/${_kebabCase(type)}`)
    }
  }

  // userMenu
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(false)
  }

  // saveMenu
  // const handleSaveMenuOpen = (event) => {
  //   setAnchorElSave(event.currentTarget)
  // }

  // const handleSaveMenuClose = () => {
  //   setAnchorElSave(false)
  // }

  useEffect(() => {
    handleQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUser])

  const menuId = 'munuDestop'
  const menuId1 = 'saveMunuDestop'
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
          // key={list}
          onClick={() => handleClickUserList(list.name)}
        >
          <ListItemIcon>
            {list.icon}
          </ListItemIcon>
          <ListItemText>{list.name}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  )

  // const renderSave = (
  //   <Menu
  //     anchorEl={anchorElSave}
  //     anchorOrigin={{
  //       vertical: 'bottom',
  //       horizontal: 'center',
  //     }}
  //     id={menuId1}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: 'top',
  //       horizontal: 'center',
  //     }}
  //     open={isSaveMenuOpen}
  //     onClose={handleSaveMenuClose}
  //     PaperProps={{
  //       sx: { mt: '8px' },
  //     }}
  //   >
  //     {_map(saveLists, (list) => (
  //       <MenuItem
  //         key={list}
  //         onClick={() => handleClickSaveList(list.name)}
  //       >
  //         <ListItemIcon>
  //           {list.icon}
  //         </ListItemIcon>
  //         <ListItemText>{list.name}</ListItemText>
  //       </MenuItem>
  //     ))}
  //   </Menu>
  // )

  return (
    <Box sx={{ flexGrow: 1 }} className={classes.root}>
      <AppBar
        position="fixed"
        sx={{
          color: 'black',
          backgroundColor: `${
            (pathname === '/project/create'
            || pathname === `/project/edit/${pId}`
            || pathname === `/group-project/${gId}/project/edit/${gpId}`)
              ? '#fff' : 'primary'
          }`,
          boxShadow: `${
            (pathname === '/project/create'
            || pathname === `/project/edit/${pId}`
            || pathname === `/group-project/${gId}/project/edit/${gpId}`)
              && '0 0 0 0'
          }`,
        }}
      >
        <Toolbar>
          <Hidden smDown>
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
          {(pathname !== '/project/create'
          && pathname !== `/project/edit/${pId}`
          && pathname !== `/group-project/${gId}/project/edit/${gpId}`) && (
            <>
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
            </>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {!loading && (
            <>
              {(pathname === '/project/create'
              || pathname === `/project/edit/${pId}`
              || pathname === `/group-project/${gId}/project/edit/${gpId}`) && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickSaveList}
                    className={classes.buttonSave}
                    size="small"
                    sx={{ borderRadius: '25px' }}
                  >
                    <Typography variant="subtitle1">
                      Save
                    </Typography>
                  </Button>
                </>
              )}
              <Box sx={{ display: { xs: 'none', md: 'flex', marginLeft: '16px' } }}>
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
                    src={userData}
                  />
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: 'flex', md: 'none', marginLeft: '16px' } }}>
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
                    alt=""
                    src={userData}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
      {/* {renderSave} */}
      {children}
    </Box>
  )
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Header
