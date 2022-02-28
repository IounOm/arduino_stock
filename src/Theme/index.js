import { createTheme } from '@mui/material/styles'

import typography from './typography'
import palette from './palette'
import breakpoints from './breakpoints'

const theme = createTheme({
  // html: {
  //   height: '100%',
  // },
  // shape: {
  //   borderRadius: 8,
  //   color: '#61dafb',
  // },
  palette,
  typography,
  breakpoints,
})

export default theme
