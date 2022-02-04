import React, { useState, useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { makeStyles } from '@mui/styles'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _get from 'lodash/get'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
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

import Header from '../Header/Header'
import { AuthContext } from '../Auth'
import firebaseConfig from '../../config'

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
    height: 'calc(100vh - 72px)',
    padding: '0 80px 0 80px',
    [theme.breakpoints.down('sm')]: {
      padding: '0 16px 0 16px',
      height: 'auto',
    },
  },
  profile: {
    padding: '24px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: '16px 0 16px 0',
    },
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
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  pageLeft: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  pageRight: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
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

function Profile() {
  const classes = useStyles()
  const { currentUser } = useContext(AuthContext)
  console.log('currentUser', currentUser)
  const [loading, setLoading] = useState(false)
  const [openTagEdit, setOpenTagEdit] = useState(false)
  const [values, setValues] = useState({
    image: '',
    name: '',
    note: '',
    email: '',
    password: '',
    tag: [{ name: 'tag1', note: 'my tag eiei' }],
    showPassword: false,
    errorEmail: false,
    errorPassword: false,
  })

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickTagEdit = () => {
    setOpenTagEdit(true)
  }
  const handleClose = () => {
    setOpenTagEdit(false)
  }

  return (
    <Box className={classes.box}>
      <Box className={classes.paper}>
        <Box className={classes.pageLeft} fullWidth>
          <Box className={classes.profile}>
            <img src="images/user.png" alt="user" width="50" />
            <Typography>
              Allowed image types are jpg,png and gif.
              Uploaded image must be less than 500KB.
              The uploaded image is automatically resized to fit into 300x300 pixels, using a square picture is recommended to avoid stretching.
            </Typography>
          </Box>
          <Box className={classes.profile}>
            <Divider />
            <Typography variant="h4" mt={2}>Account Settings</Typography>
            <TextField
              variant="outlined"
              fullWidth
              label="Email"
              onChange={handleChange('email')}
              value={values.email}
              style={{ marginTop: '16px' }}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Password"
              onChange={handleChange('password')}
              value={values.password}
              style={{ marginTop: '16px' }}
            />
          </Box>
        </Box>
        <Box className={classes.pageRight} fullWidth>
          <Hidden smUp>
            <Divider />
          </Hidden>
          <Box className={classes.profile}>
            <Box className={classes.title}>
              <Typography variant="h4">User Profile</Typography>
              <Button variant="outlined">Edit</Button>
            </Box>
            <Box width="100%" fullWidth>
              <TextField
                variant="outlined"
                fullWidth
                label="Username"
                onChange={handleChange('name')}
                value={values.name}
                style={{ marginTop: '16px' }}
              />
              <TextField
                fullWidth
                label="Say something about yourself"
                multiline
                rows={3}
                defaultValue=""
                style={{ marginTop: '16px' }}
              />
              <Box className={classes.btSave}>
                <Button variant="outlined" color="primary">Cancel</Button>
                <Box className={classes.btn}>
                  <Button variant="contained" color="primary">Save</Button>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className={classes.profile}>
            <Divider />
            <Box className={classes.title} mt={2}>
              <Typography variant="h4">Tag Management</Typography>
              <Button variant="outlined" onClick={handleClickTagEdit}>Add</Button>
            </Box>
            <Box className={classes.tagCard} mt={2}>
              <Grid container spacing={1}>
                {_map(values.tag, (data) => (
                  <Grid item>
                    <Tooltip title={_get(data, 'note')} arrow>
                      <Chip
                        label={_get(data, 'name')}
                        onClick={[]}
                        onDelete={[]}
                      />
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Dialog open={openTagEdit} onClose={handleClose}>
              <DialogTitle>Add Tag</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  create your tag For filtering your project and the tags
                  you added will be searchable on the home page.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Tag Name"
                  // type="email"
                  fullWidth
                  // variant="standard"
                />
                <TextField
                  autoFocus
                  margin="dense"
                  label="Note"
                  // type="email"
                  fullWidth
                  // variant="standard"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Save</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Profile
