// import Axios from 'axios'

/* 
  1. 创建一个promise对象
    new Promise()
    Promise.resolve() 只会成功 .then()
    Promise.reject()  只会失败 .catch()
    Promise.all()     要所有的promise都成功，最终才会成功， 只有有失败，就是失败  整合多个promise
    Promise.race()    只要有一个成功了或者失败了， race:竞速 取决于第一个完成的
*/

// 承诺
// 在promise内部，一定不会对结果进行处理
// 承诺如果成功了，调用resolve   如果失败了，调用reject
// 适用于异步代码， 异步代码不是立即就执行，一会才会得到结果
// 1秒后得到一个随机数，如果随机数大于0.5 成功  如果随机数小于0.5  失败
// const p = new Promise((resolve, reject) => {
//   setTimeout(function() {
//     const num = Math.random()
//     if (num >= 0.5) {
//       resolve(num)
//     } else {
//       reject(num)
//     }
//   }, 1000)
// })
// p.then(res => {
//   console.log('成功了')
//   console.log(res)
// }).catch(err => {
//   console.log('失败了')
//   console.log(err)
// })
// async function fn() {
//   try {
//     const num = await p
//     console.log(num)
//   } catch (e) {
//     console.log('失败了', e)
//   }
// }
// const result = fn()
// console.log(result)

// 思路：
// 1. 先从localStorage中获取城市信息
// 2. 判断城市信息是否有
// 3. 如果有，直接返回一个 只会成功的Promise
// 4. 如果没有， 返回一个promise  异步的操作  百度定位   发送请求

// function getCity() {}
// getCity()
// function setCity(city) {}
// setCity(1)
// function getCurrentCity() {
//   const city = localStorage.getItem('current_city')
//   if (city) {
//     return Promise.resolve(JSON.parse(city))
//   }

//   return new Promise((resolve, reject) => {
//     // 百度定位
//     const myCity = new window.BMap.LocalCity()
//     myCity.get(result => {
//       const name = result.name
//       // 发送ajax请求
//       Axios.get(`/api/getcity?name=${name}`)
//         .then(res => {
//           // 需要把城市信息存一份
//           localStorage.setItem('current_city', JSON.stringify(res.data.body))
//           resolve(res.data.body)
//         })
//         .catch(err => {
//           reject(err)
//         })
//     })
//   })
// }
// getCurrentCity()

async function fn() {
  const num = await 1
  console.log(num)
  return num + 1
}

async function fn1() {
  const result = await fn()
  console.log(result)
}

fn1()
