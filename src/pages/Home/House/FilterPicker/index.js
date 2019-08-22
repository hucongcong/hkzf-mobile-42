import React from 'react'
import { PickerView } from 'antd-mobile'
import styles from './index.module.scss'
import FilterFooter from '../FilterFooter'

class FilterPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.defaultValue
    }
    // console.log('父组件的默认值', this.props.defaultValue)
  }

  handleChange = value => {
    // 通过value可以和获取到选中的值
    this.setState({
      value
    })
    // console.log(value)
  }

  render() {
    const { onCancel, onSave, data, cols } = this.props
    const { value } = this.state
    // console.log('父组件的数据', data)
    return (
      <div className={styles['filter-picker']}>
        {/* 三级联动 */}
        <PickerView
          data={data}
          cols={cols}
          value={value}
          onChange={this.handleChange}
        />
        {/* 底部 */}
        <FilterFooter onCancel={onCancel} onSave={() => onSave(value)} />
      </div>
    )
  }
}
export default FilterPicker
