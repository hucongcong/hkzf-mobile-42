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
import Detail from 'pages/Detail'
import Login from 'pages/Login'
import AuthRoute from 'common/AuthRoute'
import Rent from 'pages/Rent'
import RentAdd from 'pages/Rent/Add'
import RentSearch from 'pages/Rent/Search'

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
          <Route path="/detail/:id" component={Detail} />
          <Route path="/login" component={Login} />

          {/* 登录才能访问 */}
          {/* 显示房源列表信息 */}
          <AuthRoute path="/rent" exact component={Rent} />
          <AuthRoute path="/rent/add" component={RentAdd} />
          <AuthRoute path="/rent/search" component={RentSearch} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    )
  }
}

export default App
