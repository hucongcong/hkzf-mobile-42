 # 使用key解决FilterPicker默认值的问题
 
 点击FilterTitle组件的标题的时候，默认情况，FilterPicker组件的默认选中是有bug的
 原因：props发生了改变的时候，组件会重新更新，但是不会重新的创建，会复用之前的组件。
    导致原因：render重新执行，渲染的数据是更新了的，但是constructor不会重新执行，得到的回显的默认值没有发生改变。
    解决方案1：在componentDidUpdate中，去更新的默认值 （一定要有判断，直接调用setState）
    解决方案2：渲染FilterPicker组件的时候，添加一个key属性，只要key发生了改变，FilterPicker组件就不会复用了，重新创建， constructor和render又要重新执行。



# 点击FitlerTitle组件的菜单，控制高亮的状态

1. 在`changetStatus`函数中处理逻辑
2. 从state中获取了`titleSelectedStatus` `SelectedValues`
3. 目的：需要更新`titleSelectedStatus`, 我们得到一个`newTitleSelectedStatus`

```js
const newTitleSelectedStatus = {...titleSelectedStatus}
```

4. 遍历所有的标题， 通过Object.keys(titleSelectedStatus)可以得到所有的标题

```js
Object.keys(titleSelectedStatus).forEach(key => {})
```

5. 判断key是否需要高亮

获取到每个key对应的value值， SelectedValues[key]
思路：1. 如果key是点击的标题  type,,直接高亮
     2. 如果key是area,  只要不是默认值就高亮   值的长度为3 或者这 值的第一项是 `subway`
     3. key 是  mode    值的第一项不是 'null'
     4. key 是price    值的第一项只要不是 'null' 
     5. 其余情况，都是false


# 点击取消按钮的时候，处理高亮

核心思路：只需要判断当前点击这一项的值是否和默认值相同

1. 根据`selectedValues` 和 `openType` 得到当前选中的这一项的值
2. 判断这一项的值和  默认值  是否相同即可
3. 如果相同，取消的高亮  
4. 如果不同，让他高亮


# 点击确定按钮的时候，处理高亮

1. 点击保存的时候，通过`value`直接就获取到当前选中的值
2. 根据value去判断是否和默认值相同即可
3. 如果相同，取消的高亮  
4. 如果不同，让他高亮



# FilterMore组件的显示

1. 封装了一个方法`renderFilterMore`
2. 方法里面判断`openType`的值，如果是more就是显示即可，其余情况不渲染
3. 从`filtersData`解构需要的数据`{characteristic, floor, oriented, roomType}`
4. 通过props传递给FilterMore组件
5. `FilterMore`接收到数据，并且渲染出来