import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { styled, alpha } from '@mui/material/styles'

import _map from 'lodash/map'
import _kebabCase from 'lodash/kebabCase'
import _split from 'lodash/split'
import _isEmpty from 'lodash/isEmpty'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import Hidden from '@mui/material/Hidden'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Chip from '@mui/material/Chip'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

import SearchIcon from '@mui/icons-material/Search'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import MemoryIcon from '@mui/icons-material/Memory'
import LogoutIcon from '@mui/icons-material/Logout'
import HelpIcon from '@mui/icons-material/Help'

import { getUser } from '../../redux/selectors/user.selector'
import * as userAction from '../../redux/actions/user.action'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  // borderRadius: '10px 0px 0px 10px',
  borderRadius: '5px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  // marginRight: theme.spacing(2),
  marginLeft: 0,
  display: 'flex',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(0)})`,
    paddingRight: `calc(1em + ${theme.spacing(0)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: '#fff',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
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
  // console.log('pathname55555', pId)

  const groupId = _split(pathname, '/', 3)
  const groupProjectId = _split(pathname, '/', 6)
  const gId = projectId[groupId.length - 1]
  const gpId = groupProjectId[groupProjectId.length - 1]
  // console.log('groupIdgroupId', gId)
  // console.log('projectId5555', gpId)

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

  const userLists = [
    { name: 'Profile', icon: <AccountBoxIcon fontSize="small" /> },
    { name: 'Project', icon: <MemoryIcon fontSize="small" /> },
    // { name: 'Logout', icon: <LogoutIcon fontSize="small" /> },
  ]

  if (userId) {
    userLists.push({ name: 'Logout', icon: <LogoutIcon fontSize="small" /> })
  }

  const isMenuOpen = Boolean(anchorEl)
  const isSaveMenuOpen = Boolean(anchorElSave)

  const handleClickSaveList = () => {
    dispatch(userAction.saveProject(true))
  }

  const handleQuery = async () => {
    setLoading(true)
    await setUserData(!_isEmpty(userId) ? userImage : '')
    setLoading(false)
  }

  const handleClickUserList = async (type) => {
    if (type === 'Logout') {
      setAnchorEl(false)
      await dispatch(userAction.logout())
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

  const [searchValue, setSearchValue] = useState('')
  const handleChangeSearch = (e) => {
    setSearchValue(e.target.value)
  }
  const handleClickSearch = () => {
    if (!_isEmpty(searchValue)) {
      history.push(`/home/search/${searchValue}`)
    } else {
      history.push('/home')
    }
  }
  const onKeyPress = (e) => {
    if (!_isEmpty(e.target.value) && e.key === 'Enter') {
      history.push(`/home/search/${e.target.value}`)
    } else if (_isEmpty(e.target.value) && e.key === 'Enter') {
      history.push('/home')
    }
  }

  // toturial
  const [anchor, setAnchor] = useState(false)
  const handleOpenAnchor = () => {
    setAnchor(true)
  }
  const handleCloseAnchor = () => {
    setAnchor(false)
  }

  useEffect(() => {
    handleQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUser])

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

  const drawerToturial = (
    <Box ml={1}>
      <SwipeableDrawer
        anchor="bottom"
        open={anchor}
        onClose={handleCloseAnchor}
        onOpen={handleOpenAnchor}
      >
        <Box sx={{ maxHeight: '500px' }}>
          <Box display="flex" justifyContent="center" sx={{ padding: '0 16px 16px 16px', backgroundColor: '#F8FFFF' }}>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Box mt={6} />
              <Typography variant="h4" fontWeight="bold">Guide</Typography>
              <Box mt={2} />
              {/* header 1 */}
              <img src="/images/toturial5.png" alt="arduinoStock" width="280px" />
              <Box mt={2}>
                <Typography variant="h6" fontWeight="bold">Write your project, add photos, videos, or change your design</Typography>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <img src="/images/toturial6.png" alt="arduinoStock" width="130px" />
                <Box ml={1}>
                  <Typography variant="body1">Change inline text heading</Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <img src="/images/toturial7.png" alt="arduinoStock" width="80px" />
                <Box ml={1}>
                  <Typography variant="body1">Add bulleted list or numbered list</Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <img src="/images/toturial8.png" alt="arduinoStock" width="80px" />
                <Box ml={1}>
                  <Typography variant="body1">Increase indent or decrease indent in this line</Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <img src="/images/toturial9.png" alt="arduinoStock" width="130px" />
                <Box ml={1}>
                  <Typography variant="body1">Add block quote, horizontal line or code block</Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <img src="/images/toturial10.png" alt="arduinoStock" width="110px" />
                <Box ml={1}>
                  <Typography variant="body1">Insert image url or image in your computer and video url</Typography>
                </Box>
              </Box>
              {/* header 2 */}
              <Box mt={6} />
              <img src="/images/toturial11.png" alt="arduinoStock" width="250px" />
              <Typography variant="h6" fontWeight="bold">Customize text When selected</Typography>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <img src="/images/toturial12.png" alt="arduinoStock" width="250px" />
                {/* <Box ml={1}>
                  <Typography variant="body1">Toturial</Typography>
                </Box> */}
              </Box>
              <Box mt={1}>
                <Typography variant="body1">Bold / Italic / Link / code / Font size</Typography>
              </Box>
              {/* header 3 */}
              <Box mt={12} />
              <Typography variant="h6" fontWeight="bold">Customize your picture</Typography>
              <img src="/images/toturial3.png" alt="arduinoStock" width="200px" />
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <img src="/images/toturial13.png" alt="arduinoStock" width="80px" />
                <Box ml={1}>
                  <Typography variant="body1">Change image text alternative or change image caption</Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <img src="/images/toturial14.png" alt="arduinoStock" width="130px" />
                <Box ml={1}>
                  <Typography variant="body1">Inline | center | side image</Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <img src="/images/toturial15.png" alt="arduinoStock" width="50px" />
                <Box ml={1}>
                  <Typography variant="body1">Link image to other website when click</Typography>
                </Box>
              </Box>
              <Box mt={2} />
            </Box>
          </Box>
        </Box>
      </SwipeableDrawer>
    </Box>
  )

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
              ? '#F8FFFF' : 'primary'
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
              onClick={() => pathname !== '/home' && history.push('/home')}
            >
              <img src="/images/arduinoStock2.png" alt="arduinoStock" width="125px" />
            </IconButton>
            {pathname === '/project/create' && (
              <>
                <Box ml={1} />
                <Chip
                  icon={<HelpIcon />}
                  label="Guide"
                  color="secondary"
                  onClick={handleOpenAnchor}
                />
                {drawerToturial}
              </>
            )}
          </Hidden>
          <Hidden smUp>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => pathname !== '/home' && history.push('/home')}
            >
              <img src="/images/arduinoStock.png" alt="arduinoStock" width="30px" />
            </IconButton>
            {pathname === '/project/create' && (
              <>
                <IconButton size="small" color="secondary" onClick={handleOpenAnchor}>
                  <HelpIcon />
                </IconButton>
                {drawerToturial}
              </>
            )}
          </Hidden>
          {(pathname !== '/project/create'
          && pathname !== `/project/edit/${pId}`
          && pathname !== `/group-project/${gId}/project/edit/${gpId}`) && (
            <>
              <Search>
                <StyledInputBase
                  // sx={{ ml: 1, flex: 1 }}
                  placeholder="Search project"
                  inputProps={{ 'aria-label': 'search project' }}
                  onKeyPress={onKeyPress}
                  onChange={handleChangeSearch}
                />
                <IconButton sx={{ p: '10px' }} aria-label="search" onClick={handleClickSearch}>
                  <SearchIcon />
                </IconButton>
              </Search>
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
      {children}
    </Box>
  )
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Header
