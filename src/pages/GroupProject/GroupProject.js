import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _filter from 'lodash/filter'
import _differenceBy from 'lodash/differenceBy'
import _lowerCase from 'lodash/lowerCase'
import _capitalize from 'lodash/capitalize'
import _toInteger from 'lodash/toInteger'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddBoxIcon from '@mui/icons-material/AddBox'
import PeopleIcon from '@mui/icons-material/People'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import InfoIcon from '@mui/icons-material/Info'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

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
    height: 'calc(100vh - 172px)',
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
  listItemDone: {
    '&,&:focus': {
      color: '#ffff',
    },
    '&:hover': {
      color: '#008184',
    },
  },
}))

function GroupProject(props) {
  const path = _get(props, 'computedMatch.params')
  const groupId = path.gid
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

  const formatCreateAtDate = format(_toInteger(`${_get(groupProjectData, 'createAt.seconds')}000`), 'dd LLL yyyy')
  const formatUpdateAtDate = format(_toInteger(`${_get(groupProjectData, 'updateAt.seconds')}000`), 'dd LLL yyyy')

  // selected group
  const [selectedGroup, setSelectedGroup] = useState(!groupId ? 'My Project' : groupId)

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

  // share group
  const [shareGroupOpen, setShareGroupOpen] = useState(false)
  const [shareGroupPermission, setShareGroupPermission] = useState('')
  const sharePermissionList = [
    { permission: 'Personal' },
    { permission: 'Viewer' },
    { permission: 'Editor' },
  ]

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
    try {
      setLoading(true)
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
        await db.collection('groupProject').doc(groupId).get().then((doc) => {
          if (doc.data().uid !== userId) {
            history.push(`/group-project/${groupId}/share`)
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
      setLoading(false)
    } catch (err) {
      console.log(err)
      history.push('/404')
    }
  }

  // add Group
  const handleOpenGroup = () => {
    setAddGroupOpen(true)
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
  // delete group
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

  // filter group
  const handleFilterGroup = () => {
    setFilterGroup(!filterGroup)
  }

  // share group
  const handleOpenShareGroup = () => {
    handleMenuClose()
    setShareGroupPermission(groupProjectData.permission)
    setShareGroupOpen(true)
  }
  const handleCloseShareGroup = () => {
    setShareGroupOpen(false)
    setShareGroupPermission('')
    setAnchorEl(null)
  }
  const handleChangeShareGroup = (event) => {
    setShareGroupPermission(event.target.value)
  }
  const handleSaveShareGroup = async () => {
    const DateUpdate = new Date()
    await db.collection('groupProject').doc(groupId)
      .update({
        permission: _lowerCase(shareGroupPermission),
        updateAt: DateUpdate,
      })
    handleCloseShareGroup()
    handleQuery()
  }

  // onClick listStack
  const handleClickListStack = (onClick) => {
    history.push(onClick)
  }

  useEffect(() => {
    handleQuery()
    // onClick listStack
    setSelectedGroup(groupId || 'My Project')
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
      <MenuItem onClick={handleOpenShareGroup}>
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
        <Box mb={1}>
          <Button onClick={handleCloseGroup} color="secondary" variant="outlined">Cancel</Button>
        </Box>
        <Box mr={2} mb={1}>
          <Button onClick={handleAddGroup} color="primary" variant="contained">Save</Button>
        </Box>
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
        <Box mb={1}>
          <Button onClick={handleCloseEditGroup} color="secondary" variant="outlined">Cancel</Button>
        </Box>
        <Box mr={2} mb={1}>
          <Button onClick={handleEditGroup} color="primary" variant="contained">Save</Button>
        </Box>
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
        <Box mb={1}>
          <Button onClick={handleCloseDeleteGroup} color="secondary" variant="outlined">Cancel</Button>
        </Box>
        <Box mr={2} mb={1}>
          <Button onClick={handleDeleteGroup} color="error" variant="contained">Delete</Button>
        </Box>
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
        <Box mb={1}>
          <Button onClick={handleCloseAddProject} color="secondary" variant="outlined">Cancel</Button>
        </Box>
        <Box mr={2} mb={1}>
          <Button onClick={handleSaveAddProject} color="primary" variant="contained">Add</Button>
        </Box>
      </DialogActions>
    </Dialog>
  )

  const renderShareProject = (
    <Dialog open={shareGroupOpen} onClose={handleCloseShareGroup}>
      <DialogTitle>Share Group</DialogTitle>
      <DialogContent>
        {!loading && (
          <>
            <TextField
              select
              margin="dense"
              label="Permission"
              value={shareGroupPermission}
              onChange={handleChangeShareGroup}
              SelectProps={{
                renderValue: (value) => _capitalize(value),
              }}
              variant="outlined"
              fullWidth
            >
              {_map(sharePermissionList, (option) => (
                <MenuItem value={option.permission}>
                  {option.permission}
                </MenuItem>
              ))}
            </TextField>
            {_lowerCase(shareGroupPermission) !== 'personal' && (
              <>
                <Box mt={1} />
                <Box display="flex">
                  <TextField
                    label="link"
                    value={`http://arduinostock.web.app/group-project/${groupId}/share`}
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                  <Box ml={1} />
                  <Button
                    onClick={() => navigator.clipboard.writeText(`http://arduinostock.web.app/group-project/${groupId}/share`)}
                    variant="outlined"
                  >
                    Copy
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
        <Box mt={1} />
        <DialogContentText>
          Select a permission from this group. the permission that selected will effect to your group.
        </DialogContentText>
        <Box mt={1} />
        <DialogContentText>
          Personal - Only you can see this group
        </DialogContentText>
        <DialogContentText>
          Viewer - User can see this group
        </DialogContentText>
        <DialogContentText>
          Editor - User can edit project in this group
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box mb={1}>
          <Button onClick={handleCloseShareGroup} color="secondary" variant="outlined">Cancel</Button>
        </Box>
        <Box mr={2} mb={1}>
          <Button onClick={handleSaveShareGroup} color="primary" variant="contained">Save</Button>
        </Box>
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
          <List component="nav" aria-label="main mailbox folders" className={classes.listStack}>
            <ListItemButton
              // selected={selectedGroup === 'My Project'}
              onClick={() => handleClickListStack('/project')}
              sx={{ paddingLeft: '0' }}
            >
              <ListItemText primary={(
                <Typography
                  variant="h6"
                  // className={classes.listItemDone}
                  color={`${selectedGroup === 'My Project' ? 'primary' : 'secondary'}`}
                >
                  My Project
                </Typography>
              )}
              />
            </ListItemButton>
            {_map(groupProject, (data) => (
              <>
                <Box mt={2}>
                  <ListItemButton
                    // selected={selectedGroup === data.name}
                    onClick={() => handleClickListStack(`/group-project/${data.id}`)}
                    sx={{ paddingLeft: '0' }}
                  >
                    <ListItemText primary={(
                      <Typography
                        variant="h6"
                        // className={classes.listItemDone}
                        color={`${selectedGroup === data.id ? 'primary' : 'secondary'}`}
                      >
                        {data.name}
                      </Typography>
                    )}
                    />
                  </ListItemButton>
                </Box>
              </>
            ))}
          </List>
        </Box>
        <Box className={classes.pageRight} fullWidth>
          {!groupId ? (
            <>
              {!loading ? (
                <>
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
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ flexGrow: 1 }} mt={2}>
                    <Grid container spacing={2} className={classes.gridProject}>
                      {_map(myProjectData, (data) => (
                        <>
                          <Grid item lg={4} md={6} sm={12} sx={{ flexGrow: 1 }}>
                            <CardProject
                              values={data}
                              loading={loading}
                              userId={userId}
                              groupId={groupId || 'null'}
                              setLoading={setLoading}
                              handleQuery={handleQuery}
                              actionType="edit"
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
            </>
          ) : (
            <Box>
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
                      <Box ml={1} />
                      <Tooltip
                        title={(
                          <Grid container spacing={1} maxWidth="250px">
                            <Grid item xs={12}>
                              <Typography variant="h6">Group data</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2">Group</Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="body2">{groupProjectData.name}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2">Note</Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="body2">{groupProjectData.note}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2">Permission</Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="body2">{_capitalize(groupProjectData.permission)}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2">Created</Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="body2">{formatCreateAtDate}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2">Updated</Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="body2">{formatUpdateAtDate}</Typography>
                            </Grid>
                          </Grid>
                        )}
                      >
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
                          <Grid item lg={4} md={6} sm={12} sx={{ flexGrow: 1 }}>
                            <CardProject
                              values={data}
                              loading={loading}
                              userId={userId}
                              groupId={groupId || 'null'}
                              setLoading={setLoading}
                              handleQuery={handleQuery}
                              actionType="edit"
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
          )}
        </Box>
        {renderMenu}
        {renderCreateGroup}
        {renderEditGroup}
        {renderDeleteGroup}
        {renderAddProject}
        {renderShareProject}
      </Box>
    </Box>
  )
}

export default GroupProject
