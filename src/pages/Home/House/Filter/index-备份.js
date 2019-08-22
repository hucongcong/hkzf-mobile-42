import React from 'react'
import styles from './index.module.scss'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { API, getCurrentCity } from 'utils'
class Filter extends React.Component {
  // 提供高亮状态
  state = {
    // 控制标题的选择状态
    titleSelectedStatus: {
      // area:区域  mode:方式  price:租金  more:筛选
      // true代表高亮  false:不选中
      area: false,
      mode: false,
      price: false,
      more: false
    },
    // 记录点击的标题的type值， 用于控制FilterPicker组件的显示和隐藏
    // openType: area/mode/price  FilterPicker就应该显示
    // openType: more/''  FilterPicker就应该隐藏
    openType: '',
    // 所有的筛选条件
    filtersData: {},
    // 用于存储所有已经选择过的筛选的条件
    selectedValues: {
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
  }

  changeStatus = type => {
    //1. 得到两个数据
    // titleSelectedStatus: {area: false, mode: false, price: false, more: false} 控制标题是否高亮
    // selectedValues: {  area: [], mode: [], price:[], more: []  }
    //                 {  area: ['area', 'null'], price: ['null'], mode: ['null'] }
    const { titleSelectedStatus, selectedValues } = this.state

    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 判断每一个标题是否高亮
    Object.keys(selectedValues).forEach(key => {
      // console.log(key)
      // 获取到key对应的值
      const selectedVal = selectedValues[key]
      // 挨个判断 四个key是否高亮就行
      // 1. 如果key是当前点击的这个标题直接亮
      // 2. 如果key是 'area'  默认值  ['area', 'null']
      // 3. 如果key是  mode   ['null']
      // 4. 如果key是  price   ['null']
      // 5. 如何key是  more    不判
      if (key === type) {
        newTitleSelectedStatus[key] = true
      } else if (
        key === 'area' &&
        (selectedVal.length === 3 || selectedVal[0] === 'subway')
      ) {
        // 为true的情况
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more') {
        // 占位置
      } else {
        newTitleSelectedStatus[key] = false
      }
    })

    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: type
    })
  }

  onCancel = () => {
    // 取消只需要判断当前的标题的高亮问题
    // 从state中获取需要处理的数据
    const { openType, titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedVal = selectedValues[openType].toString()
    if (openType === 'area' && selectedVal !== 'area,null') {
      newTitleSelectedStatus[openType] = true
    } else if (openType === 'mode' && selectedVal !== 'null') {
      newTitleSelectedStatus[openType] = true
    } else if (openType === 'price' && selectedVal !== 'null') {
      newTitleSelectedStatus[openType] = true
    } else {
      newTitleSelectedStatus[openType] = false
    }

    const result = this.getTitleSelected(openType, selectedValues[openType])
    console.log(result)
    // 把openType的值变成''
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  /* 
    接收一个title和 title对应的值
    返回：一个对象，对象包含了这个title是否高亮
  */
  getTitleSelected(title, value) {
    const obj = {}
    const selectedVal = value.toString()
    if (title === 'area' && selectedVal !== 'area,null') {
      obj[title] = true
    } else if (title === 'mode' && selectedVal !== 'null') {
      obj[title] = true
    } else if (title === 'price' && selectedVal !== 'null') {
      obj[title] = true
    } else {
      obj[title] = false
    }
    return obj
  }

  // 点击确定的时候要做的事件
  onSave = value => {
    console.log(value)
    // selectedValues:还是原来的，改之前
    const { openType, titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedVal = value.toString()
    if (openType === 'area' && selectedVal !== 'area,null') {
      newTitleSelectedStatus[openType] = true
    } else if (openType === 'mode' && selectedVal !== 'null') {
      newTitleSelectedStatus[openType] = true
    } else if (openType === 'price' && selectedVal !== 'null') {
      newTitleSelectedStatus[openType] = true
    } else {
      newTitleSelectedStatus[openType] = false
    }

    this.setState({
      openType: '',
      selectedValues: {
        ...selectedValues,
        [openType]: value
      },
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  // 获取筛选的条件数据
  async getFiltersData() {
    // 获取当前城市的value值
    const { value } = await getCurrentCity()
    // 根据当前的城市获取筛选条件
    const res = await API.get(`houses/condition?id=${value}`)
    this.setState({
      filtersData: res.body
    })
  }

  componentDidMount() {
    this.getFiltersData()
  }

  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state
    // 如果openType是空或者是more，不渲染任何的内容
    if (openType === '' || openType === 'more') return

    // 处理：根据openType来处理需要渲染的data数据
    // defaultValue: 给子组件回显的默认值，，是子组件之前选择过的值
    let data, cols
    const defaultValue = selectedValues[openType]
    if (openType === 'area') {
      data = [area, subway]
      cols = 3
    } else if (openType === 'mode') {
      data = rentType
      cols = 1
    } else if (openType === 'price') {
      data = price
      cols = 1
    }
    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        defaultValue={defaultValue}
      />
    )
  }
  render() {
    const { titleSelectedStatus, openType } = this.state
    return (
      <div className={styles.filter}>
        {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <div className="mask" onClick={this.onCancel} />
        ) : null}
        <div className="content">
          {/* filter组件的内容 */}
          {/* 标题 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            changeStatus={this.changeStatus}
          />
          {/* picker */}
          {this.renderFilterPicker()}
          {/* more */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
export default Filter
