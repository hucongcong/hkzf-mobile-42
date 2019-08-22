import React, { Component } from 'react'
import { API, BASE_URL, hasToken } from 'utils'
import NavHeader from 'common/NavHeader'
import styles from './index.module.scss'
import { Carousel, Flex, Modal, Toast } from 'antd-mobile'
import classnames from 'classnames'
import HousePackage from 'common/HousePackage'
import HouseItem from 'common/HouseItem'
const BMap = window.BMap
// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    houseImg: '/img/news/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    houseImg: '/img/news/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    houseImg: '/img/news/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]
export default class Detail extends Component {
  state = {
    houseInfo: null,
    isFavorite: false
  }

  checkLove = async id => {
    const res = await API.get(`user/favorites/${id}`)
    this.setState({
      isFavorite: res.body.isFavorite
    })
  }

  async componentDidMount() {
    const id = this.props.match.params.id
    this.id = id
    const res = await API.get(`houses/${id}`)
    // console.log(res)
    this.setState({
      houseInfo: res.body
    })

    // 发送请求判断是否收藏
    if (!hasToken()) return

    this.checkLove(id)

    // 渲染百度地图
    this.renderMap(res.body.community, res.body.coord)
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label(
      `<span>${community}</span>
      <div class="mapArrow"></div>`,
      {
        position: point,
        offset: new BMap.Size(0, -36)
      }
    )

    label.setStyle({
      position: 'absolute',
      zIndex: -7982820,
      backgroundColor: 'rgb(238, 93, 91)',
      color: 'rgb(255, 255, 255)',
      height: 25,
      padding: '5px 10px',
      lineHeight: '14px',
      borderRadius: 3,
      boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
      whiteSpace: 'nowrap',
      fontSize: 12,
      userSelect: 'none'
    })
    map.addOverlay(label)
  }
  // 渲染标签
  renderTags(tags) {
    return tags.map((item, index) => {
      // 如果标签数量超过3个，后面的标签就都展示位第三个标签的样式
      let tagClass = ''
      if (index > 2) {
        tagClass = 'tag3'
      } else {
        tagClass = 'tag' + (index + 1)
      }

      return (
        <span key={item} className={classnames('tag', tagClass)}>
          {item}
        </span>
      )
    })
  }
  handleFavorite = async () => {
    if (!hasToken()) {
      // 用户没登录
      return Modal.alert('提示', '登录才能收藏房源，是否去登录?', [
        { text: '取消' },
        {
          text: '确定',
          onPress: () => {
            this.props.history.push('/login', { from: this.props.location })
          }
        }
      ])
    }

    // 已经登录了
    if (this.state.isFavorite) {
      // 已经收藏过了
      const res = await API.delete(`user/favorites/${this.id}`)
      if (res.status === 200) {
        Toast.success('取消收藏')
        this.setState({
          isFavorite: false
        })
      } else {
        Modal.alert('提示', 'token过期了，是否去登录?', [
          { text: '取消' },
          {
            text: '确定',
            onPress: () => {
              this.props.history.push('/login', { from: this.props.location })
            }
          }
        ])
      }
    } else {
      // 没有收藏
      const res = await API.post(`user/favorites/${this.id}`)
      if (res.status === 200) {
        Toast.success('添加收藏')
        this.setState({
          isFavorite: true
        })
      } else {
        Modal.alert('提示', 'token过期了，是否去登录?', [
          { text: '取消' },
          {
            text: '确定',
            onPress: () => {
              this.props.history.push('/login', { from: this.props.location })
            }
          }
        ])
      }
    }
  }
  render() {
    const { houseInfo } = this.state
    if (!houseInfo) {
      return null
    }
    // console.log(houseInfo)
    const {
      community,
      houseImg,
      title,
      price,
      roomType,
      size,
      floor,
      oriented,
      tags,
      supporting,
      description
    } = houseInfo

    return (
      <div className={styles.detail}>
        <NavHeader
          className="navHeader"
          rightContent={[<i key="share" className="iconfont icon-share" />]}
        >
          {community}
        </NavHeader>

        {/* 轮播图 */}
        <div className="slides">
          <Carousel autoplay infinite>
            {houseImg.map(item => (
              <a key={item} href="http://www.alipay.com">
                <img src={`${BASE_URL}${item}`} alt="" />
              </a>
            ))}
          </Carousel>
        </div>
        {/* 房屋基础信息 */}
        <div className="info">
          <h3 className="infoTitle">{title}</h3>
          <Flex className="tags">
            <Flex.Item>{this.renderTags(tags)}</Flex.Item>
          </Flex>

          <Flex className="infoPrice">
            <Flex.Item className="infoPriceItem">
              <div>
                {price}
                <span className="month">/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className="infoPriceItem">
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className="infoPriceItem">
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className="infoBasic" align="start">
            <Flex.Item>
              <div>
                <span className="title">装修：</span>
                精装
              </div>
              <div>
                <span className="title">楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className="title">朝向：</span>
                {oriented.join('、')}
              </div>
              <div>
                <span className="title">类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 渲染百度地图 */}
        <div className="map">
          <div className="mapTitle">
            小区：
            <span>{community}</span>
          </div>
          <div className="mapContainer" id="map">
            地图
          </div>
        </div>
        {/* 房屋配套 */}
        <div className="about">
          <div className="houseTitle">房屋配套</div>
          {supporting.length === 0 ? (
            <div className="titleEmpty">暂无数据</div>
          ) : (
            <HousePackage list={supporting} />
          )}
        </div>
        {/* 房屋概况 */}
        <div className="set">
          <div className="houseTitle">房源概况</div>
          <div>
            <div className="contact">
              <div className="user">
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className="useInfo">
                  <div>王女士</div>
                  <div className="userAuth">
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className="userMsg">发消息</span>
            </div>

            <div className="descText">{description || '暂无房屋描述'}</div>
          </div>
        </div>
        {/* 推荐 */}
        <div className="recommend">
          <div className="houseTitle">猜你喜欢</div>
          <div className="items">
            {recommendHouses.map(item => (
              <HouseItem item={item} key={item.id} />
            ))}
          </div>
        </div>
        {/* 底部收藏按钮 */}
        <Flex className="fixedBottom">
          <Flex.Item onClick={this.handleFavorite}>
            <img
              src={
                BASE_URL +
                (this.state.isFavorite ? '/img/star.png' : '/img/unstar.png')
              }
              className="favoriteImg"
              alt="收藏"
            />
            <span className="favorite">
              {this.state.isFavorite ? '已收藏' : '收藏'}
            </span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className="telephone">
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
