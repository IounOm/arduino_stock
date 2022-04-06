/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'

import * as userAction from '../../redux/actions/user.action'
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
    collection, doc, updateKey, defaultImg, alt, loading, width, height, page, disabled, error,
  } = props
  const myUser = useSelector(getUser)
  const {
    userName,
    userEmail,
    userPassword,
    userImage,
    userNote,
    userContact,
    userId,
    userType,
  } = myUser
  const classes = useStyles()
  const dispatch = useDispatch()
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
    fileReader.readAsDataURL(userImages)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userImages])

  useEffect(() => {
    setImageURLs(defaultImg)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, defaultImg])

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
      const date = new Date().getTime()
      const uploadTask = storage.ref(`${collection}/${doc}/${userImages.name}.${date}`).put(userImages)
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
          storage.ref(`${collection}/${doc}`).child(userImages.name).getDownloadURL().then((imgUrl) => {
            if (page === 'createProject') {
              dispatch(userAction.uploadImage(imgUrl))
            } else {
              db.collection(collection).doc(doc).update({
                [updateKey]: imgUrl,
              })
              dispatch(userAction.uploadImage(imgUrl))
            }
          })
        },
      )
      if (page === 'profile') {
        dispatch(userAction.updateUserData(userName, userEmail, userPassword, imageURLs, userNote, userContact, userType))
      }
    } catch (err) {
      console.log(err)
    }
    setEditImage(false)
  }

  const onImageChange = (e) => {
    if (e.target.files.length < 1) return
    setUserImages(e.target.files[0])
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {!editImage && !loading ? (
        <>
          <Avatar
            alt={alt}
            src={imageURLs}
            className={classes.Image}
            sx={{
              width: `${width}`,
              height: `${height}`,
              fontSize: '80px',
              border: `${error ? '2px solid red' : '0px'}`,
            }}
            variant="rounded"
          />
          {!disabled && (
            <Box mt={2}>
              <Button onClick={handleClickImageEdit}>Change Picture</Button>
            </Box>
          )}
        </>
      ) : (
        <>
          <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" type="file" onChange={(e) => onImageChange(e)} />
            <Avatar
              alt={alt}
              src={imageURLs}
              sx={{
                width: `${width}`,
                height: `${height}`,
                fontSize: '80px',
                border: `${error ? '2px solid red' : '0px'}`,
              }}
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
  page: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
}

UploadImage.defaultProps = {
  loading: false,
  disabled: false,
  error: false,
}

export default UploadImage
