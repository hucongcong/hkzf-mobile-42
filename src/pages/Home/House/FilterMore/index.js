import React from 'react'
import styles from './index.module.scss'
import classnames from 'classnames'
import FilterFooter from '../FilterFooter'
import { Spring } from 'react-spring/renderprops'
class FilterMore extends React.Component {
  state = {
    // 记录所有的选中的标签的value值
    selectedValues: this.props.defaultValue
  }

  handleClick(value) {
    let newSelectedValues = this.state.selectedValues.slice()

    // 判断selectedValues中是否存在value
    // 如果存在，就应该移除这个
    // 如果不存在，就需要添加这个值
    if (newSelectedValues.includes(value)) {
      newSelectedValues = newSelectedValues.filter(item => item !== value)
    } else {
      newSelectedValues.push(value)
    }
    this.setState({
      selectedValues: newSelectedValues
    })
  }

  renderItem(data) {
    const { selectedValues } = this.state
    return data.map(item => (
      <span
        className={classnames('tag', {
          'tag-active': selectedValues.includes(item.value)
        })}
        key={item.value}
        onClick={this.handleClick.bind(this, item.value)}
      >
        {item.label}
      </span>
    ))
  }

  render() {
    // console.log(this.props)
    const {
      characteristic = [],
      floor = [],
      oriented = [],
      roomType = [],
      onSave,
      onCancel,
      openType
    } = this.props
    const { selectedValues } = this.state
    return (
      <div className={styles['filter-more']}>
        {/* 遮罩层 */}
        <Spring to={{ opacity: openType === 'more' ? 1 : 0 }}>
          {props => {
            if (props.opacity === 0) {
              return null
            }
            return <div style={props} className="mask" onClick={onCancel} />
          }}
        </Spring>
        {/* 条件内容 */}
        <Spring
          to={{
            transform:
              openType === 'more' ? 'translateX(0%)' : 'translateX(100%)'
          }}
        >
          {props => {
            return (
              <>
                <div className="tags" style={props}>
                  <dl className="dl">
                    <dt className="dt">户型</dt>
                    <dd className="dd">{this.renderItem(roomType)}</dd>

                    <dt className="dt">朝向</dt>
                    <dd className="dd">{this.renderItem(oriented)}</dd>

                    <dt className="dt">楼层</dt>
                    <dd className="dd">{this.renderItem(floor)}</dd>

                    <dt className="dt">房屋亮点</dt>
                    <dd className="dd">{this.renderItem(characteristic)}</dd>
                  </dl>
                </div>
                <FilterFooter
                  style={props}
                  className="footer"
                  cancelText="清除"
                  onCancel={() =>
                    this.setState({
                      selectedValues: []
                    })
                  }
                  onSave={() => onSave(selectedValues)}
                />
              </>
            )
          }}
        </Spring>
      </div>
    )
  }
}
export default FilterMore
