import React from 'react'
import styles from './index.module.scss'
import NavHeader from 'common/NavHeader'
import { getCurrentCity, API } from 'utils'
import { Toast } from 'antd-mobile'
import HouseItem from 'common/HouseItem'
import classnames from 'classnames'
const BMap = window.BMap
// 在react中，如果想要直接访问全局变量，需要通过window
class Map extends React.Component {
  state = {
    isShow: false,
    houses: []
  }
  // 渲染覆盖物
  async renderOverlays(id) {
    Toast.loading('加载中...', 0)
    const { type, nextZoom } = this.getTypeAndZoom()
    const res = await API.get(`area/map?id=${id}`)
    // console.log(res.data.body)
    res.body.forEach(item => {
      // 不负责添加具体的覆盖物
      this.addOverlay(item, type, nextZoom)
    })
    Toast.hide()
  }

  // 添加覆盖物， 主要负责判断需要渲染的覆盖物类型
  addOverlay(item, type, nextZoom) {
    // console.log('我负责添加覆盖物', item, type, nextZoom)
    if (type === 'circle') {
      this.createCircle(item, nextZoom)
    } else {
      this.createRect(item, nextZoom)
    }
  }

  // 创建圆形的覆盖物
  createCircle(item, nextZoom) {
    // 1. 创建一个label
    // 2. 设置圆形覆盖物的内容
    // 3. 设置里面的内容
    // 4. 注册点击事件
    const html = `
      <div class="bubble">
        <p class="name">${item.label}</p>
        <p>${item.count}套</p>
      </div>
    `
    // 创建pont,每个区的位置
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    const options = {
      position: point,
      offset: new BMap.Size(-35, -35)
    }
    const label = new BMap.Label(html, options)

    label.setStyle({
      border: '0px solid #fff',
      padding: 0
    })
    this.map.addOverlay(label)

    label.addEventListener('click', () => {
      // 1. 清除覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
      // 2. 设置中心点，设置缩放的级别
      this.map.centerAndZoom(point, nextZoom)
      // 3. 继续根据value值渲染下一级的覆盖物
      // console.log(item)
      this.renderOverlays(item.value)
    })
  }

  async getHouses(id) {
    Toast.loading('加载中...', 0)
    const res = await API.get(`houses?cityId=${id}`)
    this.setState({
      isShow: true,
      houses: res.body.list
    })
    Toast.hide()
  }

  createRect(item) {
    const html = `
      <div class="rect">
        <span class="housename">${item.label}</span>
        <span class="housenum">${item.count}套</span>
        <i class="arrow"></i>
      </div>
    `
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    const options = {
      position: point,
      offset: new BMap.Size(-50, -20)
    }
    const label = new BMap.Label(html, options)

    label.setStyle({
      border: '0px solid rgb(255, 0, 0)',
      padding: '0px'
    })

    this.map.addOverlay(label)

    // addEventListener这是百度地图提供的注册事件的方法，和DOM的不一样的。
    // 坑： 百度地图封装的addEventListener不支持使用aysnc函数
    label.addEventListener('click', e => {
      // 调用结构，获取房源数据
      this.getHouses(item.value)
      // this.map.centerAndZoom(point, 15)
      const clientX = e.changedTouches[0].clientX
      const clientY = e.changedTouches[0].clientY
      const x = window.innerWidth / 2 - clientX
      const y = (window.innerHeight - 330 - 45) / 2 - (clientY - 45)
      this.map.panBy(x, y)
    })
  }

  // 根据当前的缩放级别来判断
  // 1. 渲染的覆盖物的类型
  // 2. 下一次的缩放级别
  getTypeAndZoom() {
    let type, nextZoom
    const zoom = this.map.getZoom()
    if (zoom === 11) {
      type = 'circle'
      nextZoom = 13
    } else if (zoom === 13) {
      type = 'circle'
      nextZoom = 15
    } else {
      type = 'rect'
      nextZoom = 15
    }
    return {
      type,
      nextZoom
    }
  }

  // 初始化地图
  // 1. 获取到当前城市名
  // 2. 根据当前城市名解析出来经纬度  （百度地图的API）
  // 3. 创建地图，并且设置地图的中心点
  // 4. 添加两个控制
  async initMap() {
    // 获取当前的城市
    const { label, value } = await getCurrentCity()

    // 根据label获取经纬度
    const map = new BMap.Map('container')
    // 把map挂载当前实例上。
    this.map = map

    // 给地图注册一个移动事件
    this.map.addEventListener('movestart', () => {
      this.setState({
        isShow: false
      })
    })

    const myGeo = new BMap.Geocoder()
    // 参数1： 详细的地址，如果直接传城市， 会显示城市的中心
    myGeo.getPoint(
      label,
      async point => {
        if (!point) return
        // 让地图居中并且缩放
        map.centerAndZoom(point, 11)

        // 添加控件
        map.addControl(new BMap.NavigationControl())
        map.addControl(new BMap.ScaleControl())

        // 渲染覆盖物
        this.renderOverlays(value)
      },
      label
    )
  }

  componentDidMount() {
    this.initMap()
  }

  renderHouse() {
    // key给谁加的问题： 谁需要重复渲染，就给谁添加key
    return this.state.houses.map(item => (
      <HouseItem key={item.houseCode} item={item} />
    ))
  }
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        {/* 保证这个div是全屏 */}
        <div id="container" />
        <div className={classnames('houseList', { show: this.state.isShow })}>
          <div className="titleWrap">
            <h1 className="listTitle">房屋列表</h1>
            <a className="titleMore" href="/house/list">
              更多房源
            </a>
          </div>
          <div className="houseItems">{this.renderHouse()}</div>
        </div>
      </div>
    )
  }
}

export default Map
