import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
// import { createTheme } from '@mui/material/styles'
// import createBreakpoints from '@material-ui/core/styles/createBreakpoints'
import { makeStyles } from '@mui/styles'
// import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _filter from 'lodash/filter'
import _differenceBy from 'lodash/differenceBy'
import _capitalize from 'lodash/capitalize'
import _toInteger from 'lodash/toInteger'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Hidden from '@mui/material/Hidden'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

import AddBoxIcon from '@mui/icons-material/AddBox'
import InfoIcon from '@mui/icons-material/Info'

import { getUser } from '../../redux/selectors/user.selector'
import CardProject from '../../components/CardProject/CardProject'
import Loading from '../../components/Loading'
import firebase from '../../config'

// const breakpoints = createBreakpoints({})

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
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: '15%',
    height: 'calc(100vh - 152px)',
    [theme.breakpoints.up('sm')]: {
      position: 'fixed',
    },
    [theme.breakpoints.down('lg')]: {
      width: '18%',
    },
    [theme.breakpoints.down('md')]: {
      width: '28%',
      // height: 'calc(100vh - 152px)',
    },
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      height: 'auto',
      // height: '200px',
      marginRight: '0px',
      marginBottom: '16px',
    },
  },
  pageRight: {
    // position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '16%',
    width: '85%',
    padding: '0 0 0 40px',
    [theme.breakpoints.down('lg')]: {
      marginLeft: '18%',
    },
    [theme.breakpoints.down('md')]: {
      width: '75%',
      marginLeft: '28%',
    },
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      marginLeft: '0px',
      padding: '0px',
    },
  },
  link: {
    textDecoration: 'none',
    fontSize: '20px',
    color: '#595959',
    padding: '0 24px 0 0',
    '&:hover': {
      color: '#008184',
    },
  },
  listBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  gridProject: {
    width: '100%',
    // justifyContent: 'space-between',
  },
  AvatarBtn: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))

