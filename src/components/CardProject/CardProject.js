import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { format } from 'date-fns'
// import { enGB, th } from 'date-fns/locale'

import _isEqual from 'lodash/isEqual'
import _toInteger from 'lodash/toInteger'
import _get from 'lodash/get'
import _map from 'lodash/map'
import _lowerCase from 'lodash/lowerCase'
import _startCase from 'lodash/startCase'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CardActionArea from '@mui/material/CardActionArea'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Hidden from '@mui/material/Hidden'
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

import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import firebase from '../../config'

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: '8px !important',
  },
}))

function CardProject(props) {
  const {
    values, loading, userId, groupId, setLoading, handleQuery, actionType, userType,
  } = props
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const [anchorEl, setAnchorEl] = useState(false)
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false)
  const [deleteGroupMenuOpen, setDeleteGroupMenuOpen] = useState(false)

  const db = firebase.firestore()

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

  const formatCreateAtDate = format(_toInteger(`${_get(values, 'createAt.seconds')}000`), 'dd LLLL yyyy')

  const handleCheckId = () => {
    if (_isEqual(values.uid, userId)) {
      history.push('/profile')
    } else {
      history.push(`/profile/${values.uid}`)
    }
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(false)
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
  const handleDeleteProject = async (type) => {
    setLoading(true)
    try {
      if (type === 'project') {
        await db.collection('project').doc(values.id).delete()
      } else if (type === 'groupProject') {
        await db.collection('groupProject').doc(groupId).collection('project').doc(values.id)
          .delete()
      }
      await handleQuery()
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const handleClickList = async (type, projectId) => {
    if (_lowerCase(_get(type, 'props.children')) === 'delete' && groupId === 'null') {
      // TODO open menu delete pop
      setAnchorEl(false)
      handleOpenMenuDelete('project')
      console.log(`delete project id ${projectId}`)
    } else if (_lowerCase(_get(type, 'props.children')) === 'delete' && groupId !== 'null') {
      // TODO open menu delete pop
      setAnchorEl(false)
      handleOpenMenuDelete('groupProject')
      console.log(`delete project id ${projectId} in groupProject ${groupId}`)
    } else if (_lowerCase(_get(type, 'props.children')) === 'edit' && groupId === 'null') {
      setAnchorEl(false)
      history.push(`/project/edit/${projectId}`)
    } else if (_lowerCase(_get(type, 'props.children')) === 'edit' && groupId !== 'null') {
      setAnchorEl(false)
      history.push(`/group-project/${groupId}/project/edit/${projectId}`)
    }
  }

  const handleClickView = () => {
    if (groupId === 'null') {
      history.push(`/project/view/${values.id}`)
    } else {
      history.push(`/group-project/${groupId}/project/view/${values.id}`)
    }
  }

  const menuId = 'munuCard'

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
      {_map(userLists, (list) => (
        <MenuItem
          // key={values.id}
          onClick={() => handleClickList(list.name, values.id)}
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
    <Box>
      <Hidden mdDown>
        <Card sx={{ boxShadow: '0px 0px 10px 1px #E0E0E0' }}>
          <CardHeader
            avatar={(
              <IconButton
                onClick={handleCheckId}
                size="small"
              >
                <Avatar
                  sx={{ width: 42, height: 42 }}
                  aria-label="recipe"
                  src={values.uidRef.image}
                  alt=""
                />
              </IconButton>
          )}
            action={(
              <>
                {(userType === 'admin' || actionType !== 'view') && (
                  <IconButton size="small" onClick={handleMenuOpen}>
                    <MoreVertIcon />
                  </IconButton>
                )}
              </>
          )}
            className={classes.cardHeader}
            title={values.uidRef.name}
            subheader={formatCreateAtDate}
          />
          <CardActionArea onClick={handleClickView}>
            <CardMedia
              component="img"
              height="194"
              image={values.image}
              alt="Arduino Project Image"
            />
            <CardContent sx={{ height: 70, maxHeight: 80 }}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  '-webkit-line-clamp': '2',
                  '-webkit-box-orient': 'vertical',
                }}
              >
                {values.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  '-webkit-line-clamp': '2',
                  '-webkit-box-orient': 'vertical',
                }}
              >
                {values.subtitle}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
            <Chip
              label={_startCase(values.tag)}
              onClick={() => history.push(`/home/tag/${values.tag}/page/1`)}
            />
            {pathname === '/project' && (
              <Chip
                label={values.publish ? 'Publish' : 'Draft'}
                color={values.publish ? 'success' : 'secondary'}
                variant="outlined"
              />
            )}
          </CardActions>
        </Card>
      </Hidden>
      {/* {ipad & mobile} */}
      <Hidden mdUp>
        <Box>
          <Box display="flex" alignItems="center">
            <Avatar
              alt="Arduino Project Image"
              src={values.uidRef.image}
              sx={{ width: 24, height: 24 }}
              onClick={handleCheckId}
            />
            <Box display="flex" alignItems="center" ml={1}>
              <Typography variant="subtitle1" onClick={handleCheckId}>
                {values.uidRef.name}
              </Typography>
              <Box ml={1} />
              <Typography variant="subtitle2" color="secondary">
                {formatCreateAtDate}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box mt={1} onClick={handleClickView}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  '-webkit-line-clamp': '2',
                  '-webkit-box-orient': 'vertical',
                }}
              >
                {values.title}
              </Typography>
              <Hidden smDown>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    '-webkit-line-clamp': '2',
                    '-webkit-box-orient': 'vertical',
                  }}
                >
                  {values.subtitle}
                </Typography>
              </Hidden>
              <Hidden smUp>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    '-webkit-line-clamp': '1',
                    '-webkit-box-orient': 'vertical',
                  }}
                >
                  {values.subtitle}
                </Typography>
              </Hidden>
            </Box>
            <Box ml={2} onClick={() => history.push(`/project/view/${values.id}`)}>
              <Hidden smUp>
                <Avatar
                  alt="Arduino Project Image"
                  src={values.image}
                  variant="rounded"
                  className={classes.imageSm}
                  sx={{ width: 68, height: 68 }}
                />
              </Hidden>
              <Hidden smDown>
                <Avatar
                  alt="Arduino Project Image"
                  src={values.image}
                  variant="rounded"
                  className={classes.imageSm}
                  sx={{ width: 98, height: 98 }}
                />
              </Hidden>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={1} mb={1}>
            <Box display="flex" alignItems="center">
              <Chip label={_startCase(values.tag)} size="small" onClick={() => history.push(`/home/tag/${values.tag}/page/1`)} />
              <Box ml={1} />
              {pathname === '/project' && (
                <Chip
                  label={values.publish ? 'Publish' : 'Draft'}
                  color={values.publish ? 'success' : 'secondary'}
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
            {(userType === 'admin' || actionType !== 'view') && (
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreHorizIcon />
              </IconButton>
            )}
          </Box>
          <Divider />
        </Box>
      </Hidden>
      {renderMenu}
      {renderDeleteProject}
      {renderDeleteGroupProject}
    </Box>
  )
}

CardProject.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.bool,
  userId: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  setLoading: PropTypes.func.isRequired,
  handleQuery: PropTypes.func,
  actionType: PropTypes.string,
  userType: PropTypes.string.isRequired,
}

CardProject.defaultProps = {
  loading: false,
  handleQuery: () => {},
  actionType: 'edit',
}

export default CardProject
