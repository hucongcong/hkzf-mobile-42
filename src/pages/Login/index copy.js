import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from 'common/NavHeader'

import styles from './index.module.scss'
import { API, setToken } from 'utils'
import { withFormik } from 'formik'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

// handleSubmit = async e => {
// e.preventDefault()
// // 发送ajax请求
// const { username, password } = this.state

// const res = await API.post('user/login', { username, password })
// console.log(res)
// const { status, description, body } = res
// if (status === 200) {
//   // 成功了
//   // 1. 先把token存储起来
//   Toast.info(description, 1)
//   setToken(body.token)
//   // 2. 页面要跳回到上一个页面
//   this.props.history.go(-1)
// } else {
//   // 失败了
//   Toast.info(description, 1)
// }
//   }
class Login extends Component {
  render() {
    const { values, handleChange, handleSubmit } = this.props
    return (
      <div className={styles.login}>
        {/* 顶部导航 */}
        <NavHeader className="navHeader">账号登录</NavHeader>
        {/* 上下留白 */}
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          {/* Submit事件只有在表单提交的时候才会触发 */}
          <form onSubmit={handleSubmit}>
            <div className="formItem">
              <input
                className="input"
                name="username"
                placeholder="请输入账号"
                value={values.username}
                onChange={handleChange}
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className="error">账号为必填项</div> */}
            <div className="formItem">
              <input
                className="input"
                name="password"
                type="password"
                placeholder="请输入密码"
                value={values.password}
                onChange={handleChange}
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className="error">账号为必填项</div> */}
            <div className="formSubmit">
              <button className="submit" type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className="backHome">
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// withFormik是一个高阶组件，需要使用withFormik包裹需要增强的组件。

// 第一次调用：传入一个配置参数
// 第二次调用：传入需要包装的组件， 返回增强后的组件
// withFormik(config)(BASE)
// withFormik的配置参数
Login = withFormik({
  // 这个参数是一个对象，这个对象用于给包裹的组件提供数据的
  mapPropsToValues: () => ({ username: '', password: '' }),
  // 表单提交的逻辑，将来会传递给包装的组件
  handleSubmit: async (values, { props }) => {
    // 发送ajax请求
    const { username, password } = values
    console.log(props)
    const res = await API.post('user/login', { username, password })
    console.log(res)
    const { status, description, body } = res
    if (status === 200) {
      // 成功了
      // 1. 先把token存储起来
      Toast.info(description, 1)
      setToken(body.token)
      // 2. 页面要跳回到上一个页面
      props.history.go(-1)
    } else {
      // 失败了
      Toast.info(description, 1)
    }
  }
})(Login)
export default Login
