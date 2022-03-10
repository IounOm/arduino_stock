/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable prefer-promise-reject-errors */
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'

import firebase from '../../config'

function RichText(props) {
  const {
    disabled, handleOnChange, value, userId,
  } = props
  const editorConfiguration = {
    toolbar: {
      items: [
        'bold',
        'italic',
        'link',
        'code',
        '|',
        'fontSize',
      ],
    },
    language: 'en',
    blockToolbar: [
      'heading',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'imageUpload',
      'blockQuote',
      'horizontalLine',
      'codeBlock',
      '|',
      'imageInsert',
      'mediaEmbed',
    ],
    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        '|',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'linkImage',
      ],
    },
    ckfinder: {
      // Upload the images to the server using the CKFinder QuickUpload command.
      // uploadUrl: 'https://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json',
      uploadUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
    },
  }
  const storage = firebase.storage()

  class MyUploadAdapter {
    constructor(loader) {
      this.loader = loader
    }

    // Starts the upload process.
    upload() {
      // const uploadTask = storage.ref(`${collection}/${userImages.name}`).put(userImages)
      return this.loader.file.then(
        (file) => new Promise((resolve, reject) => {
          // const storage = firebase.storage().ref()
          // const uploadTask = storage
          //   .child(file.name)
          //   .put(file, metadata)
          const uploadTask = storage.ref(`project/${userId}/${file.name}`).put(file)
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log(`Upload is ${progress}% done`)
              // switch (snapshot.state) {
              //   case 'paused': // or 'paused'
              //     console.log('Upload is paused')
              //     break
              //   case 'running': // or 'running'
              //     console.log('Upload is running')
              //     break
              // }
            },
            (error) => {
              console.log(error)
              // switch (error.code) {
              //   case 'storage/unauthorized':
              //     reject(" User doesn't have permission to access the object")
              //     break

              //   case 'storage/canceled':
              //     reject('User canceled the upload')
              //     break

              //   case 'storage/unknown':
              //     reject(
              //       'Unknown error occurred, inspect error.serverResponse',
              //     )
              //     break
              // }
            },
            () => {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then((downloadURL) => {
                  console.log('File available at', downloadURL)
                  resolve({
                    default: downloadURL,
                  })
                })
            },
          )
        }),
      )
    }
  }

  return (
    <Box>
      {/* <CKEditor
        editor={Editor}
        config={editorConfiguration}
        data=""
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log('Editor is ready to use!', editor)
        }}
        onChange={(event, editor) => {
          const data = editor.getData()
          console.log({ event, editor, data })
        }}
        onBlur={(event, editor) => {
          console.log('Blur.', editor)
        }}
        onFocus={(event, editor) => {
          console.log('Focus.', editor)
        }}
        disabled={false}
      /> */}
      <CKEditor
        editor={Editor}
        disabled={disabled}
        config={editorConfiguration}
        data={value}
        onReady={(editor) => {
          editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new MyUploadAdapter(loader)
        }}
        onChange={(event, editor) => {
          const data = editor.getData()
          handleOnChange(data)
          // console.log({ event, editor, data })
        }}
        // onBlur={(event, editor) => {
        //   console.log('Blur.', editor)
        // }}
        // onFocus={(event, editor) => {
        //   console.log('Focus.', editor)
        // }}
      />
    </Box>
  )
}

RichText.propTypes = {
  disabled: PropTypes.bool,
  handleOnChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
  userId: PropTypes.string.isRequired,
}

RichText.defaultProps = {
  value: '',
  handleOnChange: () => {},
  disabled: false,
}

export default RichText
