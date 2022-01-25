import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import firebaseConfig from '../config'
import Loading from './Loading'
import Header from './Header'

export const AuthContext = React.createContext()

export function AuthProvider(props) {
  const { children } = props
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    firebaseConfig.auth().onAuthStateChanged((user) => {
      setCurrentUser(user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
