import { API } from './api'

const CURRENT_CITY = 'current_city'

// 获取城市
function getCity() {
  return JSON.parse(localStorage.getItem(CURRENT_CITY))
}

// 设置城市
export function setCity(city) {
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
        API.get('area/info', {
          params: {
            name: name
          }
        })
          .then(res => {
            const { body } = res
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
