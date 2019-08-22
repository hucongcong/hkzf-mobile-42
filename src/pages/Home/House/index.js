import React from 'react'
import SearchHeader from 'common/SearchHeader'
import styles from './index.module.scss'
import { Flex, Toast } from 'antd-mobile'
import Filter from './Filter'
import { getCurrentCity, API } from 'utils'
import Sticky from 'common/Sticky'
import NoHouse from 'common/NoHouse'
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized'
import HouseItem from 'common/HouseItem'

class House extends React.Component {
  // label = '上海'
  // value = ''
  state = {
    filters: {},
    list: [],
    count: 0,
    label: '',
    value: '',
    isLoaded: false
  }
  // 格式化过滤条件
  // 把selectedValues格式化成接口需要的参数格式
  formatFilters(selectedValues) {
    // 格式的处理
    // 将来发送请求需要的参数
    const filters = {}
    // 处理 price
    filters.price = selectedValues.price[0]
    // 处理 rentType
    filters.rentType = selectedValues.mode[0]
    // 处理more
    filters.more = selectedValues.more.join()
    // 处理 area或者subway
    const area = selectedValues.area
    const type = area[0]
    // 这个值可能是第二项，也可能是第三项
    // 如果长度是2， 肯定就是第二项
    // 如果长度是3， 判断第三项是否是'null', 如果是，值就是第二项
    // 如果第三项不是null，值就是第三项
    let value
    if (area.length === 2) {
      value = area[1]
    } else {
      value = area[2] === 'null' ? area[1] : area[2]
    }
    filters[type] = value
    return filters
  }

  // 发送请求，获取房源数据
  async getHouseList(start = 1, end = 30) {
    // 获取city的id
    Toast.loading('加载中...', 0)
    // const { value } = await getCurrentCity()
    const res = await API.get('houses', {
      params: {
        cityId: this.state.value,
        ...this.state.filters,
        start,
        end
      }
    })
    const { list, count } = res.body
    this.setState({
      count,
      list: [...this.state.list, ...list],
      // 数据加载完成
      isLoaded: true
    })
    Toast.hide()
    if (start === 1) {
      Toast.info(`总共找到了${count}套房源`, 1)
    }
  }

  onFilter = selectedValues => {
    const filters = this.formatFilters(selectedValues)
    this.setState(
      {
        filters
      },
      () => {
        // 发送ajax请求
        this.getHouseList()
      }
    )

    window.scrollTo(0, 0)
  }

  async componentDidMount() {
    const { label, value } = await getCurrentCity()
    this.setState(
      {
        label,
        value
      },
      () => {
        // 先把value和label存起来
        this.getHouseList()
      }
    )
  }

  rowRenderer({ key, index, style }) {
    // 控制每一行的渲染内容
    const item = this.state.list[index]
    // console.log(index, item)
    // console.log(index, item)
    // 如果item有值，就去渲染HouseItem, 如果item没有值，渲染一个提示的消息
    if (!item) {
      // item没有值
      return (
        <div key={key} style={style} className="tips">
          <p />
        </div>
      )
    }
    return <HouseItem key={key} item={item} style={style} />
  }

  isRowLoaded({ index }) {
    // 判断list中index是否有对应的数据
    return !!this.state.list[index]
  }

  // 发送ajax请求，获取更多的数据
  loadMoreRows({ startIndex, stopIndex }) {
    // console.log('没有数据了，该发送请求了', startIndex, stopIndex)
    return new Promise(async resolve => {
      await this.getHouseList(startIndex + 1, stopIndex + 1)
      resolve()
    })
  }

  renderList() {
    const { count, isLoaded } = this.state
    if (count === 0 && isLoaded) {
      return <NoHouse />
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded.bind(this)}
        loadMoreRows={this.loadMoreRows.bind(this)}
        rowCount={count}
        minimumBatchSize={20}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight
                    width={width}
                    height={height}
                    rowCount={count}
                    rowHeight={120}
                    rowRenderer={this.rowRenderer.bind(this)}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }

  render() {
    return (
      <div className={styles.house}>
        <Flex className="house-title">
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader className="house-search" cityName={this.state.label} />
        </Flex>
        <Sticky>
          <Filter onFilter={this.onFilter} />
        </Sticky>
        {/* 需要渲染一个长列表 */}

        {this.renderList()}
      </div>
    )
  }
}

export default House
