import React, { useState, useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
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
import Link from '@mui/material/Link'
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
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import GitHubIcon from '@mui/icons-material/GitHub'
import LanguageIcon from '@mui/icons-material/Language'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'

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
    marginTop: '64px',
    height: 'calc(100vh - 64px)',
    padding: '0 120px 0 120px',
    [theme.breakpoints.down('md')]: {
      padding: '0 20px 0 20px',
      height: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 16px 0 16px',
      height: 'auto',
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
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  pageLeft: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  pageRight: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  tagCard: {
    border: '2px solid #e8e8e8',
    borderRadius: '10px',
    padding: '8px',
  },
}))

function Profile(props) {
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
  // const { currentUser } = useContext(AuthContext)
  // const uid = _get(currentUser, 'user.uid')
  // console.log('currentUid', uid)
  const [loading, setLoading] = useState(false)
  const [editContact, setEditContact] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const [editAccount, setEditAccount] = useState(false)
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

  const handleChange = (prop, key) => (event) => {
    if (props) {
      setValues({
        ...values,
        [prop]: {
          ..._get(values, `${prop}`),
          [key]: event.target.value,
        },
      })
    } else {
      setValues({ ...values, [prop]: event.target.value })
    }
  }

  // edit contact
  const handleClickContactEdit = () => {
    setEditContact(true)
  }
  const handleCloseContactEdit = () => {
    setValues({
      ...values,
      contact: {
        website: userContact.website || '',
        facebook: userContact.facebook || '',
        twitter: userContact.twitter || '',
        git: userContact.git || '',
      },
    })
    setEditContact(false)
  }
  const handleSaveContactEdit = async () => {
    try {
      await db.collection('users').doc(userId).update({
        contact: {
          website: values.contact.website,
          facebook: values.contact.facebook,
          twitter: values.contact.twitter,
          git: values.contact.git,
        },
      })
      setEditContact(false)
    } catch (err) {
      console.log(err)
    }
  }

  // edit userProfile
  const handleClickUserEdit = () => {
    setEditUser(true)
  }
  const handleCloseUserEdit = () => {
    setValues({
      ...values,
      name: userName,
      note: userNote || '',
    })
    setEditUser(false)
  }
  const handleSaveUserEdit = async () => {
    try {
      await db.collection('users').doc(userId).update({
        name: values.name,
        note: values.note,
      })
      setEditUser(false)
    } catch (err) {
      console.log(err)
    }
  }

  // TODO edit account
  const handleClickAccountEdit = () => {
    setEditAccount(true)
  }
  const handleCloseAccountEdit = () => {
    setValues({
      ...values,
      email: userEmail,
      password: userPassword,
    })
    setEditAccount(false)
  }
  const handleSaveAccountEdit = async () => {
    // try {
    //   firebase.auth()
    //     .signInWithEmailAndPassword('you@domain.com', 'correcthorsebatterystaple')
    //     .then((userCredential) => {
    //       userCredential.user.updateEmail('newyou@domain.com')
    //     })
    //   setEditAccount(false)
    // } catch (err) {
    //   console.log(err)
    // }
  }

  useEffect(() => {
    handleQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUser])

  return (
    <Box className={classes.box}>
      <Box className={classes.paper}>
        <Box className={classes.pageLeft} fullWidth>
          <Box className={classes.profile}>
            <UploadImage
              collection="users"
              doc={userId}
              updateKey="image"
              defaultImg={userImage}
              alt=""
              width="250px"
              height="250px"
              loading={loading}
            />
          </Box>
          <Box className={classes.profile}>
            <Divider />
            <Box className={classes.title} mt={2}>
              <Typography variant="h4">Account Settings</Typography>
              {!editAccount && (
                <Button variant="outlined" onClick={handleClickAccountEdit}>Edit</Button>
              )}
            </Box>
            <TextField
              variant="outlined"
              fullWidth
              label="Email"
              onChange={handleChange('email')}
              onClick={() => editAccount && setValues({ ...values, email: '' })}
              value={values.email}
              style={{ marginTop: '16px' }}
              disabled={!editAccount}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Password"
              onChange={handleChange('password')}
              onClick={() => editAccount && setValues({ ...values, password: '' })}
              value={values.password}
              style={{ marginTop: '16px' }}
              disabled={!editAccount}
            />
            {editAccount && (
              <Box className={classes.btSave}>
                <Button variant="outlined" color="primary" onClick={handleCloseAccountEdit}>Cancel</Button>
                <Box className={classes.btn}>
                  <Button variant="contained" color="primary" onClick={handleSaveAccountEdit}>Save</Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        <Box className={classes.pageRight} fullWidth>
          <Box className={classes.profile}>
            <Hidden mdUp>
              <Divider />
            </Hidden>
            <Box className={classes.title} mt={2}>
              <Typography variant="h4">User Profile</Typography>
              {!editUser && (
                <Button variant="outlined" onClick={handleClickUserEdit}>Edit</Button>
              )}
            </Box>
            <Box width="100%" fullWidth>
              <TextField
                variant="outlined"
                fullWidth
                label="Username"
                onChange={handleChange('name')}
                value={values.name}
                style={{ marginTop: '16px' }}
                disabled={!editUser}
              />
              <TextField
                fullWidth
                label="Say something about yourself"
                multiline
                rows={3}
                defaultValue=""
                value={values.note}
                onChange={handleChange('note')}
                style={{ marginTop: '16px' }}
                disabled={!editUser}
              />
              {editUser && (
              <Box className={classes.btSave}>
                <Button variant="outlined" color="primary" onClick={handleCloseUserEdit}>Cancel</Button>
                <Box className={classes.btn}>
                  <Button variant="contained" color="primary" onClick={handleSaveUserEdit}>Save</Button>
                </Box>
              </Box>
              )}
            </Box>
          </Box>
          <Box className={classes.profile}>
            <Divider />
            <Box className={classes.title} mt={2}>
              <Typography variant="h4">Contact</Typography>
              {!editContact && (
                <Button variant="outlined" onClick={handleClickContactEdit}>Edit</Button>
              )}
            </Box>
            <Box width="100%" fullWidth>
              {!editContact ? (
                <Box display="flex" flexDirection="column" alignItems="start">
                  <Button variant="text" startIcon={<LanguageIcon />} href={values.contact.website} target="_blank">
                    {`${values.contact.website}`}
                  </Button>
                  <Button variant="text" startIcon={<FacebookIcon />} href={values.contact.facebook} target="_blank">
                    {`${values.contact.facebook}`}
                  </Button>
                  <Button variant="text" startIcon={<TwitterIcon />} href={values.contact.twitter} target="_blank">
                    {`${values.contact.twitter}`}
                  </Button>
                  <Button variant="text" startIcon={<GitHubIcon />} href={values.contact.git} target="_blank">
                    {`${values.contact.git}`}
                  </Button>
                </Box>
              ) : (
                <>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Website"
                    onChange={handleChange('contact', 'website')}
                    value={values.contact.website}
                    style={{ marginTop: '16px' }}
                    disabled={!editContact}
                  />
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Facebook"
                    onChange={handleChange('contact', 'facebook')}
                    value={values.contact.facebook}
                    style={{ marginTop: '16px' }}
                    disabled={!editContact}
                  />
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Twitter"
                    onChange={handleChange('contact', 'twitter')}
                    value={values.contact.twitter}
                    style={{ marginTop: '16px' }}
                    disabled={!editContact}
                  />
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Git"
                    onChange={handleChange('contact', 'git')}
                    value={values.contact.git}
                    style={{ marginTop: '16px' }}
                    disabled={!editContact}
                  />
                </>
              )}
              {editContact && (
              <Box className={classes.btSave}>
                <Button variant="outlined" color="primary" onClick={handleCloseContactEdit}>Cancel</Button>
                <Box className={classes.btn}>
                  <Button variant="contained" color="primary" onClick={handleSaveContactEdit}>Save</Button>
                </Box>
              </Box>
              )}
            </Box>
            {/* <Divider />
            <Box className={classes.title} mt={2}>
              <Typography variant="h4">Tag Management</Typography>
              <Button variant="outlined" onClick={handleClickContactEdit}>Add</Button>
            </Box>
            <Box className={classes.tagCard} mt={2}>
              <Grid container spacing={1}>
                {_map(values.tag, (data) => (
                  <Grid item>
                    <Tooltip title={_get(data, 'note')} arrow>
                      <Chip
                        label={_get(data, 'name')}
                        onClick={[]}
                        onDelete={[]}
                      />
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Dialog open={openContactEdit} onClose={handleCloseContactEdit}>
              <DialogTitle>Add Tag</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  create your tag For filtering your project and the tags
                  you added will be searchable on the home page.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Tag Name"
                  // type="email"
                  fullWidth
                  // variant="standard"
                />
                <TextField
                  autoFocus
                  margin="dense"
                  label="Note"
                  // type="email"
                  fullWidth
                  // variant="standard"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseContactEdit}>Cancel</Button>
                <Button onClick={handleCloseContactEdit}>Save</Button>
              </DialogActions>
            </Dialog> */}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Profile