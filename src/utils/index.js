// 这个模块会导出很多的一些工具函数

/* 
  功能：获取当前的城市信息
    1. 优先从本地缓存中获取当前的城市数据（包含城市名称和城市的id）
    2. 如果本地缓存中存在，那么就直接返回本地缓存中的数据
    3. 如果本地缓存中不存在，那么就使用百度地图的API获取到地位城市，并且发送ajax请求获取当前城市的详细
    4. 把获取到的城市信息数据存储到本地缓存中，方便下次使用
  
  参数：不需要
  返回值：当前的城市信息
*/
import axios from 'axios'

// export function getCurrentCity() {
//   const city = localStorage.getItem('current_city')

//   if (!city) {
//     // 缓存中没有城市数据
//     const myCity = new window.BMap.LocalCity()
//     myCity.get(async result => {
//       const name = result.name
//       // 发送ajax请求，获取详细信息
//       const res = await axios.get('http://localhost:8080/area/info', {
//         params: {
//           name: name
//         }
//       })
//       console.log(res.data.body)
//       // 存储到本地缓存
//       localStorage.setItem('current_city', JSON.stringify(res.data.body))

//       // 返回这个数据

//     })
//   } else {
//     // 缓存中有城市数据， 直接返回这个城市数据即可
//   }
// }
// 不会改变的量：常量
const CURRENT_CITY = 'current_city'

// 获取城市
function getCity() {
  return JSON.parse(localStorage.getItem(CURRENT_CITY))
}

// 设置城市
function setCity(city) {
  localStorage.setItem(CURRENT_CITY, JSON.stringify(city))
}

export function getCurrentCity() {
  const city = getCity()

  if (!city) {
    // 异步的操作
    return new Promise((resolve, reject) => {
      const myCity = new window.BMap.LocalCity()

      // 百度地图定位当前城市
      myCity.get(result => {
        const name = result.name
        // 当前城市发送ajax请求，获取数据
        axios
          .get('http://localhost:8080/area/info', {
            params: {
              name: name
            }
          })
          .then(res => {
            const { body } = res.data
            // 存储到本地缓存中
            setCity(body)
            // 把成功的结果交给了resolve
            resolve(body)
          })
          .catch(err => {
            reject(err)
          })
      })
    })
  } else {
    // 缓存中有城市数据， 直接返回一个promise对象，这个promise对象只会成功的
    // return new Promise((resolve, reject) => {
    //   resolve(city)
    // })
    return Promise.resolve(city)
  }
}
