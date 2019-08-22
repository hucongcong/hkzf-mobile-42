import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import { API } from 'utils'

import NavHeader from 'common/NavHeader'
import HouseItem from 'common/HouseItem'
import NoHouse from 'common/NoHouse'

import styles from './index.module.scss'

export default class Rent extends Component {
  state = {
    // 出租房屋列表
    list: [],
    isLoaded: false
  }

  // 获取已发布房源的列表数据
  async getHouseList() {
    const res = await API.get('user/houses')

    const { status, body } = res
    if (status === 200) {
      this.setState({
        list: body,
        isLoaded: true
      })
    }
  }

  componentDidMount() {
    this.getHouseList()
  }

  renderHouseItem() {
    const { list } = this.state
    return list.map(item => {
      return <HouseItem key={item.houseCode} item={item} />
    })
  }

  renderRentList() {
    const { list } = this.state
    const hasHouses = list.length > 0

    if (!hasHouses) {
      return (
        <NoHouse>
          您还没有房源，
          <Link to="/rent/add" className="link">
            去发布房源
          </Link>
          吧~
        </NoHouse>
      )
    }

    return <div className="houses">{this.renderHouseItem()}</div>
  }

  render() {
    if (!this.state.isLoaded) return null
    return (
      <div className={styles.rent}>
        <NavHeader className="navHeader">房屋管理</NavHeader>

        {this.renderRentList()}
      </div>
    )
  }
}
