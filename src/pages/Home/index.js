import React from 'react'
import { Route } from 'react-router-dom'
import Index from './Index/index.js'
import House from './House'
import News from './News'
import My from './My'
import './index.scss'
// 导入TabBar组件
import { TabBar } from 'antd-mobile'

// 抽取了所有的tabBar中的数据
const itemList = [
  { title: '首页', icon: 'icon-ind', path: '/home' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/house' },
  { title: '资讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/my' }
]

class Home extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      // 设置默认高亮
      selectedTab: props.location.pathname
    }
  }

  renderItem() {
    return itemList.map(item => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path
          })
          this.props.history.push(item.path)
        }}
      />
    ))
  }

  render() {
    return (
      // route的匹配规则
      <div className="home">
        {/* 路由规则 */}
        {/* route 只要path匹配上了，对应的组件就会渲染，但是如果path没有匹配上，对应的组件就不会渲染 */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/house" component={House} />
        <Route path="/home/news" component={News} />
        <Route path="/home/my" component={My} />
        {/* 导航连接 */}
        {/* 
          noRenderContent={true} 不渲染内容
          删除renderContent的函数以及这个函数的调用
          调整了样式，把tabBar放到最底部
        */}
        <div className="nav">
          <TabBar
            unselectedTintColor="#888"
            tintColor="#21b97a"
            barTintColor="white"
            noRenderContent={true}
          >
            {this.renderItem()}
          </TabBar>
        </div>
      </div>
    )
  }
}

export default Home
