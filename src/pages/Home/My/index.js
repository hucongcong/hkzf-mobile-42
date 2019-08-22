import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Modal } from 'antd-mobile'

import { BASE_URL, hasToken, API, removeToken } from 'utils'

import styles from './index.module.scss'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

export default class My extends Component {
  state = {
    userInfo: {},
    isLogin: hasToken()
  }

  async getUserInfo() {
    const res = await API.get('user')
    if (res.status === 200) {
      this.setState({
        userInfo: res.body
      })
      console.log(res.body)
    } else if (res.status === 400) {
      // 请求失败，  token过期  token无效
      this.setState({
        isLogin: false
      })
    }
  }

  componentDidMount() {
    const { isLogin } = this.state
    // 判断是否登录
    if (isLogin) {
      // 登录了, 发送ajax请求，获取用户信息
      this.getUserInfo()
    }
  }

  logout = () => {
    // 给一个提示框
    Modal.alert('温馨提示', '你确定要退出吗?', [
      {
        text: '取消'
      },
      {
        text: '确定',
        onPress: async () => {
          console.log('11')
          // 发送请求退出

          await API.post('user/logout')

          console.log('222')
          // 移除token
          removeToken()
          // 重置状态
          this.setState({
            userInfo: {},
            isLogin: false
          })
        }
      }
    ])
  }

  render() {
    const { history } = this.props
    const { isLogin, userInfo } = this.state
    return (
      <div className={styles.my}>
        {/* 个人信息 */}
        <div className="title">
          <img
            className="bg"
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className="info">
            <div className="myIcon">
              <img
                className="avatar"
                src={isLogin ? BASE_URL + userInfo.avatar : DEFAULT_AVATAR}
                alt="icon"
              />
            </div>
            <div className="user">
              <div className="name">{isLogin ? userInfo.nickname : '游客'}</div>
              {/* 登录后展示： */}
              {isLogin ? (
                <>
                  <div className="auth">
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className="edit">
                    编辑个人资料
                    <span className="arrow">
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </>
              ) : (
                <div className="edit">
                  <Button
                    type="primary"
                    size="small"
                    inline
                    onClick={() => history.push('/login')}
                  >
                    去登录
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className="menuItem">
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <div className="menuItem">
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            )
          }
        />

        {/* 加入我们 */}
        <div className="ad">
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
