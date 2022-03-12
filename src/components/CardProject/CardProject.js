import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { format } from 'date-fns'
import { enGB, th } from 'date-fns/locale'

import _isEqual from 'lodash/isEqual'
import _toInteger from 'lodash/toInteger'
import _get from 'lodash/get'
import _kebabCase from 'lodash/kebabCase'
import _map from 'lodash/map'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CardActionArea from '@mui/material/CardActionArea'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Hidden from '@mui/material/Hidden'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props
//   return <IconButton {...other} />
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }))

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: '8px !important',
  },
}))

function CardProject(props) {
  const {
    values, loading, userId,
  } = props
  const classes = useStyles()
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(false)
  // const [expanded, setExpanded] = useState(false)

  const isMenuOpen = Boolean(anchorEl)

  const userLists = [
    { name: 'Edit', icon: <EditIcon fontSize="small" /> },
    { name: 'Delete', icon: <DeleteIcon fontSize="small" /> },
  ]

  // const handleExpandClick = () => {
  //   setExpanded(!expanded)
  // }
  console.log('values card', values)

  // const formatUpdateAtDate = format(_toInteger(`${_get(values, 'createAt.seconds')}000`), 'dd LLLL yyyy')
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
  const handleClickList = (type, projectId) => {
    if (_kebabCase(type) === 'delete') {
      setAnchorEl(false)
      console.log(`delete project id ${projectId}`)
    } else {
      setAnchorEl(false)
      history.push(`/project/edit/${projectId}`)
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

  return (
    <Box>
      <Hidden lgDown>
        <Card>
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
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
          )}
            className={classes.cardHeader}
            title={values.uidRef.name}
            subheader={formatCreateAtDate}
          />
          <CardActionArea onClick={() => history.push(`/project/view/${values.id}`)}>
            <CardMedia
              component="img"
              height="194"
            // width="100%"
              image={values.image}
              alt="Arduino Project Image"
              // className={classes.cardMedia}
            />
            <CardContent sx={{ height: 80, maxHeight: 80 }}>
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
              label="Entertainment"
              onClick={[]}
            />
            <Chip
              label={values.publish ? 'Publish' : 'Draft'}
              color={values.publish ? 'success' : 'secondary'}
              variant="outlined"
            />
          </CardActions>
        </Card>
      </Hidden>
      {/* {ipad & mobile} */}
      <Hidden lgUp>
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
            <Box mt={1} onClick={() => history.push(`/project/view/${values.id}`)}>
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
              <Chip label={values.tag} size="small" onClick={[]} />
              <Box ml={1} />
              <Chip
                label={values.publish ? 'Publish' : 'Draft'}
                color={values.publish ? 'success' : 'secondary'}
                variant="outlined"
                size="small"
              />
            </Box>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreHorizIcon />
            </IconButton>
          </Box>
          <Divider />
        </Box>
      </Hidden>
      {renderMenu}
    </Box>
  )
}

CardProject.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.bool,
  userId: PropTypes.string.isRequired,
}

CardProject.defaultProps = {
  loading: false,
}

export default CardProject
