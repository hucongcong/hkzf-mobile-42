import React from 'react'
import { Button } from 'antd-mobile'
class Home extends React.Component {
  render() {
    return (
      <div>
        Home组件
        <Button type="primary" loading>
          我是按钮
        </Button>
      </div>
    )
  }
}

export default Home
