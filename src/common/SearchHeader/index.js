import React from 'react'
import { Flex } from 'antd-mobile'
import styles from './index.module.scss'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import classnames from 'classnames'
class SearchHeader extends React.Component {
  static propTypes = {
    cityName: PropTypes.string.isRequired,
    className: PropTypes.string
  }
  render() {
    // console.log(this.props)
    // console.log(this.props.className)
    // 需要把外部组件传入的类名也添加到组件的根元素上
    return (
      <Flex className={classnames(this.props.className, styles['search-box'])}>
        <Flex className="search-form">
          <div
            className="location"
            onClick={() => this.props.history.push('/city')}
          >
            <span className="name">{this.props.cityName}</span>
            <i className="iconfont icon-arrow"> </i>
          </div>
          <div
            className="search-input"
            onClick={() => this.props.history.push('/search')}
          >
            <i className="iconfont icon-seach" />
            <span className="text">请输入小区地址</span>
          </div>
        </Flex>
        {/* 地图小图标 */}
        <i
          className="iconfont icon-map"
          onClick={() => this.props.history.push('/map')}
        />
      </Flex>
    )
  }
}

export default withRouter(SearchHeader)
