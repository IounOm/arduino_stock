import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { AuthProvider } from './components/Auth'

import Home from './pages/Home'
import Dashboard from './components/DashBoard'
import Login from './components/Login'
import SignUp from './components/SignUp'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App
