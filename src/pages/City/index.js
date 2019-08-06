import React from 'react'
import { NavBar } from 'antd-mobile'
import './index.scss'
import Axios from 'axios'
import { getCurrentCity } from 'utils'
import { List, AutoSizer } from 'react-virtualized'
const TITLE_HEIGHT = 36
const CITY_HEIGHT = 50
class City extends React.Component {
  state = {
    shortList: [],
    cityObj: {},
    currentIndex: 0
  }

  formatData(list) {
    const cityObj = {}
    // 对data进行数据的处理
    // 1. 遍历list，得到每一个城市
    // 2. 获取到城市的short的首字母
    // 3. 判断 short的首字母 在对象中是否存在
    // 4. 如果对象中没有这个首字母，  给对象添加一个属性， 值 cityObj['a'] =  [{城市}]
    // 5. 如果对象中已经有了这个首字母，，，只需要往里面push即可
    list.forEach(item => {
      const key = item.short.slice(0, 1)
      // 判断key在cityObj中是否存在
      if (key in cityObj) {
        cityObj[key].push(item)
      } else {
        cityObj[key] = [item]
      }
    })

    const shortList = Object.keys(cityObj).sort()
    return {
      cityObj,
      shortList
    }
  }

  async getCityList() {
    const res = await Axios.get('http://localhost:8080/area/city?level=1')
    const { body } = res.data
    // 对body进行数据格式的处理
    const { cityObj, shortList } = this.formatData(body)

    // 添加热门城市
    const hotRes = await Axios.get('http://localhost:8080/area/hot')

    shortList.unshift('hot')
    cityObj.hot = hotRes.data.body

    // 给shortList 城市简写的数组再添加一个 #
    const city = await getCurrentCity()
    shortList.unshift('#')
    cityObj['#'] = [city]

    this.setState({
      cityObj,
      shortList
    })
  }

  componentDidMount() {
    this.getCityList()
  }

  formatTitle(title) {
    if (title === '#') {
      return '当前定位'
    } else if (title === 'hot') {
      return '热门城市'
    } else {
      return title.toUpperCase()
    }
  }

  rowRenderer({ key, index, style }) {
    // 通过下标可以获取首字母
    const letter = this.state.shortList[index]
    // 根据首字母获取到需要渲染的城市列表
    const list = this.state.cityObj[letter]
    return (
      <div key={key} style={style} className="city-item">
        <div className="title">{this.formatTitle(letter)}</div>
        {list.map(item => (
          <div key={item.value} className="name">
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  // 根据index下标动态计算这一行的高度
  // index 0
  caclHeight({ index }) {
    // 城市的首字母
    const letter = this.state.shortList[index]
    // 根据首字母获取城市的列表
    const list = this.state.cityObj[letter]
    // console.log(list)
    return TITLE_HEIGHT + list.length * CITY_HEIGHT
  }

  renderRightMenu() {
    return (
      <ul className="city-index">
        {this.state.shortList.map((item, index) => (
          <li key={item} className="city-index-item">
            <span
              className={
                index === this.state.currentIndex ? 'index-active' : ''
              }
            >
              {item === 'hot' ? '热' : item.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  // startIndex: 表示第几行显示出来了
  onRowsRendered({ startIndex }) {
    // console.log(startIndex)

    // 判断 currentIndex和 startIndex是否相等，如果相等，就不用修改，如果不想等，修改currentIndex
    if (this.state.currentIndex !== startIndex) {
      this.setState({
        currentIndex: startIndex
      })
    }
  }
  render() {
    return (
      <div className="city">
        {/* 顶部导航栏 */}
        <NavBar
          className="navBar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市列表
        </NavBar>
        {/* 城市列表 */}
        {/* 
          List: 长列表组件
          width: 长列表宽度（显示）
          height: 长列表的高度（显示的）
          rowCount： 显示的数据的条数
          rowHeight: 每行的高度
          rowRenderer： 控制每一行具体渲染的内容  render props
        */}

        {/* 
          autoSizer会自动获取到父盒子的高度和宽度，把宽度和高度传给List组件
          使用autoSizer必须得保证父盒子有高度才行
        */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowCount={this.state.shortList.length}
              rowHeight={this.caclHeight.bind(this)}
              rowRenderer={this.rowRenderer.bind(this)}
              onRowsRendered={this.onRowsRendered.bind(this)}
            />
          )}
        </AutoSizer>

        {/* 右侧的快捷菜单 */}
        {this.renderRightMenu()}
      </div>
    )
  }
}

export default City
