import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from 'common/NavHeader'

import styles from './index.module.scss'
import { API, setToken } from 'utils'

import * as Yup from 'yup'

// 1. 安装formik  yarn add formik
// 2. 导入formik  withFormik(高阶组件HOC)    Formik(render-props)
import { withFormik, Form, Field, ErrorMessage } from 'formik'

class Login extends Component {
  render() {
    // console.log(this.props)
    // errors；接收到高阶组件传递过来的错误信息
    // const { values, handleChange, errors, touched, handleBlur } = this.props
    return (
      <div className={styles.login}>
        {/* 顶部导航 */}
        <NavHeader className="navHeader">账号登录</NavHeader>
        {/* 上下留白 */}
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          {/* Submit事件只有在表单提交的时候才会触发 */}
          <Form>
            <div className="formItem">
              <Field
                className="input"
                name="username"
                placeholder="请输入账号"
              />
            </div>
            <ErrorMessage name="username" component="div" className="error" />
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* {touched.username && errors.username && (
              <div className="error">{errors.username}</div>
            )} */}
            <div className="formItem">
              <Field
                className="input"
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage name="password" component="div" className="error" />
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* {touched.password && errors.password && (
              <div className="error">{errors.password}</div>
            )} */}
            <div className="formSubmit">
              <button className="submit" type="submit">
                登 录
              </button>
            </div>
          </Form>
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

// withFormik高阶组件的配置
const config = {
  // 可更新的表单状态， 组件 props.values获取到这个值
  mapPropsToValues: () => ({ username: '', password: '' }),
  // 表单提交处理程序
  handleSubmit: async (values, formikBag) => {
    console.log(values, formikBag)
    // 发送ajax请求
    const { username, password } = values

    const res = await API.post('user/login', { username, password })
    // console.log(res)
    const { status, description, body } = res
    if (status === 200) {
      // 成功了
      // 1. 先把token存储起来
      Toast.info(description, 1)
      setToken(body.token)

      // 2. 页面要跳回到上一个页面
      const { state } = formikBag.props.location
      if (state) {
        // state中有值
        // push:给历史记录中增加一条记录
        // replace: 替换掉当前的历史记录
        formikBag.props.history.replace(state.from.pathname)
      } else {
        formikBag.props.history.go(-1)
      }
    } else {
      // 失败了
      Toast.info(description, 1)
    }
  },
  // 创建yup的校验规则
  // shape:校验规则的样式
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('用户名是必填的')
      .matches(
        /^[a-zA-Z][a-zA-Z0-9_]{4,7}$/,
        '用户名长度为5到8位，只能出现数字、字母、下划线'
      ),
    password: Yup.string()
      .required('密码是必填的')
      .matches(
        /^[a-zA-Z0-9_]{5,12}$/,
        '密码必须是5-12位，由数字，字母，下划线组成,不能以数字开头'
      )
  })

  // 给表单提供校验功能
  // validate: values => {
  //   const errors = {}
  //   if (!values.username) {
  //     errors.username = '用户名不能为空'
  //   }
  //   if (values.username.length > 8 || values.username.length < 5) {
  //     errors.username = '用户名长度是5-8位'
  //   }

  //   return errors
  // }
}
export default withFormik(config)(Login)
