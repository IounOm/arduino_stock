import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { useSelector, useDispatch } from 'react-redux'

import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'
import _split from 'lodash/split'
import _repeat from 'lodash/repeat'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Hidden from '@mui/material/Hidden'
import GitHubIcon from '@mui/icons-material/GitHub'
import LanguageIcon from '@mui/icons-material/Language'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'

import { getAuth, updatePassword } from 'firebase/auth'
import { getUser } from '../../redux/selectors/user.selector'
import Loading from '../../components/Loading'
import UploadImage from '../../components/UploadImage/UploadImage'
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
    backgroundColor: '#F8FFFF',
    marginTop: '64px',
    minHeight: 'calc(100vh - 182px)',
    flexDirection: 'row',
    padding: '40px 12%',
    [theme.breakpoints.down('lg')]: {
      padding: '0 40px 0 40px',
      minHeight: 'calc(100vh - 102px)',
    },
    [theme.breakpoints.down('md')]: {
      padding: '20px 10%',
      height: '100%',
      minHeight: 'calc(100vh - 142px)',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: '56px',
      padding: '16px',
      height: 'auto',
      minHeight: 'calc(100vh - 123px)',
    },
  },
  profile: {
    padding: '0 24px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: '16px 0',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: '8px 0',
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
      marginTop: '16px',
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

function Profile() {
  const classes = useStyles()
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
    userType,
  } = myUser
  const auth = getAuth()
  const user = auth.currentUser
  const history = useHistory()
  const db = firebase.firestore()
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
    confirmPassword: '',
    contact: {
      website: '',
      facebook: '',
      twitter: '',
      git: '',
      websiteName: '',
      facebookName: '',
      twitterName: '',
      gitName: '',
    },
    errorEmail: false,
    errorPassword: false,
    errorName: false,
    errorConfirmPassword: false,
  })
  const [contact, setContact] = useState({
    websiteName: '',
    facebookName: '',
    twitterName: '',
    gitName: '',
  })

  const handleQuery = async () => {
    try {
      setLoading(true)
      await setValues({
        ...values,
        image: userImage || '',
        name: userName,
        note: userNote || '',
        email: userEmail,
        password: userPassword,
        confirmPassword: '',
        contact: {
          website: userContact.website || '',
          facebook: userContact.facebook || '',
          twitter: userContact.twitter || '',
          git: userContact.git || '',
        },
        errorEmail: false,
        errorPassword: false,
        errorConfirmPassword: false,
      })
      setContact({
        websiteName: _split(userContact.website, '/'),
        facebookName: _split(userContact.facebook, '/'),
        twitterName: _split(userContact.twitter, '/'),
        gitName: _split(userContact.git, '/'),
      })
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const handleChange = (prop, key) => (event) => {
    if (key) {
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
      dispatch(userAction.updateUserData(values.name, values.email, values.password, values.image, values.note, values.contact, userType))
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
      if (_isEmpty(values.name)) {
        setValues({ ...values, errorName: true })
      } else {
        await db.collection('users').doc(userId).update({
          name: values.name,
          note: values.note,
        })
        dispatch(userAction.updateUserData(values.name, values.email, values.password, values.image, values.note, values.contact, userType))
        setEditUser(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // TODO edit account
  const handleClickAccountEdit = () => {
    setValues({
      ...values,
      password: '',
      confirmPassword: '',
      errorPassword: false,
      errorConfirmPassword: false,
    })
    setEditAccount(true)
  }
  const handleCloseAccountEdit = () => {
    setValues({
      ...values,
      email: userEmail,
      password: userPassword,
      errorPassword: false,
      errorConfirmPassword: false,
    })
    setEditAccount(false)
  }
  const handleSaveAccountEdit = async () => {
    try {
      if (_isEmpty(values.password)) {
        setValues({ ...values, errorPassword: true })
      } else if (_isEmpty(values.confirmPassword)) {
        setValues({ ...values, errorConfirmPassword: true })
      } else if (values.password !== values.confirmPassword) {
        setValues({ ...values, errorPassword: true, errorConfirmPassword: true })
      } else {
        const passNum = values.password.length
        await updatePassword(user, values.password).then(async () => {
          await db.collection('users').doc(userId).update({
            password: _repeat('*', passNum),
          })
          dispatch(userAction.updateUserData(values.name, values.email, _repeat('*', passNum), values.image, values.note, values.contact, userType))
          setEditAccount(false)
        }).catch((error) => {
          console.log(error)
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  // console.log('website', contact.websiteName[contact.websiteName.length - 1])

  useEffect(() => {
    handleQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUser, userPassword])

  return (
    <Box className={classes.box}>
      {!loading ? (
        <>
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
                  maxWidth="250px"
                  height="250px"
                  loading={loading}
                  page="profile"
                />
              </Box>
              <Box className={classes.profile}>
                <Box mt={2}>
                  <Divider />
                </Box>
                <Box className={classes.title} mt={2}>
                  <Typography variant="h4">Account</Typography>
                  {!editAccount && (
                    <Button variant="outlined" onClick={handleClickAccountEdit}>Edit</Button>
                  )}
                </Box>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Email"
                  onChange={handleChange('email')}
                  // onClick={() => editAccount && setValues({ ...values, email: '' })}
                  value={values.email}
                  style={{ marginTop: '16px' }}
                  // disabled={!editAccount}
                  disabled
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  label={editAccount ? 'New password' : 'Password'}
                  onChange={handleChange('password')}
                  value={values.password}
                  error={values.errorPassword}
                  style={{ marginTop: '16px' }}
                  disabled={!editAccount}
                />
                {editAccount && (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Confirm password"
                    onChange={handleChange('confirmPassword')}
                    value={values.confirmPassword}
                    error={values.errorConfirmPassword}
                    style={{ marginTop: '16px' }}
                    disabled={!editAccount}
                  />
                )}
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
                    error={values.name ? false : values.errorName}
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
                <Box mt={2}>
                  <Divider />
                </Box>
                <Box className={classes.title} mt={2}>
                  <Typography variant="h4">Contact</Typography>
                  {!editContact && (
                    <Button variant="outlined" onClick={handleClickContactEdit}>Edit</Button>
                  )}
                </Box>
                <Box width="100%" fullWidth>
                  {(!values.contact.website
                  && !values.contact.facebook
                  && !values.contact.twitter
                  && !values.contact.git) && (
                    <Box mt={1}>
                      <Typography variant="body">
                        Add your social info, your bio and website.
                        Let the community know what you are into!
                      </Typography>
                    </Box>
                  )}
                  {!editContact ? (
                    <Box display="flex" flexDirection="column" alignItems="start">
                      {values.contact.website && (
                        <>
                          <Button variant="text" startIcon={<LanguageIcon />} href={values.contact.website} target="_blank">
                            {contact.websiteName[contact.websiteName.length - 1] === '' ? contact.websiteName[contact.websiteName.length - 2] : contact.websiteName[contact.websiteName.length - 1]}
                          </Button>
                        </>
                      )}
                      {values.contact.facebook && (
                        <>
                          <Button variant="text" startIcon={<FacebookIcon />} href={values.contact.facebook} target="_blank">
                            {contact.facebookName[contact.facebookName.length - 1] === '' ? contact.facebookName[contact.facebookName.length - 2] : contact.facebookName[contact.facebookName.length - 1]}
                          </Button>
                        </>
                      )}
                      {values.contact.twitter && (
                        <>
                          <Button variant="text" startIcon={<TwitterIcon />} href={values.contact.twitter} target="_blank">
                            {contact.twitterName[contact.twitterName.length - 1] === '' ? contact.twitterName[contact.twitterName.length - 2] : contact.twitterName[contact.twitterName.length - 1]}
                          </Button>
                        </>
                      )}
                      {values.contact.git && (
                        <>
                          <Button variant="text" startIcon={<GitHubIcon />} href={values.contact.git} target="_blank">
                            {contact.gitName[contact.gitName.length - 1] === '' ? contact.gitName[contact.gitName.length - 2] : contact.gitName[contact.gitName.length - 1]}
                          </Button>
                        </>
                      )}
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
              </Box>
              <Box className={classes.profile}>
                <Box mt={2}>
                  <Divider />
                </Box>
                <Box mt={2} mb={1}>
                  <Button variant="contained" color="primary" fullWidth onClick={() => history.push(`/profile/${userId}`)}>
                    View your profile
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </Box>
  )
}

export default Profile
