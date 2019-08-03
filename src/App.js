import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Home from './pages/Home'
import City from './pages/City'
import Map from './pages/Map'
import NotFound from './pages/404'
class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          {/* 配置路由的规则 */}
          {/* Redirect如果配置了from属性，必须放到Switch中 */}
          <Redirect exact from="/" to="/home" />
          <Route path="/home" component={Home} />
          <Route path="/city" component={City} />
          <Route path="/map" component={Map} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    )
  }
}

export default App
