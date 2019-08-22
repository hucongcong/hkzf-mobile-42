/* 
  AuthRoute: 鉴权的路由，用法要和route一样  
    会判断用户是否登录，如果用户登录了，和正常的Route一样即可
    如果用户没有登录，跳转到登录页面
*/
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { hasToken } from 'utils'
export default function AuthRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        hasToken() ? (
          <Component {...props} />
        ) : (
          // 给重定向要login页面的时候，增加了一个form的属性，from属性中包含了重定向前的路由信息，rent的信息
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  )
}
