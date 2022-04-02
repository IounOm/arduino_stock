import React, { useState, useContext, useEffect } from 'react'
import { Redirect, Link, useHistory } from 'react-router-dom'
// import { createTheme } from '@mui/material/styles'
// import createBreakpoints from '@material-ui/core/styles/createBreakpoints'
import { makeStyles } from '@mui/styles'
// import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'

import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _forEach from 'lodash/forEach'
import _filter from 'lodash/filter'
import _differenceBy from 'lodash/differenceBy'
import _lowerCase from 'lodash/lowerCase'
import _capitalize from 'lodash/capitalize'
import _toInteger from 'lodash/toInteger'
import _ceil from 'lodash/ceil'
import _parseInt from 'lodash/parseInt'
import _orderBy from 'lodash/orderBy'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
// import Link from '@mui/material/Link'
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
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Paper from '@mui/material/Paper'
import Badge from '@mui/material/Badge'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Pagination from '@mui/material/Pagination'

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import GitHubIcon from '@mui/icons-material/GitHub'
import LanguageIcon from '@mui/icons-material/Language'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import AddIcon from '@mui/icons-material/Add'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddBoxIcon from '@mui/icons-material/AddBox'
import PeopleIcon from '@mui/icons-material/People'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import InfoIcon from '@mui/icons-material/Info'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import { getUser } from '../../redux/selectors/user.selector'
import Header from '../../components/Header/Header'
import UploadImage from '../../components/UploadImage/UploadImage'
import CardProject from '../../components/CardProject/CardProject'
import Loading from '../../components/Loading'
import { AuthContext } from '../../components/Auth'
import * as userAction from '../../redux/actions/user.action'
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
    // alignItems: 'center',
    // justifyContent: 'center',
    // height: 'calc(100vh - 72px)',
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
  // const [tagSelect, setTagSelect] = useState('')
  const [projectData, setProjectData] = useState([])
  const [filterProjectData, setFilterProjectData] = useState([])
  const [searchData, setSearchData] = useState([])
  // const [filterSearch, setFilterSearch] = useState([])

  const [currentPage, setCurrentPage] = useState(_parseInt(pathPageId) || 1)
  const [projectPerPage, setProjectPerPage] = useState(30) // num of project in 1 page

  const indexOfLastProject = currentPage * projectPerPage
  const indexOfFirstProject = indexOfLastProject - projectPerPage
  const currentProject = filterProjectData.slice(indexOfFirstProject, indexOfLastProject)
  const numOfProject = filterProjectData.length // num of all project
  console.log('numOfProject', numOfProject)
  console.log('projectData', projectData)
  const totalPage = _ceil(numOfProject / projectPerPage) // number of all page

  console.log('filterProjectData', filterProjectData)

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
          console.log('getProject', getProject.docs)
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
      }
      // else {
      //   history.push('/404')
      // }
      setLoading(false)
    } catch (err) {
      console.log(err)
      history.push('/404')
    }
  }
  console.log('searchData', searchData)

  // const handleSearch = async () => {
  //   try {
  //     setLoading(true)
  //     const output = []
  //     if (!searchType && !searchId) {
  //       const getSearch = await db.collection('project')
  //         .where('publish', '==', true)
  //       // .orderBy('updateAt', 'desc')
  //         .get()
  //       getSearch.docs.forEach((doc) => {
  //         doc.data().uidRef.get().then((res) => {
  //           output.push({
  //             id: doc.id,
  //             ...doc.data(),
  //             uidRef: res.data(),
  //           })
  //           setSearchData([...output])
  //         })
  //       })
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

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
            || project.uidRef.name.toLowerCase().includes(searchId.toLowerCase()),
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
