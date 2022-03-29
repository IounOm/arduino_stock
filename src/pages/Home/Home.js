import React, { useState, useContext, useEffect } from 'react'
import { Redirect, Link, useHistory } from 'react-router-dom'
// import { createTheme } from '@mui/material/styles'
// import createBreakpoints from '@material-ui/core/styles/createBreakpoints'
import { makeStyles } from '@mui/styles'
// import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _forEach from 'lodash/forEach'
import _filter from 'lodash/filter'
import _differenceBy from 'lodash/differenceBy'
import _lowerCase from 'lodash/lowerCase'
import _capitalize from 'lodash/capitalize'
import _toInteger from 'lodash/toInteger'

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
import Paper from '@mui/material/Paper'
import Badge from '@mui/material/Badge'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

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

import { getUser } from '../../redux/selectors/user.selector'
import Header from '../../components/Header/Header'
import UploadImage from '../../components/UploadImage/UploadImage'
import CardProject from '../../components/CardProject/CardProject'
import Loading from '../../components/Loading'
import { AuthContext } from '../../components/Auth'
import * as userAction from '../../redux/actions/user.action'
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
    minHeight: 'calc(100vh - 182px)',
    marginTop: '64px',
    padding: '40px 120px 40px 120px',
    [theme.breakpoints.down('lg')]: {
      padding: '40px 40px 40px 40px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '16px 16px 16px 16px',
      height: 'auto',
      marginTop: '56px',
      minHeight: 'calc(100vh - 123px)',
    },
  },
}))

function Home(props) {
  const { currentUser } = useContext(AuthContext)
  const path = _get(props, 'computedMatch.params')
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
  } = myUser
  const db = firebase.firestore()

  const [loading, setLoading] = useState(false)
  const [projectData, setProjectData] = useState([])

  console.log('projectData', projectData)

  const handleQuery = async () => {
    try {
      setLoading(true)
      const output = []
      const getProject = await db.collection('project')
        .where('publish', '==', true)
      // .orderBy('updateAt', 'desc')
        .get()
      getProject.docs.forEach((doc) => {
        doc.data().uidRef.get().then((res) => {
          output.push({
            id: doc.id,
            ...doc.data(),
            uidRef: res.data(),
          })
          setProjectData([...output])
        })
      })
      setLoading(false)
    } catch (err) {
      console.log(err)
      history.push('/404')
    }
  }

  useEffect(() => {
    handleQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  return (
    <Box className={classes.box}>
      <Box>Home</Box>
      {currentUser ? (
        <>
          <Box>You are logged in</Box>
          <Link to="/dashboard">View Dashboard</Link>
        </>
      ) : (
        <>
          <Box>You are not logged in</Box>
          <Link to="/login">Login</Link>
          <Box> or </Box>
          <Link to="/signup">Sign up</Link>
        </>
      )}
    </Box>
  )
}

export default Home
