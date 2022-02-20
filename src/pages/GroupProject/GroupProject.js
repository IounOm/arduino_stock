import React, { useState, useContext, useEffect } from 'react'
import { Redirect, Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'

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
  const [loading, setLoading] = useState(false)
  const [myProject, setMyProject] = useState([])
  const [groupProject, setGroupProject] = useState([])
  const [groupProjectData, setGroupProjectData] = useState({})
  const [filterGroup, setFilterGroup] = useState(false)
  const [error, setError] = useState({
    addGroupName: false,
    addGroupNote: false,
    editGroupName: false,
    editGroupNote: false,
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
      if (!path.id) {
        const project = await firebase.firestore().collection('project')
          .where('uid', '==', userId)
          // .orderBy('updateAt', 'desc')
          .get()
        project.docs.forEach((doc) => {
          myOutput.push({
            id: doc.id,
            ...doc.data(),
          })
        })
      }
      const groupData = await firebase.firestore().collection('groupProject')
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
  const handleAddGroup = async () => {
    try {
      setLoading(true)
      const DateCreate = new Date()
      if (_isEmpty(addGroup.name)) {
        setError({ ...error, addGroupName: true })
      } else if (_isEmpty(addGroup.note)) {
        setError({ ...error, addGroupNote: true })
      } else {
        await firebase.firestore().collection('groupProject').doc()
          .set({
            name: addGroup.name,
            note: addGroup.note,
            ref: [],
            createAt: DateCreate,
            updateAt: DateCreate,
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
      await firebase.firestore().collection('groupProject').doc(path.id)
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
    await firebase.firestore().collection('groupProject').doc(path.id).delete()
    handleCloseDeleteGroup()
    handleQuery()
    history.push('/group-project')
  }

  // filter group
  const handleFilterGroup = () => {
    setFilterGroup(!filterGroup)
  }

  useEffect(() => {
    handleQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUser, filterGroup])

  // filter groupData
  useEffect(() => {
    if (path.id) {
      const getGroupData = _filter(groupProject, { id: path.id })
      const groupData = getGroupData[0]
      setGroupProjectData(groupData)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupProject, path.id])

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
        <ListItemIcon>
          <PeopleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Share</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleOpenEditGroup}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleOpenDeleteGroup}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
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
              <Box ml={1} />
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
            <Link to="/group-project" className={classes.link}>
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
          {!path.id ? (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    My Project
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Button
                    variant="contained"
                    startIcon={<AddBoxIcon />}
                  >
                    Create
                  </Button>
                  {/* <IconButton color="primary">
                    <AddBoxIcon />
                  </IconButton> */}
                </Box>
              </Box>
              <Divider />
            </Box>
          ) : (
            <Box>
              {!loading && (
                <>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h4" fontWeight="bold">
                        {groupProjectData.name}
                      </Typography>
                      <Box ml={1} />
                      <Tooltip title={groupProjectData.note}>
                        <IconButton size="small">
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <IconButton color="primary">
                        <AddBoxIcon />
                      </IconButton>
                      <Box ml={1} />
                      <IconButton onClick={handleProfileMenuOpen}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Divider />
                  {/* <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="body">
                      {groupProjectData.note}
                    </Typography>
                  </Box> */}
                </>
              )}
            </Box>
          )}
        </Box>
        {renderMenu}
        {renderCreateGroup}
        {renderEditGroup}
        {renderDeleteGroup}
      </Box>
    </Box>
  )
}

export default GroupProject
