# 需要解决城市的名字的显示问题

1. 发送请求的时候，需要用到城市的value，，，，顶部的searchHeader组件中需要用到城市的label
2. 在`componentDidMount`中，获取城市的信息，获取到了之后，存储到`state`中
3. 在render中去使用`label`的时候，只需要通过`this.state.label`获取
4. 发送请求的时候，只需要通过`this.state.value`就可以获取到
