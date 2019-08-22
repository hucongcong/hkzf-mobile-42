import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import styles from './index.module.scss'
import { API, getCurrentCity } from 'utils'
import _ from 'lodash'

export default class Search extends Component {
  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  handleClick(item) {
    // 跳转路由到 /rent/add
    this.props.history.replace('/rent/add', {
      community: {
        id: item.community,
        name: item.communityName
      }
    })
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li
        key={item.community}
        className="tip"
        onClick={this.handleClick.bind(this, item)}
      >
        {item.communityName}
      </li>
    ))
  }

  searchCommunity = _.debounce(async (value, id) => {
    // 发送ajax请求
    const res = await API.get('area/community', {
      params: {
        // 当前搜索的小区的关键字
        name: value,
        // 当前城市的id
        id: id
      }
    })
    if (res.status === 200) {
      this.setState({
        tipsList: res.body
      })
    }
    console.log(res)
  }, 1000)

  // setTimeout
  handleChange = async value => {
    this.setState({
      searchTxt: value
    })
    const { value: id } = await getCurrentCity()
    this.searchCommunity(value, id)
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles['rent-search']}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handleChange}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className="tips">{this.renderTips()}</ul>
      </div>
    )
  }
}
