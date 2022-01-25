import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import Loading from '../../components/Loading'

import { AuthContext } from '../../components/Auth'

function AuthRoute(props) {
  const {
    component: Component,
    loginRequired,
    layout: Layout,
  } = props

  const { currentUser } = useContext(AuthContext)

  let output = ''

  if (currentUser) {
    output = <Layout><Component {...props} /></Layout>
  } else if (!currentUser && loginRequired) {
    output = <Redirect to="/login" />
  } else if (currentUser && !loginRequired) {
    output = <Redirect to="/" />
  } else if ((currentUser && loginRequired) || (!currentUser && !loginRequired)) {
    output = <Layout><Component {...props} /></Layout>
  }

  // if (currentUser) {
  //   output = <Loading />
  // } else if (!currentUser && loginRequired) {
  //   output = <Redirect to="/login" />
  // } else if (currentUser && !loginRequired) {
  //   output = <Redirect to="/" />
  // } else if ((currentUser && loginRequired) || (!currentUser && !loginRequired)) {
  //   output = <Layout><Component {...props} /></Layout>
  // }

  useEffect(() => {
    console.log(currentUser)
  }, [currentUser])

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
