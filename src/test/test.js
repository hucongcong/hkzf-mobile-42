const fs = require('fs')

// 封装一个函数  read

// 回调方法  回调地狱
// promise
function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

// 将来如果需要发送多个请求，可以使用到promise.all
const p = Promise.race([read('a.txt'), read('b.txt'), read('c.txt')])

p.then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})

// read('a.txt')

/* 
  p.then().catch()
  Promise有4个静态方法


  Promise.all()
  Promise.race()
  Promise.resolve()
  Promise.reject()
*/

// 返回一个promise对象，而且，这个对象的结果一定是成功的
// Promise.resolve(11)

// const p = new Promise((resolve, reject) => {
//   resolve(11)
// })

// const p = new Promise(resolve => resolve(11))
// const p = Promise.resolve(11)

// p.then(res => {
//   console.log(res)
// })

// Promise.reject('失败了')
// const p = Promise.reject('失败了')
// const p = new Promise((resolve, reject) => reject('失败了'))
// p.catch(err => {
//   console.log(err)
// })

// Promise.all([p1, p2, p3, p4])  Promise.all会返回一个新的promise， 只有所有的promise都成功了，这个promise对象就是成功的 ，，否则promise对象的结果就是失败的

// Promise.race([p1, p2, p3])  返回一个promise对象，结果只会取决于第一个完成的promise, 只要有一个promise结束，整个promise就结束了
