# 给地图添加加载效果

1. 发送ajax请求之前,显示一个永远不会关闭的加载效果  

```js
Toast.loading('loading...', 0)
```

2. 等地图的覆盖物绘制完成，隐藏这个加载效果

```js
Toast.hide()
```

3. 点击圆形覆盖物  方块覆盖物都增加加载效果


# 点击小区的时候，让该小区居中

1. 核心方法：`map.panBy`
2. 难点：计算 需要位移 的x值和y

```js
 x:  一半的屏幕宽度 - 鼠标在可视区中的位置(e.changedTouches[0].clientX)
 x:  一半的可视的地图的高度的一半  -   鼠标在地图中的clientY

 一半的可视的地图的高度的一半:  (window.innerHeight - 300 - 45)  /2
 鼠标在地图中的clientY :  e.changedTouches[0].clientY - 45
```


# 优化axios

1. 创建了一个新的axios实例（不会影响到默认的axios对象）

```js
const API = axios.create({
  baseURL: ''
})
```

2. 给新创建的axios实例增加了响应的拦截器 把res.data 变成了  res

```js
// 配置响应的拦截器
API.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response.data
  },
  function(error) {
    return Promise.reject(error)
  }
)
```


# utils的模块划分

1. 希望在index.js中导出所有和工具相关的内容，，不能把所有的工具方法都放到index.js中
2. 在utils中分很多的模块，每个模块去提供对应的功能
3. 在index.js中统一的导出所有模块的内容。


# 图片的地址 和接口地址 

1. 问题：我们在代码中硬编码写死了图片的地址为`http://localhost:8080` 
2. 缺点：如果服务器的接口地址发生了改变
3. 把图片地址取出来，放到`config.js`中，由index.js统一导出
4. 以后只要使用图片的地址，就从utils中导出地址即可。


> 希望可以配置多个图片和接口的地址，将来开发或者上线的时候要能自动进行切换


# 环境变量的配置和使用

+ `.env.production`: npm run build: 会自动加载
+ `.env.development` : npm start, 会自动加载
+ `.env.test`  `npm test` 会自动加载


1. 在项目的根目录新建三个文件  
2. 在三个文件中分别配置接口和图片的路径,,,环境变量的命名规则： `REACT_APP_XXX`
3. 在代码中通过`process.env.xxxx`


# 封装了通用组件SearchHeader

1. 在common中新建文件夹，SearchHeader
2. 准备好结构和样式
3. 一定要接收一个cityName, 展示当前城市
4. 添加prop的校验， 字符串并且必填
5. 路由跳转会报错，只要是封装的通用组件，获取不到路由的信息，如果想要获取路由的信息，使用`withRouter`


# 在找房组件中使用SearchHeader

难点：如何给组件添加className,....要在组件的内容要使用props接收className

# classnames第三方包的使用

1. 方便我们处理类名的

2. 使用步骤
   1. 安装  yarn add classnames
   2. 导入  import classnames from 'classnames'
   3. 使用


3. 语法

```js
classnames('foo', 'bar') // foo bar 没有任何的意思 类似于中文里的 小明和小红

classnames( 'foo', {bar: true} )

classnames( 'foo' , ['bar', 'aaa'])

```


# Filter相关的组件封装

1. Filter: 负责整个的筛选栏的功能
2. FilterTitle: 负责显示 FilterPicker或者是FilterMore
3. FilterPicker: 收集 区域  方式  租金  条件
4. FilterMore: 收集自定义的筛选条件
5. FilterFooter: 公共的组件，在FilterPicker和FilterMore中都有
