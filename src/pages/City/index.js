import React from 'react'
import { Toast } from 'antd-mobile'
import styles from './index.module.scss'
import { getCurrentCity, setCity, API } from 'utils'
import { List, AutoSizer } from 'react-virtualized'
import NavHeader from 'common/NavHeader'
const TITLE_HEIGHT = 36
const CITY_HEIGHT = 50
// 有房源的城市
const CITYS = ['北京', '上海', '广州', '深圳']

class City extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shortList: [],
      cityObj: {},
      currentIndex: 0
    }
    // 创建ref
    this.listRef = React.createRef()
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
    const res = await API.get('area/city?level=1')
    const { body } = res
    // 对body进行数据格式的处理
    const { cityObj, shortList } = this.formatData(body)

    // 添加热门城市
    const hotRes = await API.get('area/hot')

    shortList.unshift('hot')
    cityObj.hot = hotRes.body

    // 给shortList 城市简写的数组再添加一个 #
    const city = await getCurrentCity()
    shortList.unshift('#')
    cityObj['#'] = [city]

    this.setState({
      cityObj,
      shortList
    })
  }

  async componentDidMount() {
    await this.getCityList()
    // 数据加载完成了，就需要测量所有的行，解决跳转到还没有加载的数据的时候计算不准确的bug
    this.listRef.current.measureAllRows()
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

  /* 
    1. 给城市名称项绑定点击事件。  传参
    2. 判断当前城市是否有房源数据（只有北/上/广/深四个城市有数据）
    3. 如果有则保存当前城市数据到本地缓存中，并返回上一页。
    4. 如果没有，给一个提示框
  */

  selectCity(city) {
    // console.log(Toast)
    // console.log(city)
    // 判断city是否在北上广深
    if (CITYS.includes(city.label)) {
      // 存起来
      setCity(city)
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源信息', 1, null, false)
    }
  }

  rowRenderer({ key, index, style }) {
    // 通过下标可以获取首字母
    const letter = this.state.shortList[index]
    // 根据首字母获取到需要渲染的城市列表
    const list = this.state.cityObj[letter]
    return (
      <div key={key} style={style} className={styles['city-item']}>
        <div className={styles['title']}>{this.formatTitle(letter)}</div>
        {list.map(item => (
          <div
            key={item.value}
            className={styles['name']}
            onClick={this.selectCity.bind(this, item)}
          >
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

  /* 
    - 给索引列表项绑定点击事件  OK 不 ?
    - 在点击事件中， 通过 index 获取到当前项索引号。  ok   注册事件时传递了参数
    - 调用 List 组件的 scrollToRow 方法，让 List 组件滚动到指定行。 先去获取List组件
    - 设置 List 组件的 `scrollToAlignment` 配置项值为 start，保证被点击行出现在页面顶部。
  */
  scrollToRow(index) {
    // console.log(index)
    // 调用List组件的一个方法 scrollToRow
    // console.log(this.listRef)
    this.listRef.current.scrollToRow(index)
  }
  renderRightMenu() {
    return (
      <ul className={styles['city-index']}>
        {this.state.shortList.map((item, index) => (
          <li
            key={item}
            className={styles['city-index-item']}
            onClick={this.scrollToRow.bind(this, index)}
          >
            <span
              className={
                index === this.state.currentIndex ? styles['index-active'] : ''
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
    // console.log(this.props)
    return (
      <div className={styles['city']}>
        {/* 顶部导航栏 */}
        <NavHeader>城市列表</NavHeader>
        {/* <NavHeaderWithRuoter>城市列表</NavHeaderWithRuoter> */}
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
              ref={this.listRef}
              width={width}
              height={height}
              rowCount={this.state.shortList.length}
              rowHeight={this.caclHeight.bind(this)}
              rowRenderer={this.rowRenderer.bind(this)}
              onRowsRendered={this.onRowsRendered.bind(this)}
              scrollToAlignment="start"
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
