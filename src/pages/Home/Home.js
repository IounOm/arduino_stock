import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { useSelector, useDispatch } from 'react-redux'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _ceil from 'lodash/ceil'
import _parseInt from 'lodash/parseInt'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Pagination from '@mui/material/Pagination'

import { getUser } from '../../redux/selectors/user.selector'
import CardProject from '../../components/CardProject/CardProject'
import { AuthContext } from '../../components/Auth'
import firebase from '../../config'

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
    flexDirection: 'column',
    backgroundColor: '#F8FFFF',
    minHeight: 'calc(100vh - 182px)',
    marginTop: '64px',
    padding: '40px 12%',
    [theme.breakpoints.down('lg')]: {
      padding: '40px 10%',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '16px 16px 16px 16px',
      height: 'auto',
      marginTop: '56px',
      minHeight: 'calc(100vh - 123px)',
    },
  },
  pageination: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '16px',
    },
  },
  ListTag: {
    // use display: 'flex' && not use justifyContent: 'center' for complete scrolling
    overflow: 'auto',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      display: 'flex', // use it for scrolling completely
    },
    // Width: '100vh',
    // direction: 'rtl',
    // 'overflow-x': 'scroll',
  },
}))

function Home(props) {
  const { currentUser } = useContext(AuthContext)
  const path = _get(props, 'computedMatch.params')
  const { searchType, searchId, pageId } = path
  const pathPageId = _parseInt(pageId)
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const myUser = useSelector(getUser)
  const {
    userName,
    userEmail,
    userPassword,
    userImage,
    userNote,
    userContact,
    userId,
  } = myUser
  const db = firebase.firestore()

  const tagList = [
    { name: 'All' },
    { name: 'Entertainment' },
    { name: 'Instrument' },
    { name: 'Iot' },
    { name: 'Machine' },
    { name: 'Other' },
  ]

  const [loading, setLoading] = useState(false)
  const [tagData, setTagData] = useState(tagList)
  const [projectData, setProjectData] = useState([])
  const [filterProjectData, setFilterProjectData] = useState([])
  const [searchData, setSearchData] = useState([])

  const [currentPage, setCurrentPage] = useState(_parseInt(pathPageId) || 1)
  const [projectPerPage, setProjectPerPage] = useState(30) // num of project in 1 page

  const indexOfLastProject = currentPage * projectPerPage
  const indexOfFirstProject = indexOfLastProject - projectPerPage
  const currentProject = filterProjectData.slice(indexOfFirstProject, indexOfLastProject)
  const numOfProject = filterProjectData.length // num of all project
  // console.log('numOfProject', numOfProject)
  // console.log('projectData', projectData)
  const totalPage = _ceil(numOfProject / projectPerPage) // number of all page

  // console.log('filterProjectData', filterProjectData)

  const handleChangePage = (event, value) => {
    console.log('valueaaaa', value)
    if (value !== pathPageId) {
      setCurrentPage(value)
      if (searchType && searchId) {
        history.push(`/home/${searchType}/${searchId}/page/${value}`)
      } else {
        history.push(`/home/page/${value}`)
      }
    }
  }

  console.log('currentPage', currentPage)

  const handleQuery = async () => {
    try {
      setLoading(true)
      const output = []
      if (!searchType && !searchId) {
        const getProject = await db.collection('project')
          .where('publish', '==', true)
          // .orderBy('createAt', 'desc')
          .get()
        if (_isEmpty(getProject.docs)) {
          setProjectData([])
        } else {
          getProject.docs.forEach((doc) => {
            doc.data().uidRef.get().then((res) => {
              output.push({
                id: doc.id,
                ...doc.data(),
                uidRef: res.data(),
              })
              setProjectData([...output])
            })
          })
        }
      } else if (searchType === 'tag') {
        const getProject = await db.collection('project')
          .where('publish', '==', true)
          .where('tag', '==', searchId)
          // .orderBy('createAt', 'desc')
          .get()
        if (_isEmpty(getProject.docs)) {
          setProjectData([])
        } else {
          // console.log('getProject', getProject.docs)
          getProject.docs.forEach((doc) => {
            doc.data().uidRef.get().then((res) => {
              output.push({
                id: doc.id,
                ...doc.data(),
                uidRef: res.data(),
              })
              setProjectData([...output])
            })
          })
        }
      } else if (searchType === 'search') {
        const getSearch = await db.collection('project')
          .where('publish', '==', true)
          // .orderBy('createAt', 'desc')
          .get()
        getSearch.docs.forEach((doc) => {
          doc.data().uidRef.get().then((res) => {
            output.push({
              id: doc.id,
              ...doc.data(),
              uidRef: res.data(),
            })
            setSearchData([...output])
          })
        })
      } else {
        history.push('/404')
      }
      setLoading(false)
    } catch (err) {
      console.log(err)
      history.push('/404')
    }
  }

  useEffect(() => {
    handleQuery()
    setCurrentPage(pageId || 1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, pageId])
  console.log('path', path)

  useEffect(() => {
    if (!_isEmpty(searchId) && searchType === 'search') {
      setProjectData(
        searchData.filter(
          (project) => project.title.toLowerCase().includes(searchId.toLowerCase())
            || project.subtitle.toLowerCase().includes(searchId.toLowerCase())
            || project.uidRef.name.toLowerCase().includes(searchId.toLowerCase())
            || project.tag.toLowerCase().includes(searchId.toLowerCase()),
        ),
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData, searchId])

  useEffect(() => {
    setFilterProjectData(
      projectData.sort((a, b) => b.createAt.seconds - a.createAt.seconds),
    )
  }, [projectData])

  return (
    <Box className={classes.box}>
      <Box className={classes.ListTag}>
        <Box display="flex" alignItems="center" justifyContent="center">
          {_map(tagData, (data) => (
            <Box ml={1} mr={1} pb={1}>
              <Chip
                label={data.name}
                onClick={data.name === 'All' ? () => history.push('/home') : () => history.push(`/home/tag/${data.name}`)}
                variant={searchId === data.name || (data.name === 'All' && !searchType) ? 'contained' : 'outlined'}
                color="primary"
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }} mt={4}>
        <Grid container spacing={2} className={classes.gridProject}>
          {_map(currentProject, (data) => (
            <>
              <Grid item lg={4} md={6} sm={12} sx={{ flexGrow: 1 }}>
                <CardProject
                  values={data}
                  loading={loading}
                  userId={userId}
                  groupId="null"
                  setLoading={setLoading}
                  handleQuery={handleQuery}
                  actionType="view"
                />
              </Grid>
            </>
          ))}
        </Grid>
        {_isEmpty(currentProject) && !loading && (
          <Box sx={{ height: '150px' }} display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h4" color="primary">
              Do not have any project in this page
            </Typography>
          </Box>
        )}
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" mt={4} className={classes.pageination}>
        <Pagination
          count={_parseInt(totalPage)}
          page={_parseInt(currentPage)}
          defaultPage={_parseInt(pathPageId)}
          variant="outlined"
          shape="rounded"
          onChange={handleChangePage}
        />
      </Box>
    </Box>
  )
}

export default Home
