import React, { Component } from 'react'

import styles from './index.module.scss'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// 所有房屋配置项
const HOUSE_PACKAGE = [
  {
    id: 1,
    name: '衣柜',
    icon: 'icon-wardrobe'
  },
  {
    id: 2,
    name: '洗衣机',
    icon: 'icon-wash'
  },
  {
    id: 3,
    name: '空调',
    icon: 'icon-air'
  },
  {
    id: 4,
    name: '天然气',
    icon: 'icon-gas'
  },
  {
    id: 5,
    name: '冰箱',
    icon: 'icon-ref'
  },
  {
    id: 6,
    name: '暖气',
    icon: 'icon-Heat'
  },
  {
    id: 7,
    name: '电视',
    icon: 'icon-vid'
  },
  {
    id: 8,
    name: '热水器',
    icon: 'icon-heater'
  },
  {
    id: 9,
    name: '宽带',
    icon: 'icon-broadband'
  },
  {
    id: 10,
    name: '沙发',
    icon: 'icon-sofa'
  }
]

class HousePackage extends Component {
  state = {
    // 用于存储点击过的房屋配套
    values: []
  }
  static propTypes = {
    // 如果是展示房屋配套，就需要传入一个数组  ['空调', '洗衣机']
    list: PropTypes.array,
    // 如果是选择房屋配套，就需要传入一个函数  values => {}
    onSelect: PropTypes.func
  }

  handleClick(name) {
    // 判断点击的item在value中是否存在，如果存在，需要删除
    // 如果不存在，需要添加
    const { values } = this.state
    let newValues
    if (values.includes(name)) {
      // 有
      newValues = values.filter(item => item !== name)
    } else {
      // 没有
      newValues = [...values, name]
    }

    this.setState({
      values: newValues
    })

    // 还需要把值传递给父组件
    this.props.onSelect(newValues)
  }
  render() {
    const { list, onSelect } = this.props
    // 传递了onSelect属性，表示展示所有的房屋配套
    let data = []
    if (onSelect) {
      data = HOUSE_PACKAGE
    } else if (list) {
      // 没有传递onSelect, 传递list，展示list相关的房屋配套
      data = HOUSE_PACKAGE.filter(v => list.includes(v.name))
    }

    return (
      <ul className={styles['house-package']}>
        {data.map(item => (
          <li
            key={item.id}
            className={classnames('item', {
              active: this.state.values.includes(item.name)
            })}
            onClick={onSelect && this.handleClick.bind(this, item.name)}
          >
            <p>
              <i className={`iconfont icon ${item.icon}`} />
            </p>
            {item.name}
          </li>
        ))}
      </ul>
    )
  }
}

export default HousePackage
