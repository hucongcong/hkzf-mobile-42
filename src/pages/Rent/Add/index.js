import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  Toast
} from 'antd-mobile'

import NavHeader from 'common/NavHeader'
import HousePackge from 'common/HousePackage'
import styles from './index.module.scss'
import { API } from 'utils'

const alert = Modal.alert
const Item = List.Item
// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]
// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]
// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  state = {
    community: {
      id: '',
      name: ''
    },
    price: '',
    size: '',
    title: '',
    description: '',
    roomType: [],
    floor: [],
    oriented: [],
    supporting: '',
    files: []
  }

  componentDidMount() {
    console.log(this.props.location)
    const { state } = this.props.location
    if (state) {
      this.setState({
        community: state.community
      })
    }
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }

  addHouse = async () => {
    const {
      community,
      price,
      size,
      title,
      description,
      roomType,
      floor,
      oriented,
      files,
      supporting
    } = this.state
    // 1. 上传图片
    const formData = new FormData()
    if (files.length < 1) {
      return Toast.info('至少上传一张图片', 1)
    }
    files.forEach(item => formData.append('file', item.file))
    const res = await API.post('houses/image', formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })

    // 2. 发送请求，添加房子信息
    const addRes = await API.post('user/houses', {
      title,
      description,
      houseImg: res.body.join('|'),
      oriented: oriented[0],
      supporting,
      price,
      roomType: roomType[0],
      size,
      floor: floor[0],
      community: community.id
    })

    if (addRes.status === 200) {
      this.props.history.push('/rent')
    }
  }

  handleChange = (name, value) => {
    // console.log(name, value)
    this.setState({
      [name]: value
    })
  }

  onChange(files, type, index) {
    // console.log(files, type, index)
    this.setState({
      files
    })
  }

  render() {
    const { history } = this.props
    const {
      community,
      price,
      size,
      title,
      description,
      roomType,
      floor,
      oriented,
      files
    } = this.state
    return (
      <div className={styles['rent-add']}>
        <NavHeader className="NavHeader">发布房源</NavHeader>

        <List className="header" renderHeader={() => '房源信息'}>
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem
            placeholder="请输入租金/月"
            extra="￥/月"
            value={price}
            onChange={this.handleChange.bind(this, 'price')}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            value={size}
            onChange={this.handleChange.bind(this, 'size')}
          >
            建筑面积
          </InputItem>
          <Picker
            data={roomTypeData}
            value={roomType}
            cols={1}
            onChange={this.handleChange.bind(this, 'roomType')}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker
            data={floorData}
            value={floor}
            cols={1}
            onChange={this.handleChange.bind(this, 'floor')}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker
            data={orientedData}
            value={oriented}
            cols={1}
            onChange={this.handleChange.bind(this, 'oriented')}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className="title"
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={this.handleChange.bind(this, 'title')}
          />
        </List>

        <List
          className="pics"
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={files}
            multiple={true}
            className="imgpicker"
            onChange={this.onChange.bind(this)}
          />
        </List>

        <List
          className="supporting"
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackge
            onSelect={values => {
              this.setState({
                supporting: values.join('|')
              })
            }}
          />
        </List>

        <List
          className="desc"
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={this.handleChange.bind(this, 'description')}
          />
        </List>

        <Flex className="bottom">
          <Flex.Item className="cancel" onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className="confirm" onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
