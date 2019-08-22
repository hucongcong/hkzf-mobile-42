import React from 'react'
import styles from './index.module.scss'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { API, getCurrentCity } from 'utils'
import { Spring } from 'react-spring/renderprops'
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
    document.body.style.overflow = 'hidden'
    // 1. 解构相关的数据
    const { titleSelectedStatus, selectedValues } = this.state
    let newTitleSelectedStatus = { ...titleSelectedStatus }
    // 2. 高亮的逻辑
    //    2.1 遍历所有的标题  获取到所有的标题去遍历
    //    2.2 如果遍历的标题就是当前的标题  直接为true
    //    2.3 如果遍历的标题是其余的标题，，，调用getTitleSelected()  得到true和false
    //    2.4 统一 去更新titleSelectedStatus
    Object.keys(selectedValues).forEach(key => {
      if (key === type) {
        newTitleSelectedStatus[key] = true
      } else {
        const result = this.getTitleSelected(key, selectedValues[key])
        // console.log(result)
        // 把result放到newTitleSelectedStatus
        // newTitleSelectedStatus[key] = result[key]

        // 合并一个获取多个对象到目标对象
        Object.assign(newTitleSelectedStatus, result)
      }
    })
    // 修改openType
    this.setState({
      openType: type,
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  /* 
    1. 只需要判断当前的openType是否高亮
    2. 调用getTitleSelected 返回一个对象， 参数：title   value
    3. 拿着getTitleSelected的返回值覆盖原来的titleSelectedStatus
  */
  onCancel = () => {
    document.body.style.overflow = ''
    // 取消只需要判断当前的标题的高亮问题
    // 从state中获取需要处理的数据
    const { openType, titleSelectedStatus, selectedValues } = this.state
    const selectedVal = selectedValues[openType]
    const result = this.getTitleSelected(openType, selectedVal)

    // 把openType的值变成''
    this.setState({
      openType: '',
      titleSelectedStatus: {
        ...titleSelectedStatus,
        ...result
      }
    })
  }

  /* 
    接收一个title和 title对应的值
    返回：一个对象，对象包含了这个title是否高亮
  */
  getTitleSelected(title, value) {
    // console.log(title, value)
    const obj = {}
    const selectedVal = value.toString()
    if (title === 'area' && selectedVal !== 'area,null') {
      obj[title] = true
    } else if (title === 'mode' && selectedVal !== 'null') {
      obj[title] = true
    } else if (title === 'price' && selectedVal !== 'null') {
      obj[title] = true
    } else if (title === 'more' && value.length > 0) {
      obj[title] = true
    } else {
      obj[title] = false
    }
    return obj
  }

  // 点击确定的时候要做的事件
  onSave = value => {
    document.body.style.overflow = ''
    const { openType, selectedValues, titleSelectedStatus } = this.state
    const { onFilter } = this.props
    // 处理高亮
    const result = this.getTitleSelected(openType, value)
    // console.log(openType, value)
    // 更新数据
    const newSelectedValues = {
      ...selectedValues,
      [openType]: value
    }
    this.setState({
      // 隐藏FilterPicker
      openType: '',
      selectedValues: newSelectedValues,
      titleSelectedStatus: {
        ...titleSelectedStatus,
        ...result
      }
    })

    onFilter(newSelectedValues)
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
  renderFilterMore() {
    // 只需要判断openType
    const {
      openType,
      filtersData: { characteristic, floor, oriented, roomType },
      selectedValues
    } = this.state
    // console.log(selectedValues)
    const data = { characteristic, floor, oriented, roomType }
    // if (openType === 'more') {
    return (
      <FilterMore
        onSave={this.onSave}
        onCancel={this.onCancel}
        openType={openType}
        {...data}
        defaultValue={selectedValues['more']}
      />
    )
    // } else {
    //   return null
    // }
  }

  renderMask() {
    const { openType } = this.state
    // if (openType === '' || openType === 'more') {
    //   return null
    // }
    const isHide = openType === '' || openType === 'more'

    return (
      <Spring to={{ opacity: isHide ? 0 : 1 }}>
        {props => {
          console.log(props)
          if (props.opacity === 0) {
            return null
          }
          return <div style={props} className="mask" onClick={this.onCancel} />
        }}
      </Spring>
    )
  }
  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.filter}>
        {this.renderMask()}
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
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
export default Filter
