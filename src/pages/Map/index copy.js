import React from 'react'
import styles from './index.module.scss'
import NavHeader from 'common/NavHeader'
import { getCurrentCity } from 'utils'
import Axios from 'axios'
const BMap = window.BMap
console.log(styles)
// 在react中，如果想要直接访问全局变量，需要通过window
class Map extends React.Component {
  // 渲染覆盖物
  renderOverlays(id) {}

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

        // 发送ajax请求，获取到当前城市所有区的数据
        const res = await Axios.get(
          `http://localhost:8080/area/map?id=${value}`
        )
        res.data.body.forEach(item => {
          // console.log(item)
          // 添加覆盖物
          // 1. 创建一个Label，，，，Label就是用于显示文字
          const html = `
            <div class="bubble">
              <p class="name">${item.label}</p>
              <p>${item.count}套</p>
            </div>
          `
          // 创建pont,每个区的位置
          const point = new BMap.Point(
            item.coord.longitude,
            item.coord.latitude
          )
          const options = {
            position: point,
            offset: new BMap.Size(-35, -35)
          }
          const label = new BMap.Label(html, options)
          // 2. 给覆盖物设置一些样式
          // 设置lable的样式
          label.setStyle({
            border: '0px solid rgb(255, 0, 0)'
          })
          // 3. 给地图添加覆盖物
          map.addOverlay(label)

          // 4. 给label注册点击事件
          label.addEventListener('click', function() {
            // 渲染下一级的覆盖物
            // console.log(item.value)
            // 1. 让点击的区处于地图的中间， 缩放级别 13
            // 2. 清除覆盖物
            map.centerAndZoom(point, 13)

            // 坑： 需要把clearOverlays方法放到异步执行的代码中
            setTimeout(() => {
              map.clearOverlays()
            }, 0)
            // 3. 根据当前区的id值，渲染下一级的覆盖
          })
        })
      },
      label
    )
  }

  componentDidMount() {
    this.initMap()
  }

  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        {/* 保证这个div是全屏 */}
        <div id="container" />
      </div>
    )
  }
}

export default Map
