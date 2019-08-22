import React, { Component, createRef } from 'react'
import styles from './index.module.scss'
import PropTypes from 'prop-types'
export default class index extends Component {
  static propTypes = {
    size: PropTypes.number,
    children: PropTypes.element.isRequired
  }
  static defaultProps = {
    size: 40
  }
  constructor(props) {
    super(props)
    this.contentRef = createRef()
    this.placeHolderRef = createRef()
  }

  handleScroll = () => {
    // console.log('哈哈')
    const { top } = this.placeHolderRef.current.getBoundingClientRect()
    // console.log(top)
    if (top <= 0) {
      // content就需要固定定位了
      this.contentRef.current.classList.add(styles.fixed)
      this.placeHolderRef.current.style.height = this.props.size + 'px'
    } else {
      // content不需要固定定位
      this.contentRef.current.classList.remove(styles.fixed)
      this.placeHolderRef.current.style.height = '0px'
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <div className="sticky">
        {/* 占位 */}
        <div className="placeHolder" ref={this.placeHolderRef} />
        {/* 内容 */}
        <div className="content" ref={this.contentRef}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