function GroupProject(props) {
  const path = _get(props, 'computedMatch.params')
  const groupId = path.gid
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
  const [myProject, setMyProject] = useState([])
  const [myProjectData, setMyProjectData] = useState([])
  const [groupProject, setGroupProject] = useState([])
  const [groupProjectData, setGroupProjectData] = useState({})
  const [groupOwner, setGroupOwner] = useState({})
  const [error, setError] = useState({
    addGroupName: false,
    addGroupNote: false,
    editGroupName: false,
    editGroupNote: false,
    addProject: false,
  })

  const [anchor, setAnchor] = useState(false)
  const handleOpenAnchor = () => {
    setAnchor(true)
  }
  const handleCloseAnchor = () => {
    setAnchor(false)
  }

  const formatCreateAtDate = format(_toInteger(`${_get(groupProjectData, 'createAt.seconds')}000`), 'dd LLL yyyy')
  const formatUpdateAtDate = format(_toInteger(`${_get(groupProjectData, 'updateAt.seconds')}000`), 'dd LLL yyyy')

  // Add project
  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const [addProject, setAddProject] = useState([])
  const [addProjectData, setAddProjectData] = useState([])

  // query
  const handleQuery = async () => {
    try {
      setLoading(true)
      const myOutput = []
      const groupOutput = []
      await db.collection('groupProject').doc(groupId).get().then(async (doc) => {
        if (doc.data().uid === userId) {
          history.push(`/group-project/${groupId}`)
        } else if (userType !== 'admin' && doc.data().permission === 'personal') {
          history.push('/401') // this is private group
        } else {
          groupOutput.push({
            id: doc.id,
            ...doc.data(),
          })
          await db.collection('users').doc(doc.data().uid).get().then((docs) => {
            setGroupOwner({ ...docs.data() })
          })
        }
      })
      const project = await db.collection('groupProject').doc(groupId).collection('project').get()
      project.docs.forEach((doc) => {
        doc.data().uidRef.get().then((res) => {
          myOutput.push({
            id: doc.id,
            ...doc.data(),
            uidRef: res.data(),
          })
        })
      })
      setMyProject(myOutput)
      setGroupProject(groupOutput)
      setLoading(false)
    } catch (err) {
      console.log(err)
      history.push('/404')
    }
  }

  // add project
  const handleOpenAddProject = () => {
    setAddProjectOpen(true)
  }
  const handleCloseAddProject = () => {
    setAddProjectOpen(false)
  }
  const handleChangeProject = (event) => {
    setAddProjectData(event.target.value)
  }
  // ??????????????????????????? filter ??????????????????????????????????????????????????????????????????????????????????????????????????? groupProject
  const handleAddProjectFilter = async () => {
    const getData = []
    const project = await db.collection('project')
      .where('uid', '==', userId)
      .where('publish', '==', true)
      // .orderBy('updateAt', 'desc')
      .get()
    project.docs.forEach((doc) => {
      getData.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    const result = _differenceBy(getData, myProjectData, 'id')
    // setAddProject(result)
    if (_isEmpty(result)) {
      setAddProject([{ title: 'No project', error: true }])
    } else {
      setAddProject(result)
    }
  }
  const handleSaveAddProject = async () => {
    const outputData = addProjectData
    if (_isEmpty(outputData) || outputData.error === true) {
      setError({ ...error, addProject: true })
    } else {
      const docId = outputData.id
      delete outputData.id
      await db.collection('groupProject').doc(groupId)
        .collection('project')
        .doc(docId)
        .set(outputData)
      setAddProjectOpen(false)
      handleQuery()
    }
  }

  useEffect(() => {
    handleQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUser, groupId])

  // filter groupData
  useEffect(() => {
    if (groupId) {
      // ?????????????????? filter groupProject ?????????????????????????????????
      const getGroupData = _filter(groupProject, { id: groupId })
      const groupData = getGroupData[0]
      setGroupProjectData(groupData)
      // ?????????????????? filter ??????????????????????????? add project ??????????????????????????????????????????????????????????????????
      handleAddProjectFilter()
    }
    // ?????????????????? set project data ????????????????????????????????????????????????????????????????????????
    setMyProjectData(myProject)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupProject, groupId, myProject])

  const renderAddProject = (
    <Dialog open={addProjectOpen} onClose={handleCloseAddProject}>
      <DialogTitle>Add Project</DialogTitle>
      <DialogContent>
        <TextField
          select
          margin="dense"
          label="Project"
          value={addProjectData}
          onChange={handleChangeProject}
          error={!_isEmpty(addProjectData) ? false : error.addProject}
          variant="outlined"
          fullWidth
        >
          {_map(addProject, (option) => (
            <MenuItem value={option}>
              {option.title}
            </MenuItem>
          ))}
        </TextField>
        <Box mt={1} />
        <DialogContentText>
          Select a project to add to this group. The added project will be copied from the project you made. If the project edit or delete from this group. It will not affect the main project.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box mb={1}>
          <Button onClick={handleCloseAddProject} color="secondary" variant="outlined">Cancel</Button>
        </Box>
        <Box mr={2} mb={1}>
          <Button onClick={handleSaveAddProject} color="primary" variant="contained">Add</Button>
        </Box>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box className={classes.box}>
      <Box className={classes.paper}>
        <Hidden smDown>
          <Box className={classes.pageLeft} fullWidth>
            <Box className={classes.listBox}>
              <Typography variant="h4" fontWeight="bold">
                Detail
              </Typography>
            </Box>
            <Divider />
            {!loading ? (
              <Box display="flex" flexDirection="column">
                <Box mt={2} />
                <Avatar
                  src={`${groupOwner.image}`}
                  alt=""
                  sx={{
                    width: '100%',
                    height: '150px',
                  }}
                  variant="rounded"
                  onClick={() => history.push(`/profile/${groupProjectData.uid}`)}
                  className={classes.AvatarBtn}
                />
                <Box display="flex" flexDirection="column">
                  <Box mt={2} />
                  <Divider />
                  <Box mt={2} />
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Properties</Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography variant="body2" color="secondary">Owner</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2">{groupOwner.name}</Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography variant="body2" color="secondary">Group</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2">{groupProjectData.name}</Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography variant="body2" color="secondary">Note</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2">{groupProjectData.note}</Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography variant="body2" color="secondary">Permission</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2">{_capitalize(groupProjectData.permission)}</Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography variant="body2" color="secondary">Created</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2">{formatCreateAtDate}</Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography variant="body2" color="secondary">Updated</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2">{formatUpdateAtDate}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            ) : (
              <Loading />
            )}
          </Box>
        </Hidden>
        <Box className={classes.pageRight} fullWidth>
          {!loading ? (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      '-webkit-line-clamp': '1',
                      '-webkit-box-orient': 'vertical',
                    }}
                  >
                    {groupProjectData.name}
                  </Typography>
                  <Hidden smUp>
                    <Box ml={1}>
                      <IconButton size="small" onClick={handleOpenAnchor}>
                        <InfoIcon fontSize="inherit" />
                      </IconButton>
                      <SwipeableDrawer
                        anchor="top"
                        open={anchor}
                        onClose={handleCloseAnchor}
                        onOpen={handleOpenAnchor}
                      >
                        <Box sx={{ padding: '0 16px 16px 16px' }}>
                          {!loading ? (
                            <Box display="flex" flexDirection="column">
                              <Box mt={2} />
                              <Avatar
                                src={`${groupOwner.image}`}
                                alt=""
                                sx={{
                                  width: '100%',
                                  height: '250px',
                                }}
                                variant="rounded"
                                onClick={() => history.push(`/profile/${groupProjectData.uid}`)}
                                className={classes.AvatarBtn}
                              />
                              <Box display="flex" flexDirection="column">
                                <Box mt={2} />
                                <Divider />
                                <Box mt={2} />
                                <Grid container spacing={1}>
                                  <Grid item xs={12}>
                                    <Typography variant="h6">Properties</Typography>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <Typography variant="body2" color="secondary">Owner</Typography>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <Typography variant="body2">{groupOwner.name}</Typography>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <Typography variant="body2" color="secondary">Group</Typography>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <Typography variant="body2">{groupProjectData.name}</Typography>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <Typography variant="body2" color="secondary">Note</Typography>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <Typography variant="body2">{groupProjectData.note}</Typography>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <Typography variant="body2" color="secondary">Permission</Typography>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <Typography variant="body2">{_capitalize(groupProjectData.permission)}</Typography>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <Typography variant="body2" color="secondary">Created</Typography>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <Typography variant="body2">{formatCreateAtDate}</Typography>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <Typography variant="body2" color="secondary">Updated</Typography>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <Typography variant="body2">{formatUpdateAtDate}</Typography>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Box>
                          ) : (
                            <Loading />
                          )}
                        </Box>
                      </SwipeableDrawer>
                    </Box>
                  </Hidden>
                </Box>
                {groupProjectData.permission === 'editor' && (
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Box ml={1} />
                  <IconButton color="primary" onClick={handleOpenAddProject}>
                    <AddBoxIcon />
                  </IconButton>
                </Box>
                )}
              </Box>
              <Divider />
              <Box sx={{ flexGrow: 1 }} mt={2}>
                <Grid container spacing={2} className={classes.gridProject}>
                  {_map(myProjectData, (data) => (
                    <>
                      <Grid item lg={4} md={6} sm={12} xs={12} sx={{ flexGrow: 1 }}>
                        <CardProject
                          values={data}
                          loading={loading}
                          userId={userId}
                          groupId={groupId || 'null'}
                          setLoading={setLoading}
                          handleQuery={handleQuery}
                          actionType={(data.uid === userId && groupProjectData.permission === 'editor') ? 'edit' : 'view'}
                          userType={userType}
                        />
                      </Grid>
                    </>
                  ))}
                </Grid>
              </Box>
            </>
          ) : (
            <Loading />
          )}
        </Box>
        {renderAddProject}
      </Box>
    </Box>
  )
}

export default GroupProject
