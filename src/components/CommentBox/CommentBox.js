import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { format } from 'date-fns'

import _toInteger from 'lodash/toInteger'
import _get from 'lodash/get'
import _map from 'lodash/map'
import _lowerCase from 'lodash/lowerCase'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'

import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import firebase from '../../config'

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: '8px !important',
  },
}))

function CommentBox(props) {
  const {
    values, loading, handleQuery, projectId, groupId, userId,
  } = props
  const classes = useStyles()
  const history = useHistory()
  const db = firebase.firestore()

  const [anchorEl, setAnchorEl] = useState(false)
  const isMenuOpen = Boolean(anchorEl)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [commentData, setCommentData] = useState(values.comment)

  const commentLists = [
    {
      name: <Typography>Edit</Typography>,
      icon: <EditIcon fontSize="small" />,
    },
    {
      name: <Typography color="error">Delete</Typography>,
      icon: <DeleteIcon fontSize="small" color="error" />,
    },
  ]

  const formatCreateAtDate = format(_toInteger(`${_get(values, 'createAt.seconds')}000`), 'dd LLLL yyyy')

  const updateDate = values.updateAt.seconds + values.updateAt.nanoseconds
  const createDate = values.createAt.seconds + values.createAt.nanoseconds

  const handleChangeComment = (event) => {
    setCommentData(event.target.value)
  }

  // dialog Edit
  const handleEditOpen = () => {
    setEditOpen(true)
  }
  const handleEditClose = () => {
    setEditOpen(false)
  }
  const handleEditSave = async () => {
    try {
      const newDate = new Date()
      if (projectId && !groupId) {
        await db.collection('project').doc(projectId).collection('comment').doc(values.id)
          .update({
            comment: commentData,
            updateAt: newDate,
          })
        handleQuery()
      } else if (projectId && groupId) {
        await db.collection('groupProject').doc(groupId).collection('project').doc(projectId)
          .collection('comment')
          .doc(values.id)
          .update({
            comment: commentData,
            updateAt: newDate,
          })
        handleQuery()
      }
      setCommentData('')
      setEditOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  // dialog delete
  const handleDeleteOpen = () => {
    setDeleteOpen(true)
  }
  const handleDeleteClose = () => {
    setDeleteOpen(false)
  }
  const handleDeleteSave = async () => {
    try {
      if (projectId && !groupId) {
        await db.collection('project').doc(projectId).collection('comment').doc(values.id)
          .delete()
        handleQuery()
      } else if (projectId && groupId) {
        await db.collection('groupProject').doc(groupId).collection('project').doc(projectId)
          .collection('comment')
          .doc(values.id)
          .delete()
        handleQuery()
      }
      setDeleteOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  // menuItem
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(false)
  }
  const handleClickList = (type) => {
    if (_lowerCase(_get(type, 'props.children')) === 'edit') {
      setAnchorEl(false)
      handleEditOpen()
    } else if (_lowerCase(_get(type, 'props.children')) === 'delete') {
      setAnchorEl(false)
      handleDeleteOpen()
    }
  }

  const menuId = 'commentId'
  const renderMenu = (
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
      {_map(commentLists, (list) => (
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

  const renderEditComment = (
    <Dialog open={editOpen} onClose={handleEditClose}>
      <DialogTitle>Edit Comment</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Update Comment"
          multiline
          rows={3}
          defaultValue=""
          variant="filled"
          value={commentData}
          onChange={(e) => handleChangeComment(e)}
        />
        <Box mt={2} />
        <DialogContentText>
          Edit this comment will update the comments within this project.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box mb={1}>
          <Button onClick={handleEditClose} color="secondary" variant="outlined">Cancel</Button>
        </Box>
        <Box mr={2} mb={1}>
          <Button onClick={handleEditSave} color="primary" variant="contained">Save</Button>
        </Box>
      </DialogActions>
    </Dialog>
  )

  const renderDeleteComment = (
    <Dialog open={deleteOpen} onClose={handleDeleteClose}>
      <DialogTitle>Delete Comment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deleting this comment will cause you to lose it and you will not be able to recover this comment again.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box mb={1}>
          <Button onClick={handleDeleteClose} color="secondary" variant="outlined">Cancel</Button>
        </Box>
        <Box mr={2} mb={1}>
          <Button onClick={handleDeleteSave} color="error" variant="contained">Delete</Button>
        </Box>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box>
      {!loading ? (
        <>
          <Box mt={2} />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <IconButton size="small" onClick={() => history.push(`/profile/${values.uid}`)}>
                <Avatar
                  alt={values.uidRef.name}
                  src={values.uidRef.image}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>
              <Box ml={2}>
                <Typography variant="body2">
                  {values.uidRef.name}
                </Typography>
                {createDate === updateDate ? (
                  <Typography variant="body2" color="secondary" fontWeight="normal">
                    {formatCreateAtDate}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="secondary" fontWeight="normal">
                    {`${formatCreateAtDate} : edited`}
                  </Typography>
                )}
              </Box>
            </Box>
            {userId === values.uid && (
              <IconButton onClick={handleMenuOpen} size="small">
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>
          <Box mt={1} />
          <Typography variant="body2">
            {values.comment}
          </Typography>
          <Box mt={2} />
          <Divider />
        </>
      ) : (
        <>
          <Box display="flex" alignItems="center" justifyContent="center" pt={4} pb={4}>
            <CircularProgress />
          </Box>
          <Divider />
        </>
      )}
      {renderMenu}
      {renderEditComment}
      {renderDeleteComment}
    </Box>
  )
}

CommentBox.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.bool,
  handleQuery: PropTypes.func,
  projectId: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
}

CommentBox.defaultProps = {
  loading: false,
  handleQuery: () => {},
}

export default CommentBox
