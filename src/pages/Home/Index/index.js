import React from 'react'
import { Carousel, Flex, Grid } from 'antd-mobile'
import axios from 'axios'
import Nav1 from 'assets/images/nav-1.png'
import Nav2 from 'assets/images/nav-2.png'
import Nav3 from 'assets/images/nav-3.png'
import Nav4 from 'assets/images/nav-4.png'
import './index.scss'
import { Link } from 'react-router-dom'
import { getCurrentCity } from 'utils'
const navList = [
  { title: '整租', img: Nav1, path: '/home/house' },
  { title: '合租', img: Nav2, path: '/home/house' },
  { title: '地图找房', img: Nav3, path: '/map' },
  { title: '去出租', img: Nav4, path: '/rent' }
]

class Index extends React.Component {
  state = {
    // 指的是轮播图的初始数据
    swipers: [],
    // 租房小组的数据
    groups: [],
    // 最新资讯
    messages: [],
    // 图片的初始的高度
    imgHeight: 212,
    // 轮播图数据还没有加载完成
    isLoaded: false,
    cityName: '北京'
  }
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        swipers: body,
        isLoaded: true
      })
    }
  }
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA|88cff55c-aaa4-e2e0'
      }
    })
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        groups: body
      })
    }
  }

  async getMessages() {
    const res = await axios.get('http://localhost:8080/home/news', {
      params: {
        area: 'AREA|88cff55c-aaa4-e2e0'
      }
    })
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        messages: body
      })
    }
  }
  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getMessages()

    const city = await getCurrentCity()
    console.log(city)
    this.setState({
      cityName: city.label
    })
  }
  renderSwiper() {
    // 如果数据还没有加载完成，不渲染
    if (!this.state.isLoaded) {
      return null
    }
    return (
      <Carousel autoplay infinite>
        {this.state.swipers.map(item => (
          <a
            key={item.id}
            href="http://itcast.cn"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`http://localhost:8080${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              //表示图片加载完成了, 会自动调整图片的高度，而不是写死
              onLoad={() => {
                window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }
  renderSearch() {
    return (
      <Flex className="search-box">
        <Flex className="search-form">
          <div
            className="location"
            onClick={() => this.props.history.push('/city')}
          >
            <span className="name">{this.state.cityName}</span>
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
  renderNav() {
    return (
      <Flex>
        {navList.map(item => (
          <Flex.Item key={item.title}>
            <Link to={item.path}>
              <img src={item.img} alt="" />
              <p>{item.title}</p>
            </Link>
          </Flex.Item>
        ))}
      </Flex>
    )
  }
  renderMessages() {
    return (
      <>
        <h3 className="message-title">最新资讯</h3>
        {this.state.messages.map(item => (
          <div key={item.id} className="news-item">
            <div className="imgwrap">
              <img
                className="img"
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
              />
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex>
          </div>
        ))}
      </>
    )
  }
  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper" style={{ height: this.state.imgHeight }}>
          {/* 渲染搜索框 */}
          {this.renderSearch()}
          {this.renderSwiper()}
        </div>
        <div className="nav">
          {/* 导航菜单 */}
          {this.renderNav()}
        </div>
        {/* 租房小组 */}
        <div className="group">
          {/* 标题 */}
          <h3 className="group-title">
            租房小组
            <span className="more">更多</span>
          </h3>
          {/* 内容 */}
          <div className="group-content">
            {/* 
              data: 需要渲染的数据，一个数组
              activeStyle
              square:控制九宫格是否是正方形
              hasLine: 没有边框
            */}
            <Grid
              data={this.state.groups}
              activeStyle
              columnNum={2}
              square={false}
              hasLine={false}
              renderItem={item => (
                <Flex className="group-item" justify="around">
                  <div className="desc">
                    <p className="title">{item.title}</p>
                    <span className="info">{item.desc}</span>
                  </div>
                  <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                </Flex>
              )}
            />
          </div>
        </div>
        {/* 最新资讯 */}
        <div className="message">{this.renderMessages()}</div>
      </div>
    )
  }
}

export default Index
