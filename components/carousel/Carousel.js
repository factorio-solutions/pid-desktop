import React, { Component, PropTypes } from 'react'
import Swiper                          from 'swiper'

import styles from './Carousel.scss'
import '../../../../node_modules/swiper/dist/css/swiper.min.css'


export default class Carousel extends Component {
  static propTypes = {
    images: PropTypes.array,
    width:  PropTypes.string,
    height: PropTypes.string
  }

  componentDidMount(){
    var mySwiper = new Swiper ('.swiper-container', {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      grabCursor: true,
      // turn on pagination
      pagination: '.swiper-pagination',
      paginationClickable: true,
      // turn on butotns
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev'
    })
  }

  render() {
    const { images, width, height } = this.props

    const prepareImages = (img, index) => {
      return (
        <div key={index} className='swiper-slide'>
          <div className={styles.img} >
            <img src={img}/>
          </div>
        </div>
      )
    }

    return (
      <div className="swiper-container" style={{width: width, height: height}}>
        <div className="swiper-wrapper">
          {images.map(prepareImages)}
        </div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-pagination"></div>
      </div>
    )
  }
}
