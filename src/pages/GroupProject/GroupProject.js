import React, { useState, useContext, useEffect } from 'react'
import { Redirect, Link, useHistory } from 'react-router-dom'
// import { createTheme } from '@mui/material/styles'
// import createBreakpoints from '@material-ui/core/styles/createBreakpoints'
import { makeStyles } from '@mui/styles'
// import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _forEach from 'lodash/forEach'
import _filter from 'lodash/filter'
import _differenceBy from 'lodash/differenceBy'

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
import Badge from '@mui/material/Badge'

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
import { AuthContext } from '../../components/Auth'
import * as userAction from '../../redux/actions/user.action'
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
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
    // height: 'calc(100vh - 72px)',
    marginTop: '64px',
    padding: '40px 120px 40px 120px',
    [theme.breakpoints.down('lg')]: {
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
    [theme.breakpoints.down('md')]: {
      width: '25%',
      // height: 'calc(100vh - 152px)',
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
}))

function GroupProject(props) {
  const path = _get(props, 'computedMatch.params')
  const groupId = path.gid
  // console.log('id', groupId)
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
  const [myProject, setMyProject] = useState([])
  const [myProjectData, setMyProjectData] = useState([])
  const [groupProject, setGroupProject] = useState([])
  const [groupProjectData, setGroupProjectData] = useState({})
  const [filterGroup, setFilterGroup] = useState(false)
  const [error, setError] = useState({
    addGroupName: false,
    addGroupNote: false,
    editGroupName: false,
    editGroupNote: false,
    addProject: false,
  })

  // add group
  const [addGroupOpen, setAddGroupOpen] = useState(false)
  const [addGroup, setAddGroup] = useState({
    name: '',
    note: '',
  })

  // edit group
  const [editGroupOpen, setEditGroupOpen] = useState(false)
  const [editGroup, setEditGroup] = useState({
    name: '',
    note: '',
  })

  // delete group
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false)

  // Add project
  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const [addProject, setAddProject] = useState([])
  const [addProjectData, setAddProjectData] = useState([])

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
    try {
      const myOutput = []
      const groupOutput = []
      if (!groupId) {
        const project = await db.collection('project')
          .where('uid', '==', userId)
          // .orderBy('updateAt', 'desc')
          .get()
        project.docs.forEach((doc) => {
          doc.data().uidRef.get().then((res) => {
            myOutput.push({
              id: doc.id,
              ...doc.data(),
              uidRef: res.data(),
            })
          })
        })
      } else if (groupId) {
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
      }
      const groupData = await db.collection('groupProject')
        .where('uid', '==', userId)
        .orderBy('createAt', filterGroup ? 'desc' : 'asc')
        .get()
      groupData.docs.forEach((doc) => {
        groupOutput.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      setMyProject(myOutput)
      setGroupProject(groupOutput)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  console.log('myProject', myProject)
  console.log('GroupProject', groupProject)

  // add Group
  const handleOpenGroup = () => {
    setAddGroupOpen(true)
    // await db.collection('groupProject')
    //   .doc('Hn6lcMC0e1dRuwAbCJjh')
    //   .collection('project')
    //   .doc()
    //   .set(myProjectData[0])
  }
  const handleCloseGroup = () => {
    setAddGroupOpen(false)
    setAddGroup({
      name: '',
      note: '',
    })
    setError({ ...error, addGroupName: false, addGroupNote: false })
  }
  const handleChangeGroup = (prop) => (event) => {
    setAddGroup({ ...addGroup, [prop]: event.target.value })
  }
  // permission: 'personal', 'viewer', 'editor'
  const handleAddGroup = async () => {
    try {
      setLoading(true)
      const DateCreate = new Date()
      if (_isEmpty(addGroup.name)) {
        setError({ ...error, addGroupName: true })
      } else if (_isEmpty(addGroup.note)) {
        setError({ ...error, addGroupNote: true })
      } else {
        await db.collection('groupProject').doc()
          .set({
            name: addGroup.name,
            note: addGroup.note,
            ref: [],
            createAt: DateCreate,
            updateAt: DateCreate,
            permission: 'personal',
            uid: userId,
          })
        handleCloseGroup()
        handleQuery()
      }
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }
  // edit group
  const handleOpenEditGroup = () => {
    handleMenuClose()
    setEditGroupOpen(true)
  }
  const handleCloseEditGroup = () => {
    setEditGroupOpen(false)
    setEditGroup({
      name: '',
      note: '',
    })
    setError({ ...error, editGroupName: false, editGroupNote: false })
  }
  const handleChangeEditGroup = (prop) => (event) => {
    setEditGroup({ ...editGroup, [prop]: event.target.value })
  }
  const handleEditGroup = async () => {
    setLoading(true)
    const DateUpdate = new Date()
    if (_isEmpty(editGroup.name)) {
      setError({ ...error, editGroupName: true })
    } else if (_isEmpty(editGroup.note)) {
      setError({ ...error, editGroupNote: true })
    } else {
      await db.collection('groupProject').doc(groupId)
        .update({
          name: editGroup.name,
          note: editGroup.note,
          updateAt: DateUpdate,
        })
      handleCloseEditGroup()
      handleQuery()
    }
    setLoading(false)
  }
  // TODO delete group
  const handleOpenDeleteGroup = () => {
    handleMenuClose()
    setDeleteGroupOpen(true)
  }
  const handleCloseDeleteGroup = () => {
    setDeleteGroupOpen(false)
  }
  const handleDeleteGroup = async () => {
    await db.collection('groupProject').doc(groupId).delete()
    handleCloseDeleteGroup()
    handleQuery()
    history.push('/project')
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
  // สำหรับการ filter ว่ามีโปรเจคไหนที่ใช้ไปเเล้วบ้างใน groupProject
  const handleAddProjectFilter = async () => {
    const getData = []
    const project = await db.collection('project')
      .where('uid', '==', userId)
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
  console.log('addProjectDataFilter', addProject)
  console.log('addProjectData', addProjectData)
  const handleSaveAddProject = async () => {
    const outputData = addProjectData
    if (_isEmpty(outputData) || outputData.error === true) {
      setError({ ...error, addProject: true })
    } else {
      const docId = outputData.id
      delete outputData.id
      console.log('docId1', docId)
      await db.collection('groupProject').doc(groupId)
        .collection('project')
        .doc(docId)
        .set(outputData)
      setAddProjectOpen(false)
      handleQuery()
    }
    console.log('outputData', outputData)
  }
  console.log('error1', error)
  // filter group
  const handleFilterGroup = () => {
    setFilterGroup(!filterGroup)
  }

  useEffect(() => {
    handleQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUser, filterGroup, groupId])

  // filter groupData
  useEffect(() => {
    if (groupId) {
      // สำหรับ filter groupProject ด้านซ้ายมือ
      const getGroupData = _filter(groupProject, { id: groupId })
      const groupData = getGroupData[0]
      setGroupProjectData(groupData)
      // สำหรับ filter ว่าเราเคย add project ในกลุ่มนี้เเล้วบ้างไหม
      handleAddProjectFilter()
    }
    // สำหรับ set project data เพื่อเอาไปโชร์บนหน้าเว็ป
    setMyProjectData(myProject)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupProject, groupId, myProject])

  console.log('groupProjectData', groupProjectData)
  console.log('myProject', myProject)
  console.log('myProjectData', myProjectData)

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
      <MenuItem onClick={handleMenuClose}>
        {!loading && (
          <>
            <ListItemIcon>
              <PeopleIcon
                fontSize="small"
                color={groupProjectData.permission !== 'personal' ? 'primary' : 'secondary'}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography
                color={groupProjectData.permission !== 'personal' ? 'primary' : 'secondary'}
              >
                Share
              </Typography>
            </ListItemText>
          </>
        )}
      </MenuItem>
      <MenuItem onClick={handleOpenEditGroup}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <Typography>Edit</Typography>
        </ListItemText>
      </MenuItem>
      <MenuItem onClick={handleOpenDeleteGroup}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>
          <Typography color="error">Delete</Typography>
        </ListItemText>
      </MenuItem>
    </Menu>
  )

  const renderCreateGroup = (
    <Dialog open={addGroupOpen} onClose={handleCloseGroup}>
      <DialogTitle>Add Group</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create your group for store your project.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Group Name"
          onChange={handleChangeGroup('name')}
          value={addGroup.name}
          error={addGroup.name ? false : error.addGroupName}
          variant="standard"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          label="Description"
          onChange={handleChangeGroup('note')}
          value={addGroup.note}
          error={addGroup.note ? false : error.addGroupNote}
          variant="standard"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseGroup} color="secondary">Cancel</Button>
        <Button onClick={handleAddGroup}>Save</Button>
      </DialogActions>
    </Dialog>
  )

  const renderEditGroup = (
    <Dialog open={editGroupOpen} onClose={handleCloseEditGroup}>
      <DialogTitle>Edit Group</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Edit group name and description for your project.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="New Group Name"
          onChange={handleChangeEditGroup('name')}
          value={editGroup.name}
          error={editGroup.name ? false : error.editGroupName}
          variant="standard"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          label="New Description"
          onChange={handleChangeEditGroup('note')}
          value={editGroup.note}
          error={editGroup.note ? false : error.editGroupNote}
          variant="standard"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditGroup} color="secondary">Cancel</Button>
        <Button onClick={handleEditGroup}>Save</Button>
      </DialogActions>
    </Dialog>
  )

  const renderDeleteGroup = (
    <Dialog open={deleteGroupOpen} onClose={handleCloseDeleteGroup}>
      <DialogTitle>Delete Group</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deleting the group will cause you to lose all projects shared in this group.
          But it will not delete the original project.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteGroup} color="secondary">Cancel</Button>
        <Button onClick={handleDeleteGroup} color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  )

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
        <Button onClick={handleCloseAddProject} color="secondary">Cancel</Button>
        <Button onClick={handleSaveAddProject} color="primary">Add</Button>
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
            <Box display="flex">
              <IconButton onClick={handleOpenGroup} color="primary">
                <AddBoxIcon />
              </IconButton>
              {/* <Box ml={1} /> */}
              <IconButton onClick={handleFilterGroup} color="primary">
                {filterGroup ? (
                  <ArrowDropUpIcon />
                ) : (
                  <ArrowDropDownIcon />
                )}
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Stack spacing={4} className={classes.listStack}>
            <Box />
            <Link to="/project" className={classes.link}>
              My Project
            </Link>
            {_map(groupProject, (data) => (
              <Link to={`/group-project/${data.id}`} className={classes.link}>
                {data.name}
              </Link>
            ))}
          </Stack>
          {/* <Divider /> */}
        </Box>
        <Box className={classes.pageRight} fullWidth>
          {!groupId ? (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" fontWeight="bold">
                  My Project
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Button
                    variant="contained"
                    startIcon={<AddBoxIcon />}
                    onClick={() => history.push('/project/create')}
                  >
                    Create
                  </Button>
                  {/* <IconButton color="primary">
                    <AddBoxIcon />
                  </IconButton> */}
                </Box>
              </Box>
              <Divider />
              <Box sx={{ flexGrow: 1 }} mt={2}>
                <Grid container spacing={2} className={classes.gridProject}>
                  {_map(myProjectData, (data) => (
                    <>
                      <Grid item lg={4} md={12} sm={12} sx={{ flexGrow: 1 }}>
                        <CardProject
                          values={data}
                          loading={loading}
                          userId={userId}
                          groupId={groupId || 'null'}
                          setLoading={setLoading}
                          handleQuery={handleQuery}
                        />
                      </Grid>
                    </>
                  ))}
                </Grid>
              </Box>
            </Box>
          ) : (
            <Box>
              {!loading && (
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
                      <Box ml={1} />
                      <Tooltip title={groupProjectData.note}>
                        <IconButton size="small">
                          <InfoIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <Box ml={1} />
                      <IconButton color="primary" onClick={handleOpenAddProject}>
                        <AddBoxIcon />
                      </IconButton>
                      <Box ml={1} />
                      <IconButton onClick={handleProfileMenuOpen}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ flexGrow: 1 }} mt={2}>
                    <Grid container spacing={2} className={classes.gridProject}>
                      {_map(myProjectData, (data) => (
                        <>
                          <Grid item lg={4} md={12} sm={12} sx={{ flexGrow: 1 }}>
                            <CardProject
                              values={data}
                              loading={loading}
                              userId={userId}
                              groupId={groupId || 'null'}
                              setLoading={setLoading}
                              handleQuery={handleQuery}
                            />
                          </Grid>
                        </>
                      ))}
                    </Grid>
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>
        {renderMenu}
        {renderCreateGroup}
        {renderEditGroup}
        {renderDeleteGroup}
        {renderAddProject}
      </Box>
    </Box>
  )
}

export default GroupProject
