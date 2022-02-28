import React, { useState, useContext, useEffect } from 'react'
import { Redirect, Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { enGB, th } from 'date-fns/locale'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _forEach from 'lodash/forEach'
import _filter from 'lodash/filter'

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
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Paper from '@mui/material/Paper'

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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import InfoIcon from '@mui/icons-material/Info'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import RichText from '../../components/RichText/RichText'

import { getUser } from '../../redux/selectors/user.selector'
import Header from '../../components/Header/Header'
import UploadImage from '../../components/UploadImage/UploadImage'
import CardProject from '../../components/CardProject/CardProject'
import { AuthContext } from '../../components/Auth'
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
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  richText: {
    margin: '0px 240.4px',
    [theme.breakpoints.down('sm')]: {
      margin: '0px 10px',
    },
  },
  headerText: {
    display: 'flex',
    alignItems: 'center',
    margin: '0px 250px 0 250px',
    [theme.breakpoints.down('sm')]: {
      margin: '0px 10px 0 19.6px',
    },
  },
}))

function Project(props) {
  const path = _get(props, 'computedMatch.params')
  console.log('id', path.id)
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
  const db = firebase.firestore()

  const date = new Date()
  const formattedDate = format(date, 'dd LLLL yyyy', { locale: enGB })
  return (
    <Box className={classes.box}>
      <Box className={classes.paper}>
        {/* <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="bold">Create Project</Typography>
          <Box display="flex" flexDirection="row">
            <Button variant="outlined">Cancel</Button>
            <Box ml={1} />
            <Button variant="contained">Create</Button>
          </Box>
        </Box> */}
        <Box className={classes.headerText}>
          <Avatar
            alt={userName}
            src={userImage}
            sx={{ width: 48, height: 48 }}
          />
          <Box ml={2}>
            <Typography variant="body2">
              Boonyupin Santicharan
            </Typography>
            <Typography variant="body2" color="secondary" fontWeight="normal">
              {`${formattedDate}`}
            </Typography>
          </Box>
        </Box>
        <Box className={classes.richText}>
          <RichText />
        </Box>
      </Box>
    </Box>
  )
}

export default Project
