import React from 'react'

class Son extends React.Component {
  constructor(props) {
    super(props)
    console.log('son的constructor')
  }
  render() {
    console.log('son的render')
    return <div>我是son组件={this.props.count}</div>
  }
}

class News extends React.Component {
  state = {
    count: 0
  }
  render() {
    return (
      <div>
        News组件
        <Son count={this.state.count} key={this.state.count} />
        <button
          onClick={() =>
            this.setState({
              count: this.state.count + 1
            })
          }
        >
          按钮
        </button>
      </div>
    )
  }
}

export default News
