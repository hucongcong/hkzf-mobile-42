import React from 'react'
import { BASE_URL } from 'utils'
import { withRouter } from 'react-router-dom'
import styles from './index.module.scss'
// 函数组件的渲染效率要比类组件高
function HouseItem({ item, style, history }) {
  return (
    <div
      className={styles.house}
      style={style}
      onClick={() => history.push(`/detail/${item.houseCode}`)}
    >
      <div className="imgWrap">
        <img className="img" src={`${BASE_URL}${item.houseImg}`} alt="" />
      </div>
      <div className="content">
        <h3 className="title">{item.title}</h3>
        <div className="desc">{item.desc}</div>
        <div>
          {item.tags.map((item, index) => {
            const num = (index % 3) + 1
            const name = `tag tag${num}`
            return (
              <span className={name} key={item}>
                {item}
              </span>
            )
          })}
        </div>
        <div className="price">
          <span className="priceNum">{item.price}</span> 元/月
        </div>
      </div>
    </div>
  )
}

export default withRouter(HouseItem)
