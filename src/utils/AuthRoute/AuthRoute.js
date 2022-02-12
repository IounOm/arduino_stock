import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import {
  useSelector,
} from 'react-redux'
import { getUser } from '../../redux/selectors/user.selector'
import Loading from '../../components/Loading'

import { AuthContext } from '../../components/Auth'

function AuthRoute(props) {
  const {
    component: Component,
    loginRequired,
    layout: Layout,
  } = props

  const { currentUser } = useContext(AuthContext)
  const user = useSelector(getUser)

  let output = ''

  if (user.loading) {
    output = <Loading />
  } else if (user.isLogin) {
    output = <Layout><Component {...props} /></Layout>
  } else if (!user.isLogin && loginRequired) {
    output = <Redirect to="/login" />
  } else if (user.isLogin && !loginRequired) {
    output = <Redirect to="/" />
  } else if ((user.isLogin && loginRequired) || (!user.isLogin && !loginRequired)) {
    output = <Layout><Component {...props} /></Layout>
  }

  // if (user.loading) {
  //   output = <Loading />
  //   // output = <Layout><Component {...props} /></Layout>
  // } else if (!user.isLogin && loginRequired) {
  //   output = <Redirect to="/login" />
  // } else if (user.isLogin && !loginRequired) {
  //   output = <Redirect to="/" />
  // } else if ((user.isLogin && loginRequired) || (!user.isLogin && !loginRequired)) {
  //   output = <Layout><Component {...props} /></Layout>
  // }

  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <Route
      render={() => (
        output
      )}
    />
  )
}

AuthRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  loginRequired: PropTypes.bool,
  layout: PropTypes.func.isRequired,
}

AuthRoute.defaultProps = {
  loginRequired: false,
}

export default AuthRoute
