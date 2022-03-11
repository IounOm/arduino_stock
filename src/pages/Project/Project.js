import React, { useState, useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { enGB, th } from 'date-fns/locale'
import { customAlphabet } from 'nanoid'

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
    marginTop: '64px',
    padding: '0px 120px 40px 120px',
    [theme.breakpoints.down('md')]: {
      padding: '0px 40px 20px 40px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0px 16px 16px 16px',
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
    fontFamily: 'serif',
    [theme.breakpoints.down('lg')]: {
      margin: '0px 80px',
    },
    [theme.breakpoints.down('md')]: {
      margin: '0px 40px',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '0px 10px',
    },
  },
  headerText: {
    display: 'flex',
    alignItems: 'center',
    margin: '40px 250px 0 250px',
    [theme.breakpoints.down('lg')]: {
      margin: '40px 80px 0px 89.6px',
    },
    [theme.breakpoints.down('md')]: {
      margin: '40px 40px 0px 49.6px',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '20px 10px 0px 19.6px',
    },
  },
}))

function Project(props) {
  const path = _get(props, 'computedMatch.params')
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 20)
  console.log('id', path.id)
  console.log('type', path.type)
  const location = useLocation()
  const { pathname } = location
  console.log('pathname', pathname)
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
    uploadImg,
  } = myUser
  const db = firebase.firestore()
  // const storage = firebase.storage()

  const [loading, setLoading] = useState(false)
  const [docId, setDocId] = useState('')
  // const [article, setArticle] = useState('')
  const [value, setValue] = useState({
    article: '',
    createAt: '',
    publish: false,
    uid: '',
    uidRef: '',
    updateAt: '',
    image: '',
    title: '',
    subtitle: '',
    tag: '',
  })
  let disableCKEditor = false
  if (pathname === '/project/create') {
    disableCKEditor = false
  } else if (path.type === 'edit') {
    disableCKEditor = false
  } else {
    disableCKEditor = true
  }
  const [saveValue, setSaveValue] = useState(false)
  const [editDisable, setEditDisable] = useState(disableCKEditor)

  const [openSaveMenu, setOpenSaveMenu] = useState(false)
  const [checkSwitch, setCheckSwitch] = useState(false)
  // const [saveMenuData, setSaveMenuData] = useState({
  //   image: '',
  //   title: '',
  //   subtitle: '',
  //   tag: '',
  // })
  const [errorSave, setErrorSave] = useState({
    image: false,
    title: false,
    subtitle: false,
    tag: false,
  })

  console.log('docId', docId)

  const tag = [
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Instrument', label: 'Instrument' },
    { value: 'Iot', label: 'Iot' },
    { value: 'Machine', label: 'Machine' },
    { value: 'Other', label: 'Other' },
  ]

  const date = new Date()
  const formattedDate = format(date, 'dd LLLL yyyy', { locale: enGB })
  // const formattedDate = format(_toInteger(`${_get(data, 'updateAt.seconds')}000`), 'dd LLLL yyyy')

  const handleQuery = async () => {
    try {
      setLoading(true)
      if (path.id) {
        await firebase.firestore().collection('project').doc(path.id).get()
          .then((doc) => {
            const data = doc.data()
            setValue({ ...value, article: data.article })
            data.uidRef.get().then((res) => {
              setValue({
                ...doc.data(),
                uidRef: res.data(),
              })
            })
          })
      }
      setDocId(nanoid())
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  console.log('uploadImg', uploadImg)
  console.log('value', value)

  const handleSave = async () => {
    try {
      setLoading(true)
      const DateCreate = new Date()
      if (!path.id) {
        await db.collection('project').doc(docId)
          .set({
            article: value.article,
            createAt: DateCreate,
            updateAt: DateCreate,
            publish: value.publish,
            uid: userId,
            uidRef: db.doc(`users/${userId}`),
            image: uploadImg,
            title: value.title,
            subtitle: value.subtitle,
            tag: value.tag,
          })
        history.push('/project')
      } else {
        await db.collection('project').doc(path.id)
          .update({
            article: value.article,
            updateAt: DateCreate,
            publish: value.publish,
            title: value.title,
            subtitle: value.subtitle,
            tag: value.tag,
          })
        history.push('/project')
      }
      dispatch(userAction.uploadImage(''))
      dispatch(userAction.saveProject(false))
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
      dispatch(userAction.saveProject(false))
    }
  }

  // menuSave
  const handleOpenSave = async () => {
    setOpenSaveMenu(true)
  }
  const handleCloseSave = () => {
    setOpenSaveMenu(false)
    // setValue({
    //   ...value,
    //   image: '',
    //   title: '',
    //   subtitle: '',
    //   tag: '',
    // })
    // setErrorSave({
    //   image: false,
    //   title: false,
    //   subtitle: false,
    //   tag: false,
    // })
    dispatch(userAction.saveProject(false))
  }
  const handleChange = (prop) => (event) => {
    setValue({ ...value, [prop]: event.target.value })
  }

  const handleChangeSwitch = () => {
    setCheckSwitch(!checkSwitch)
    setValue({ ...value, publish: !checkSwitch })
  }

  useEffect(() => {
    handleQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path.id])

  useEffect(() => {
    if (save === true) {
      // handleSave()
      handleOpenSave()
      // history.push('/project')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save])

  const renderMunuSave = (
    <Dialog open={openSaveMenu} onClose={handleCloseSave}>
      <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Project Preview</Typography>
        <FormControlLabel
          control={(
            <Switch
              checked={checkSwitch}
              onChange={handleChangeSwitch}
            />
          )}
          label={checkSwitch ? 'Publish' : 'Draft'}
          labelPlacement="start"
        />
      </DialogTitle>
      <DialogContent>
        <UploadImage
          collection="project"
          doc={!path.id ? docId : path.id}
          updateKey="image"
          defaultImg={value.image || ''}
          alt=""
          width="280px"
          maxWidth="500px"
          height="200px"
          loading={loading}
          page={!path.id ? 'createProject' : 'editProject'}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Write a preview title"
          onChange={handleChange('title')}
          value={value.title}
          error={value.title ? false : errorSave.title}
          InputProps={{ style: { fontSize: 24, fontWeight: 'bold' } }}
          variant="standard"
          fullWidth
        />
        <TextField
          autoFocus
          // multiline
          // rows={1}
          margin="dense"
          label="Write a preview Subtitle"
          onChange={handleChange('subtitle')}
          value={value.subtitle}
          error={value.subtitle ? false : errorSave.subtitle}
          variant="standard"
          fullWidth
        />
        <Box mt={2} />
        <DialogContentText>
          Add this information for affecting how your story appears public. Like your Arduino Stock homepage, profile page and project page. It not affect the internal content of your project.
        </DialogContentText>
        <Box mt={2} />
        <TextField
          select
          margin="dense"
          label="Add a tag"
          value={value.tag}
          onChange={handleChange('tag')}
          error={value.tag ? false : errorSave.tag}
          variant="outlined"
          fullWidth
        >
          {tag.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <DialogContentText>
          Add or change tags so readers know what your story is about
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseSave} color="secondary">Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box className={classes.box}>
      <Box className={classes.paper}>
        {(path.id && path.type !== 'edit') && (
          <>
            {!loading && (
            <Box className={classes.headerText}>
              <Avatar
                alt={userName}
                src={userImage}
                sx={{ width: 48, height: 48 }}
              />
              <Box ml={2}>
                <Typography variant="body2">
                  {/* {value.uidRef.name} */}
                  555555555
                </Typography>
                <Typography variant="body2" color="secondary" fontWeight="normal">
                  {`${formattedDate}`}
                </Typography>
              </Box>
            </Box>
            )}
          </>
        )}
        <Box className={classes.richText}>
          <RichText
            disabled={editDisable}
            handleOnChange={(data) => setValue({ ...value, article: data })}
            value={value.article}
            docId={docId}
          />
        </Box>
        {renderMunuSave}
      </Box>
    </Box>
  )
}

export default Project
