import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'

function RichText() {
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

  return (
    <Box>
      <CKEditor
        editor={Editor}
        config={editorConfiguration}
        data="<p>Hello from CKEditor 5!</p>"
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
      />
    </Box>
  )
}

export default RichText
