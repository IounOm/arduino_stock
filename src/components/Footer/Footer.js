import React from 'react'
import { useLocation } from 'react-router-dom'

import _split from 'lodash/split'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

function Header() {
  const location = useLocation()
  const { pathname } = location

  const projectId = _split(pathname, '/', 4)
  const pId = projectId[projectId.length - 1]

  const groupId = _split(pathname, '/', 3)
  const groupProjectId = _split(pathname, '/', 6)
  const gId = projectId[groupId.length - 1]
  const gpId = groupProjectId[groupProjectId.length - 1]

  return (
    <>
      {(pathname === '/project/create' || pathname === `/project/edit/${pId}` || pathname === `/group-project/${gId}/project/edit/${gpId}` || pathname === '/404') ? (
        <>
        </>
      ) : (
        <Box sx={{ backgroundColor: '#616569' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Typography variant="body2" color="#fff">
                  Copyright© 2022 Arduino Stock
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  )
}

export default Header
