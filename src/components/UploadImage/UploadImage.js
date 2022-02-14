/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _forEach from 'lodash/forEach'

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
import Avatar from '@mui/material/Avatar'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'

import { getUser } from '../../redux/selectors/user.selector'
import firebase from '../../config'

const Input = styled('input')({
  display: 'none',
})

const useStyles = makeStyles((theme) => ({
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
}))

function UploadImage(props) {
  const {
    collection, doc, updateKey, defaultImg, alt, loading, width, height,
  } = props
  const classes = useStyles()
  const db = firebase.firestore()
  const storage = firebase.storage()

  const [editImage, setEditImage] = useState(false)
  const [userImages, setUserImages] = useState()
  const [imageURLs, setImageURLs] = useState(defaultImg)

  // TODO edit image
  useEffect(() => {
    if (!userImages) return
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setImageURLs(URL.createObjectURL(userImages))
    }
    console.log('fileReader', fileReader)
    fileReader.readAsDataURL(userImages)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userImages])

  useEffect(() => {
    setImageURLs(defaultImg)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const handleClickImageEdit = () => {
    setEditImage(true)
    setUserImages('')
    setImageURLs('')
  }
  const handleCloseImageEdit = () => {
    setEditImage(false)
    setImageURLs(defaultImg)
  }
  const handleSaveImageEdit = () => {
    try {
      const uploadTask = storage.ref(`${collection}/${userImages.name}`).put(userImages)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
        },
        (err) => {
          console.log(err)
        },
        () => {
          storage.ref(collection).child(userImages.name).getDownloadURL().then((imgUrl) => {
            db.collection(collection).doc(doc).update({
              [updateKey]: imgUrl,
            })
          })
        },
      )
    } catch (err) {
      console.log(err)
    }
    setEditImage(false)
  }

  const onImageChange = (e) => {
    if (e.target.files.length < 1) return
    setUserImages(e.target.files[0])
  }

  console.log('userImages', userImages)
  console.log('imageURLs', imageURLs)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {!editImage && !loading ? (
        <>
          <Avatar
            alt={alt}
            src={imageURLs}
            className={classes.Image}
            sx={{ width: `${width}`, height: `${height}`, fontSize: '80px' }}
            variant="rounded"
          />
          <Box mt={2}>
            <Button onClick={handleClickImageEdit}>Change Profile Picture</Button>
          </Box>
        </>
      ) : (
        <>
          <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" type="file" onChange={(e) => onImageChange(e)} />
            <Avatar
              alt={alt}
              src={imageURLs}
              sx={{ width: `${width}`, height: `${height}`, fontSize: '80px' }}
              variant="rounded"
            />
          </label>
          <Box className={classes.btSave}>
            <Button variant="outlined" color="primary" onClick={handleCloseImageEdit}>Cancel</Button>
            <Box className={classes.btn}>
              <Button variant="contained" color="primary" onClick={handleSaveImageEdit}>Save</Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}

UploadImage.propTypes = {
  collection: PropTypes.string.isRequired,
  doc: PropTypes.string.isRequired,
  updateKey: PropTypes.string.isRequired,
  defaultImg: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  loading: PropTypes.bool,
}

UploadImage.defaultProps = {
  loading: false,
}

export default UploadImage