import React from 'react'
import { makeStyles } from '@mui/styles'
import CircularProgress from '@mui/material/CircularProgress'

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#eaeff1',
  },
}))

export default function CircularIndeterminate() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  )
}
