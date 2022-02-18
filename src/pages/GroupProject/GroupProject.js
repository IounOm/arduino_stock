import React, { useState, useContext, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _forEach from 'lodash/forEach'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
// import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
// import theme from '../../Theme/theme'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import Divider from '@mui/material/Divider'
import Hidden from '@mui/material/Hidden'
import Tooltip from '@mui/material/Tooltip'
import Autocomplete from '@mui/material/Autocomplete'
import Stack from '@mui/material/Stack'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import GitHubIcon from '@mui/icons-material/GitHub'
import LanguageIcon from '@mui/icons-material/Language'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import AddIcon from '@mui/icons-material/Add'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddBoxIcon from '@mui/icons-material/AddBox'
import PeopleIcon from '@mui/icons-material/People'

import { getUser } from '../../redux/selectors/user.selector'
import Header from '../../components/Header/Header'
import UploadImage from '../../components/UploadImage/UploadImage'
import { AuthContext } from '../../components/Auth'
import firebase from '../../config'

const Input = styled('input')({
  display: 'none',
})

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
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
    // height: 'calc(100vh - 72px)',
    marginTop: '64px',
    padding: '80px 120px 80px 120px',
    [theme.breakpoints.down('md')]: {
      padding: '40px 40px 40px 40px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '16px 16px 16px 16px',
      height: 'auto',
      marginTop: '56px',
    },
  },
  profile: {
    padding: '24px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: '16px 0 16px 0',
    },
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btSave: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'end',
    marginTop: '16px',
  },
  btn: {
    marginLeft: '16px',
  },
  paper: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  pageLeft: {
    display: 'flex',
    flexDirection: 'column',
    width: '18%',
    marginRight: '40px',
    height: 'calc(100vh - 232px)',
    [theme.breakpoints.up('sm')]: {
      position: 'fixed',
    },
    [theme.breakpoints.down('md')]: {
      width: '28%',
      height: 'calc(100vh - 152px)',
    },
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      // height: 'auto',
      height: '200px',
      marginRight: '0px',
    },
  },
  pageRight: {
    // position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '21%',
    width: '82%',
    padding: '0 0 0 40px',
    [theme.breakpoints.down('md')]: {
      width: '72%',
      marginLeft: '31%',
    },
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      marginLeft: '0px',
      padding: '0px',
    },
  },
  tagCard: {
    border: '2px solid #e8e8e8',
    borderRadius: '10px',
    padding: '8px',
  },
  link: {
    textDecoration: 'none',
    fontSize: '22px',
    color: '#595959',
    '&:hover': {
      color: '#008184',
    },
  },
  listBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  listStack: {
    overflow: 'auto',
    height: '100%',
    // 'overflow-y': 'hidden',
    [theme.breakpoints.up('md')]: {
      '&::-webkit-scrollbar': {
        width: '7px',
      },
      '&::-webkit-scrollbar-track': {
        // boxShadow: 'inset 0 0 6px #e8e8e8',
        borderRadius: '10px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#e8e8e8',
        // outline: '3px solid #e8e8e8',
        borderRadius: '10px',
      },
    },
  },
}))

function GroupProject(props) {
  const id = _get(props, 'computedMatch.params')
  console.log('id', id)
  const classes = useStyles()
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
  console.log('myUser', myUser)
  const db = firebase.firestore()
  const [loading, setLoading] = useState(false)
  const [addListOpen, setAddListOpen] = useState(false)
  const [values, setValues] = useState({
    image: '',
    name: '',
    note: '',
    email: '',
    password: '',
    contact: {
      website: '',
      facebook: '',
      twitter: '',
      git: '',
    },
    errorEmail: false,
    errorPassword: false,
  })
  console.log('values', values)

  // menu
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // query
  const handleQuery = async () => {
    setLoading(true)
    await setValues({
      image: userImage || '',
      name: userName,
      note: userNote || '',
      email: userEmail,
      password: userPassword,
      contact: {
        website: userContact.website || '',
        facebook: userContact.facebook || '',
        twitter: userContact.twitter || '',
        git: userContact.git || '',
      },
      errorEmail: false,
      errorPassword: false,
    })
    setLoading(false)
  }

  // add Group
  const handleOpenGroup = () => {
    setAddListOpen(true)
  }
  const handleCloseGroup = () => {
    setAddListOpen(false)
  }
  const handleAddGroup = () => {

  }
  const handleEditGroup = () => {

  }
  const handleDeleteGroup = () => {

  }

  useEffect(() => {
    handleQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUser])

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: { mt: '8px' },
      }}
    >
      <MenuItem onClick={handleMenuClose}>Edit Group</MenuItem>
      <MenuItem onClick={handleMenuClose}>Delete Group</MenuItem>
    </Menu>
  )

  const createGroup = (
    <Dialog open={addListOpen} onClose={handleCloseGroup}>
      <DialogTitle>Add List</DialogTitle>
      <DialogContent>
        <DialogContentText>
          create your List for store your project.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Group Name"
                  // type="email"
          variant="standard"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          label="Description"
                  // type="email"
          variant="standard"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseGroup}>Cancel</Button>
        <Button onClick={handleCloseGroup}>Save</Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box className={classes.box}>
      <Box className={classes.paper}>
        <Box className={classes.pageLeft} fullWidth>
          <Box className={classes.listBox}>
            <Typography variant="h4" fontWeight="bold">
              Group
            </Typography>
            <IconButton onClick={handleOpenGroup} color="primary">
              <AddBoxIcon />
            </IconButton>
          </Box>
          <Divider />
          <Stack spacing={4} className={classes.listStack}>
            <Link to="/group-project" className={classes.link}>
              Personal Project
            </Link>
            <Link to="/group-project" className={classes.link}>
              MDT490 1/2564
            </Link>
            <Link to="/group-project" className={classes.link}>
              My Note
            </Link>
            <Link to="/group-project" className={classes.link}>
              MDT490 1/2564 information of my technology
            </Link>
            <Link to="/group-project" className={classes.link}>
              My Note
            </Link>
            <Link to="/group-project" className={classes.link}>
              MDT490 1/2564
            </Link>
            <Link to="/group-project" className={classes.link}>
              My Note
            </Link>
            <Link to="/group-project" className={classes.link}>
              MDT490 1/2564 information of my technology
            </Link>
            <Link to="/group-project" className={classes.link}>
              My Note
            </Link>
            <Link to="/group-project" className={classes.link}>
              MDT490 1/2564
            </Link>
            <Link to="/group-project" className={classes.link}>
              My Note
            </Link>
            <Link to="/group-project" className={classes.link}>
              MDT490 1/2564 information of my technology
            </Link>
            <Link to="/group-project" className={classes.link}>
              My Note
            </Link>
          </Stack>
          {/* <Divider /> */}
        </Box>
        <Box className={classes.pageRight} fullWidth>
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  My Project
                </Typography>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center">
                {/* <Button
                  variant="contained"
                  startIcon={<AddBoxIcon />}
                >
                  Create
                </Button> */}
                <IconButton color="primary">
                  <AddBoxIcon />
                </IconButton>
                <Box ml={1} />
                <IconButton>
                  <PeopleIcon />
                </IconButton>
                <Box ml={1} />
                <IconButton onClick={handleProfileMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body">
                See all your projects here.
              </Typography>
              {/* <FormGroup>
                <FormControlLabel control={<Switch defaultChecked />} label="Active" />
              </FormGroup> */}
            </Box>
          </Box>
          <Divider />
        </Box>
        {renderMenu}
        {createGroup}
      </Box>
    </Box>
  )
}

export default GroupProject
