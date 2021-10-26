import './App.css'
import Button from '@mui/material/Button'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom'
import logo from './logo.svg'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          {' '}
          <code>src/App.js</code>
          {' '}
          and save to reload.
        </p>
        <Route path="/about">
          <About />
        </Route>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Button>Primary</Button>
        <Button>1111111</Button>
      </header>
    </div>
  )
}

function About() {
  return <h2>About</h2>
}

export default App
