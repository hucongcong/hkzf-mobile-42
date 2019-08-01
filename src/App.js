import React from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import Home from './pages/Home'
import City from './pages/City'
import Map from './pages/Map'
class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app">app</div>
        <ul>
          <li>
            <Link to="/home">首页</Link>
          </li>
          <li>
            <Link to="/city">城市选择</Link>
          </li>
          <li>
            <Link to="/map">地图找房</Link>
          </li>
        </ul>

        {/* 配置路由的规则 */}
        <Route path="/home" component={Home} />
        <Route path="/city" component={City} />
        <Route path="/map" component={Map} />
      </Router>
    )
  }
}

export default App
