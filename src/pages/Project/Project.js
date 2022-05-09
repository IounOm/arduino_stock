import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { customAlphabet } from 'nanoid'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _toInteger from 'lodash/toInteger'
import _lowerCase from 'lodash/lowerCase'
import _camelCase from 'lodash/camelCase'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
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
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
// import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import RichText from '../../components/RichText/RichText'

import { getUser } from '../../redux/selectors/user.selector'
import UploadImage from '../../components/UploadImage/UploadImage'
// import CardProject from '../../components/CardProject/CardProject'
import CommentBox from '../../components/CommentBox/CommentBox'
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
    minHeight: 'calc(100vh - 182px)',
    marginTop: '64px',
    padding: '40px 25% 40px 25%',
    [theme.breakpoints.down('lg')]: {
      padding: '40px 20% 40px 20%',
    },
    [theme.breakpoints.down('md')]: {
      padding: '20px 15% 20px 15%',
      minHeight: 'calc(100vh - 142px)',
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
    flexDirection: 'column',
    // alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  richText: {
    // fontFamily: 'serif',
    fontFamily: 'IBM Plex Sans Thai',
  },
  headerText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 9.6px o 4.6px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
}))

function Project(props) {
  const path = _get(props, 'computedMatch.params')
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 20)
  const projectId = path.id
  const actionType = path.type
  const groupId = path.gid
  const location = useLocation()
  const { pathname } = location
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
    userType,
  } = myUser
  const db = firebase.firestore()
  // const storage = firebase.storage()

  const [loading, setLoading] = useState(false)
  const [loadingComment, setLoadingComment] = useState(false)
  const [docId, setDocId] = useState('')
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
  const [writeComment, setWriteComment] = useState('')
  const [errorComment, setErrorComment] = useState(false)
  const [comment, setComment] = useState([])
  const [commentData, setCommentData] = useState([])
  const [filterComment, setFilterComment] = useState(false)

  const [editDisable, setEditDisable] = useState(false)
  const [Disable, setDisable] = useState(false)

  const [openSaveMenu, setOpenSaveMenu] = useState(false)
  const [checkSwitch, setCheckSwitch] = useState(false)

  const [errorSave, setErrorSave] = useState({
    image: false,
    title: false,
    subtitle: false,
    tag: false,
  })

  const [anchorEl, setAnchorEl] = useState(false)
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false)
  const [deleteGroupMenuOpen, setDeleteGroupMenuOpen] = useState(false)
  const isMenuOpen = Boolean(anchorEl)
  const userLists = [
    {
      name: <Typography>Edit</Typography>,
      icon: <EditIcon fontSize="small" />,
    },
    {
      name: <Typography color="error">Delete</Typography>,
      icon: <DeleteIcon fontSize="small" color="error" />,
    },
  ]

  const tag = [
    { value: 'Creative', label: 'Creative' },
    { value: 'Hardware', label: 'Hardware' },
    { value: 'Software', label: 'Software' },
    { value: 'Human Perception', label: 'Human Perception' },
    { value: 'More', label: 'More' },
  ]

  const formatCreateAtDate = format(_toInteger(`${_get(value, 'createAt.seconds')}000`), 'dd LLLL yyyy')
  // const formatUpdateAtDate = format(_toInteger(`${_get(value, 'updateAt.seconds')}000`), 'dd LLLL yyyy')

  const handleQuery = async () => {
    try {
      setLoading(true)
      if (projectId && !groupId) {
        await firebase.firestore().collection('project').doc(projectId).get()
          .then((doc) => {
            const data = doc.data()
            setValue({ ...value, article: data.article })
            data.uidRef.get().then((res) => {
              if (actionType === 'edit' && doc.data().uid !== userId && userType !== 'admin') {
                history.push('/404') // you cant edit other project
              } else if (actionType === 'view' && doc.data().uid !== userId && doc.data().publish !== true && userType !== 'admin') {
                history.push('/404') // this project not publish
              } else {
                if (actionType === 'view' && doc.data().uid !== userId && userType !== 'admin') {
                  setDisable(true)
                }
                setValue({
                  ...doc.data(),
                  uidRef: res.data(),
                })
                setCheckSwitch(doc.data().publish)
              }
            })
          })
      } else if (projectId && groupId) {
        let groupUserId = ''
        let permission = ''
        await firebase.firestore().collection('groupProject').doc(groupId).get()
          .then((doc) => {
            groupUserId = doc.data().uid
            permission = doc.data().permission
          })
        await firebase.firestore().collection('groupProject').doc(groupId).collection('project')
          .doc(projectId)
          .get()
          .then((doc) => {
            const data = doc.data()
            setValue({ ...value, article: data.article })
            data.uidRef.get().then((res) => {
              if ((actionType === 'edit' && doc.data().uid !== userId && groupUserId !== userId && userType !== 'admin')
              || (actionType === 'edit' && doc.data().uid === userId && groupUserId !== userId && permission === 'viewer' && userType !== 'admin')) {
                history.push('/404')
              } else {
                if ((actionType === 'view' && doc.data().uid !== userId && groupUserId !== userId)
                || (actionType === 'view' && doc.data().uid === userId && groupUserId !== userId && permission === 'viewer')) {
                  setDisable(true)
                }
                setValue({
                  ...doc.data(),
                  uidRef: res.data(),
                })
                setCheckSwitch(doc.data().publish)
              }
            })
          })
      }
      setDocId(nanoid())
      setLoading(false)
    } catch (err) {
      console.log(err)
      history.push('/404')
    }
  }

  const handleQueryComment = async () => {
    try {
      setLoadingComment(true)
      const output = []
      if (projectId && !groupId) {
        const comments = await db.collection('project').doc(projectId).collection('comment')
          .orderBy('createAt', filterComment ? 'desc' : 'asc')
          .get()
        comments.docs.forEach((doc) => {
          doc.data().uidRef.get().then((res) => {
            output.push({
              id: doc.id,
              ...doc.data(),
              uidRef: res.data(),
            })
            setComment([...output])
          })
        })
      } else if (projectId && groupId) {
        const comments = await db.collection('groupProject').doc(groupId).collection('project').doc(projectId)
          .collection('comment')
          .orderBy('createAt', filterComment ? 'desc' : 'asc')
          .get()
        comments.docs.forEach((doc) => {
          doc.data().uidRef.get().then((res) => {
            output.push({
              id: doc.id,
              ...doc.data(),
              uidRef: res.data(),
            })
            setComment([...output])
          })
        })
      }
      setLoadingComment(false)
    } catch (err) {
      setLoadingComment(false)
      console.log(err)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const DateCreate = new Date()
      if (_isEmpty(value.image)
      || _isEmpty(value.title)
      || _isEmpty(value.subtitle)
      || _isEmpty(value.tag)) {
        const errorOutput = {
          image: false,
          title: false,
          subtitle: false,
          tag: false,
        }
        Object.keys(value).forEach((key) => {
          Object.keys(errorSave).forEach((errorKey) => {
            if (key === errorKey && _isEmpty(value[key])) {
              Object.assign(errorOutput, { [errorKey]: true })
            }
          })
          setErrorSave(errorOutput)
        })
      } else if (!projectId && !groupId) {
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
            tag: _camelCase(value.tag),
          })
        dispatch(userAction.uploadImage(''))
        dispatch(userAction.saveProject(false))
        history.push('/project')
      } else if (projectId && !groupId) {
        await db.collection('project').doc(projectId)
          .update({
            article: value.article,
            updateAt: DateCreate,
            publish: value.publish,
            title: value.title,
            subtitle: value.subtitle,
            tag: _camelCase(value.tag),
          })
        dispatch(userAction.uploadImage(''))
        dispatch(userAction.saveProject(false))
        history.push(`/project/view/${projectId}`)
      } else if (projectId && groupId) {
        await db.collection('groupProject').doc(groupId).collection('project').doc(projectId)
          .update({
            article: value.article,
            updateAt: DateCreate,
            publish: value.publish,
            title: value.title,
            subtitle: value.subtitle,
            tag: _camelCase(value.tag),
          })
        dispatch(userAction.uploadImage(''))
        dispatch(userAction.saveProject(false))
        history.push(`/group-project/${groupId}/project/view/${projectId}`)
      }
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
    dispatch(userAction.saveProject(false))
  }
  const handleChange = (prop) => (event) => {
    setValue({ ...value, [prop]: event.target.value })
  }

  // change switch publish
  const handleChangeSwitch = () => {
    setCheckSwitch(!checkSwitch)
    setValue({ ...value, publish: !checkSwitch })
  }

  // for edit / delete project menuItem
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(false)
  }
  const handleDeleteProject = async (type) => {
    setLoading(true)
    try {
      if (type === 'project') {
        await db.collection('project').doc(projectId).delete()
      } else if (type === 'groupProject') {
        await db.collection('groupProject').doc(groupId).collection('project').doc(projectId)
          .delete()
      }
      history.goBack()
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }
  // delete project
  const handleOpenMenuDelete = (type) => {
    if (type === 'project') {
      setDeleteMenuOpen(true)
    } else if (type === 'groupProject') {
      setDeleteGroupMenuOpen(true)
    }
  }
  const handleCloseMenuDelete = () => {
    setDeleteMenuOpen(false)
    setDeleteGroupMenuOpen(false)
  }
  const handleClickList = async (type) => {
    if (_lowerCase(_get(type, 'props.children')) === 'delete' && _isEmpty(groupId)) {
      setAnchorEl(false)
      handleOpenMenuDelete('project')
      console.log(`delete project id ${projectId}`)
    } else if (_lowerCase(_get(type, 'props.children')) === 'delete' && !_isEmpty(groupId)) {
      setAnchorEl(false)
      handleOpenMenuDelete('groupProject')
      console.log(`delete project id ${projectId} in groupProject ${groupId}`)
    } else if (_lowerCase(_get(type, 'props.children')) === 'edit' && _isEmpty(groupId)) {
      setAnchorEl(false)
      history.push(`/project/edit/${projectId}`)
    } else if (_lowerCase(_get(type, 'props.children')) === 'edit' && !_isEmpty(groupId)) {
      setAnchorEl(false)
      history.push(`/group-project/${groupId}/project/edit/${projectId}`)
    }
  }

  // write comment
  const handleChangeComment = (event) => {
    setWriteComment(event.target.value)
  }
  // filter comment
  const handleFilterComment = () => {
    setFilterComment(!filterComment)
  }
  const handleSaveComment = async () => {
    try {
      if (userId) {
        setLoadingComment(true)
        const DateCreate = new Date()
        if (_isEmpty(writeComment)) {
          setErrorComment(true)
        } else if (projectId && !groupId) {
          await db.collection('project').doc(projectId).collection('comment').doc()
            .set({
              comment: writeComment,
              createAt: DateCreate,
              updateAt: DateCreate,
              uid: userId,
              uidRef: db.doc(`users/${userId}`),
            })
          handleQueryComment()
        } else if (projectId && groupId) {
          await db.collection('groupProject').doc(groupId).collection('project').doc(projectId)
            .collection('comment')
            .doc()
            .set({
              comment: writeComment,
              createAt: DateCreate,
              updateAt: DateCreate,
              uid: userId,
              uidRef: db.doc(`users/${userId}`),
            })
          handleQueryComment()
        }
        setWriteComment('')
        setLoadingComment(false)
      } else {
        history.push('/login')
      }
    } catch (err) {
      setLoadingComment(false)
      console.log(err)
    }
  }

  useEffect(() => {
    handleQuery()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, groupId, actionType])
  useEffect(() => {
    handleQueryComment()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, groupId, filterComment])

  useEffect(() => {
    if (save === true) {
      // handleSave()
      handleOpenSave()
      // history.push('/project')
    } else {
      handleCloseSave()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save])

  useEffect(() => {
    setValue({ ...value, image: uploadImg })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadImg, projectId, groupId])

  useEffect(() => {
    if (pathname === '/project/create') {
      setEditDisable(false)
    } else if (actionType === 'edit') {
      setEditDisable(false)
    } else {
      setEditDisable(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  useEffect(() => {
    setCommentData(comment)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment])

  const renderMunuSave = (
    <Dialog open={openSaveMenu} onClose={handleCloseSave}>
      <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Project Preview</Typography>
        {!groupId && (
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
        )}
      </DialogTitle>
      <DialogContent>
        <UploadImage
          collection="project"
          doc={!projectId ? docId : projectId}
          updateKey="image"
          defaultImg={value.image || ''}
          alt=""
          width="280px"
          maxWidth="500px"
          height="200px"
          loading={loading}
          page={!projectId ? 'createProject' : 'editProject'}
          error={errorSave.image}
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
          value={_camelCase(value.tag)}
          onChange={handleChange('tag')}
          error={value.tag ? false : errorSave.tag}
          variant="outlined"
          fullWidth
        >
          {tag.map((option) => (
            <MenuItem value={_camelCase(option.value)}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <DialogContentText>
          Add or change tags so readers know what your story is about
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box mb={1}>
          <Button onClick={handleCloseSave} color="secondary" variant="outlined">Cancel</Button>
        </Box>
        <Box mr={2} mb={1}>
          <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
        </Box>
      </DialogActions>
    </Dialog>
  )

  const menuId = 'menuEdit'
  const renderMenuEdit = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      id={menuId}
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
      {_map(userLists, (list) => (
        <MenuItem
          // key={values.id}
          onClick={() => handleClickList(list.name)}
        >
          <ListItemIcon>
            {list.icon}
          </ListItemIcon>
          <ListItemText>{list.name}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  )

  const renderDeleteProject = (
    <Dialog open={deleteMenuOpen} onClose={handleCloseMenuDelete}>
      <DialogTitle>Delete Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deleting this project will cause you to lose it and you will not be able to recover this project again.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box mb={1}>
          <Button onClick={handleCloseMenuDelete} color="secondary" variant="outlined">Cancel</Button>
        </Box>
        <Box mr={2} mb={1}>
          <Button onClick={() => handleDeleteProject('project')} color="error" variant="contained">Delete</Button>
        </Box>
      </DialogActions>
    </Dialog>
  )

  const renderDeleteGroupProject = (
    <Dialog open={deleteGroupMenuOpen} onClose={handleCloseMenuDelete}>
      <DialogTitle>Delete Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deleting this project will cause you to lose it in this group. But it will not delete the original project.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box mb={1}>
          <Button onClick={handleCloseMenuDelete} color="secondary" variant="outlined">Cancel</Button>
        </Box>
        <Box mr={2} mb={1}>
          <Button onClick={() => handleDeleteProject('groupProject')} color="error" variant="contained">Delete</Button>
        </Box>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box className={classes.box}>
      <Box className={classes.paper}>
        {(projectId && actionType !== 'edit') && (
          <Box className={classes.headerText}>
            {!loading ? (
              <>
                <Box className={classes.headerLeft}>
                  <IconButton size="small" onClick={() => (value.uid !== userId ? history.push(`/profile/${value.uid}`) : history.push('/profile'))}>
                    <Avatar
                      alt={value.uidRef.name}
                      src={value.uidRef.image}
                      sx={{ width: 48, height: 48 }}
                    />
                  </IconButton>
                  <Box ml={2}>
                    <Typography variant="body2">
                      {value.uidRef.name}
                    </Typography>
                    <Typography variant="body2" color="secondary" fontWeight="normal">
                      {formatCreateAtDate}
                    </Typography>
                  </Box>
                </Box>
                {(userType === 'admin' || Disable === false) && (
                  <IconButton onClick={handleMenuOpen} size="small">
                    <MoreVertIcon />
                  </IconButton>
                )}
              </>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" pb={1}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        )}
        <Box className={classes.richText}>
          <RichText
            disabled={editDisable}
            handleOnChange={(data) => setValue({ ...value, article: data })}
            value={value.article}
            docId={!projectId ? docId : projectId}
          />
        </Box>
        {(projectId && actionType !== 'edit') && (
          <Box display={{ margin: '0 9.6px' }}>
            <Divider />
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
              <Typography variant="h6" fontWeight="bold">{`comments${!_isEmpty(commentData) ? ` (${commentData.length})` : ''}`}</Typography>
              {!_isEmpty(commentData) && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={filterComment ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  onClick={handleFilterComment}
                >
                  <Typography variant="subtitle1">
                    {filterComment ? 'Newest' : 'Oldest'}
                  </Typography>
                </Button>
              )}
            </Box>
            <Card sx={{
              // minWidth: 240,
              boxShadow: '0px 0px 10px 1px #E0E0E0',
            }}
            >
              <CardContent sx={{ padding: '16px !important' }}>
                <Box className={classes.headerLeft}>
                  <Avatar
                    alt={userName}
                    src={userImage}
                    sx={{ width: 36, height: 36 }}
                  />
                  <Box ml={2}>
                    <Typography variant="body2">
                      {userName}
                    </Typography>
                  </Box>
                </Box>
                <Box mt={2}>
                  <TextField
                    fullWidth
                    label="Share your thoughts"
                    multiline
                    rows={3}
                    defaultValue=""
                    variant="filled"
                    // variant="outlined"
                    value={writeComment}
                    onChange={handleChangeComment}
                    error={writeComment ? false : errorComment}
                    // disabled={!editUser}
                  />
                </Box>
                <Box mt={2} display="flex" justifyContent="end">
                  <Button size="small" variant="contained" onClick={handleSaveComment}>
                    <Typography variant="body2">
                      Post
                    </Typography>
                  </Button>
                </Box>
              </CardContent>
            </Card>
            <Box mt={4} />
            {!_isEmpty(commentData) && (
              <Divider />
            )}
            {_map(commentData, (data) => (
              <CommentBox
                values={data}
                loading={loadingComment}
                handleQuery={handleQueryComment}
                projectId={projectId}
                groupId={groupId}
                userId={userId}
                userType={userType}
              />
            ))}
          </Box>
        )}
        {renderMunuSave}
        {renderMenuEdit}
        {renderDeleteProject}
        {renderDeleteGroupProject}
      </Box>
    </Box>
  )
}

export default Project
