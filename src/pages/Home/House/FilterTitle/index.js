import React from 'react'
import { Flex } from 'antd-mobile'
import styles from './index.module.scss'
import classnames from 'classnames'
// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]
class FilterTitle extends React.Component {
  render() {
    const { titleSelectedStatus, changeStatus } = this.props
    // console.log(titleSelectedStatus)
    return (
      <Flex align="center" className={styles['filter-title']}>
        {titleList.map(item => {
          // 根据type类型获取到选中的状态
          const isSelected = titleSelectedStatus[item.type]
          return (
            <Flex.Item key={item.title}>
              {/* 选中类名： selected */}
              <span
                className={classnames('dropdown', { selected: isSelected })}
                onClick={() => changeStatus(item.type)}
              >
                <span>{item.title}</span>
                <i className="iconfont icon-arrow" />
              </span>
            </Flex.Item>
          )
        })}
      </Flex>
    )
  }
}
export default FilterTitle
