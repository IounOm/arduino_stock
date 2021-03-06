import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'

import _map from 'lodash/map'
import _get from 'lodash/get'
import _split from 'lodash/split'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Hidden from '@mui/material/Hidden'
import GitHubIcon from '@mui/icons-material/GitHub'
import LanguageIcon from '@mui/icons-material/Language'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'

import { getUser } from '../../redux/selectors/user.selector'
import Loading from '../../components/Loading'
import UploadImage from '../../components/UploadImage/UploadImage'
import CardProject from '../../components/CardProject/CardProject'
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
    height: 'auto',
    minHeight: 'calc(100vh - 182px)',
    flexDirection: 'column',
    padding: '40px 15%',
    [theme.breakpoints.down('lg')]: {
      padding: '20px 12%',
      minHeight: 'calc(100vh - 142px)',
      // height: '100%',
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
    // padding: '0 24px',
    // [theme.breakpoints.down('sm')]: {
    //   width: '100%',
    //   padding: '16px 0',
    // },
    // [theme.breakpoints.down('sm')]: {
    //   width: '100%',
    //   padding: '8px 0',
    // },
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

function ProfileShare(props) {
  const path = _get(props, 'computedMatch.params')
  const { id } = path
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
    userType,
  } = myUser
  const db = firebase.firestore()
  const [loading, setLoading] = useState(false)
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
      websiteName: '',
      facebookName: '',
      twitterName: '',
      gitName: '',
    },
    errorEmail: false,
    errorPassword: false,
  })
  const [contact, setContact] = useState({
    websiteName: '',
    facebookName: '',
    twitterName: '',
    gitName: '',
  })
  const [projectData, setProjectData] = useState([])

  const handleQuery = async () => {
    try {
      setLoading(true)
      const output = []
      const getProject = await db.collection('project')
        .where('uid', '==', id)
        .where('publish', '==', true)
      // .orderBy('updateAt', 'desc')
        .get()
      getProject.docs.forEach((doc) => {
        doc.data().uidRef.get().then(async (res) => {
          await output.push({
            id: doc.id,
            ...doc.data(),
            uidRef: res.data(),
          })
        })
      })
      setProjectData(output)

      await db.collection('users').doc(id).get().then((doc) => {
        const data = doc.data()
        setValues({
          image: data.image || '',
          name: data.name,
          note: data.note || '',
          email: data.email,
          password: data.password,
          contact: {
            website: data.contact.website || '',
            facebook: data.contact.facebook || '',
            twitter: data.contact.twitter || '',
            git: data.contact.git || '',
          },
          errorEmail: false,
          errorPassword: false,
        })
        setContact({
          websiteName: _split(data.contact.website, '/'),
          facebookName: _split(data.contact.facebook, '/'),
          twitterName: _split(data.contact.twitter, '/'),
          gitName: _split(data.contact.git, '/'),
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
  }, [myUser, path, id])

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
                  defaultImg={values.image}
                  alt=""
                  width="250px"
                  maxWidth="250px"
                  height="250px"
                  loading={loading}
                  page="profile"
                  disabled
                />
              </Box>
            </Box>
            <Box className={classes.pageRight} fullWidth>
              <Box className={classes.profile}>
                <Hidden mdUp>
                  <Divider />
                </Hidden>
                <Box width="100%" fullWidth mt={2}>
                  <Typography variant="h4">
                    {values.name}
                  </Typography>
                  <Typography variant="body2">
                    {values.note}
                  </Typography>
                </Box>
              </Box>
              <Box className={classes.profile}>
                <Box mt={2}>
                  <Divider />
                </Box>
                <Box className={classes.title} mt={2}>
                  <Typography variant="h4">Contact</Typography>
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
                </Box>
              </Box>
            </Box>
          </Box>
          <Box mt={2}>
            <Divider />
          </Box>
          <Box mt={2}>
            <Typography variant="h4">Publish Projects</Typography>
          </Box>
          <Box>
            <Grid container spacing={2} mt={1} mb={2}>
              {!loading && (
              <>
                {_map(projectData, (data) => (
                  <Grid item lg={4} md={6} sm={12} xs={12} sx={{ flexGrow: 1 }}>
                    <CardProject
                      values={data}
                      loading={loading}
                      userId=""
                      groupId="null"
                      setLoading={setLoading}
                      handleQuery={handleQuery}
                      actionType="view"
                      userType={userType}
                    />
                  </Grid>
                ))}
              </>
              )}
            </Grid>
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </Box>
  )
}

export default ProfileShare
