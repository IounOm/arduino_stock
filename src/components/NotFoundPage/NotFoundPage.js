import React from 'react'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
// import Lottie from 'react-lottie'
import { useHistory } from 'react-router-dom'
// import animationData from './404.json'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    minHeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1B1A1A',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}))

function NotFoundPage() {
  const classes = useStyles()
  const history = useHistory()

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData,
  // }

  const handleClick = () => {
    history.goBack()
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.inner}>
        {/* <Lottie
          options={defaultOptions}
          height={400}
          width="100%"
        /> */}
        <Typography fontSize={200} fontWeight="bold" lineHeight={0.8} color="#DE3535">404</Typography>
        <Typography fontSize={50} color="#DE3535">Page not found</Typography>
        <Box mt={3}>
          <Button variant="outlined" size="medium" onClick={handleClick} color="button">
            back to previous page
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default NotFoundPage
