# Filter组件控制FilterTitle组件的高亮

1. Filter组件提供高亮的数据

```js

titleSelectedStatus: {
  area: false,
  mode: false,
  price: false,
  more: false
}

```

2. 父组件要传递给子组件

```js
<FilterTitle titleSelectedStatus={titleSelectedStatus} />
```

3. 子组件去接收数据

```js
const { titleSelectedStatus } = this.props
```

4.  FilterTitle组件根据`titleSelectedStatus`控制高亮

根据遍历的`item.type`可以获取高亮的状态，配合classnames控制selected类名

```js
<Flex.Item key={item.title}>
  {/* 选中类名： selected */}
  <span
    className={classnames('dropdown', { selected: isSelected })}
  >
    <span>{item.title}</span>
    <i className="iconfont icon-arrow" />
  </span>
</Flex.Item>
```

# 点击FilterTitle,控制高亮

1. 给FitlerTitle组件的每一项注册事件

```js
<span
  className={classnames('dropdown', { selected: isSelected })}
  onClick={() => changeStatus(item.type)}
>
```

2. 注册事件的时候，调用父组件提供的方法

```js
const { titleSelectedStatus, changeStatus } = this.props
```

3. 父组件提供一个修改状态的方法

```js

<FilterTitle
  titleSelectedStatus={titleSelectedStatus}
  changeStatus={this.changeStatus}
/>
```


4. 父组件修改状态

```js
changeStatus = type => {
  // console.log(type)
  // 父组件需要把type对应的值改成true
  const { titleSelectedStatus } = this.state
  // const temp = { ...titleSelectedStatus }
  // temp[type] = true
  this.setState({
    titleSelectedStatus: {
      ...titleSelectedStatus,
      [type]: true
    }
  })
}
```


# 控制FilterPicker组件显示功能

核心思路：点击area/mode/type的时候，FilterPicker和mask都应该显示
         点击的是 more  取消  确定  mask：FilterPicker和mask都应该隐藏


1. Filter组件提供一个状态`openType`, 记录点击的类型
2. 判断openType是否是`area/mode/type` FilterPicker和mask都应该显示
3. 其余情况就是隐藏
4. 点击的时候，还需要修改openType的值


# 控制FilterPicker组件的隐藏功能

点击mask  点击了取消  点击了确定

1. Filter组件提供两个方法`onCancel`  `onSave`

```js
onCancel = () => {
  // 把openType的值变成''
  this.setState({
    openType: ''
  })
}

// 点击确定的时候要做的事件
onSave = () => {
  // 把openType的值变成''
  this.setState({
    openType: ''
  })
}
```

2. 给mask注册事件， 执行onCancel

```js
<div className="mask" onClick={this.onCancel} />
```

3. 把onCancel和onSave传给 FilterPicker组件

```js
<FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
```


4. FilterPicker组件把onSave和onCancel传给FilterFooter组件

```js
<FilterFooter onCancel={onCancel} onSave={onSave} />
```
5. 在FilterFooter组件中触发 onSave和onCancel

```js
{/* 取消按钮 */}
<span className="btn cancel" onClick={onCancel}>
  取消
</span>
{/* 确定按钮 */}
<span className="btn ok" onClick={onSave}>
  确定
</span>
```


# 发送请求，获取到了所有的筛选条件

封装了一个函数`getFiltersData`

```js
// 1. 获取当前城市的id值
// 2. 发送ajax请求
// 3. 把结果存储到`filterDatas`中

```


# 根据openType给FilterPicker组件提供数据

1. 把FilterPicker的渲染封装到一个函数中`renderFilterPicker`
2. 定义了两个变量: data   cols
3. 判断openType的值， area: [area, subway]  mode: rentType  price: price

```js
// 处理：根据openType来处理需要渲染的data数据
let data, cols
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

```

4. 把data和cols都传递给FilterPicker组件

```js
return (
      <FilterPicker
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
      />
    )
```

5. FilterPicker组件接收data和cols，交给 Pickerview进行展示

```js
<PickerView data={data} cols={cols} />
```


# 获取FilterPicker组件的筛选条件

1. FilterPicker组件中创建一个状态`value`, value给PickerView

```js
  state = {
    value: []
  }
```

2. 给PickerView组件注册`onChange`的事件,在每次改变的时候，获取最新的数据

```js

handleChange = value => {
  // 通过value可以和获取到选中的值
  this.setState({
    value
  })
  console.log(value)
}

```

3. FilterPicker组件把value传递给父组件

```js
<FilterFooter onCancel={onCancel} onSave={() => onSave(value)} />
```


# Filter组件保存筛选条件

1. 子组件获取到了value值，并且触发事件的时候传递给了父组件

2. 父组件提供一个状态`selectedValues` 记录筛选条件

```js
selectedValue: {
  area: ['area',  'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}
```

3. 修改selectedValues

```js
this.setState({
  openType: '',
  selectedValues: {
    ...selectedValues,
    [openType]: value
  }
})
```