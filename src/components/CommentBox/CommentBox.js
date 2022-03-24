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
import _lowerCase from 'lodash/lowerCase'
import _isEmpty from 'lodash/isEmpty'

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
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

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

import firebase from '../../config'

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: '8px !important',
  },
}))

function CommentBox(props) {
  const {
    values, loading,
  } = props
  const classes = useStyles()
  const history = useHistory()
  const db = firebase.firestore()

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Avatar
            alt=""
            src=""
            sx={{ width: 36, height: 36 }}
          />
          <Box ml={2}>
            <Typography variant="body2">
              Ioun Nirach
            </Typography>
            <Typography variant="body2" color="secondary" fontWeight="normal">
              16 Jan 2022
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={[]} size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

CommentBox.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.bool,
}

CommentBox.defaultProps = {
  loading: false,
}

export default CommentBox
