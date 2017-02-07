import React, { Component, PropTypes }  from 'react'

import SvgFromText from '../svgFromText/SvgFromText'
import Tooltip     from '../tooltip/Tooltip'
import ButtonStack from '../buttonStack/ButtonStack'
import RoundButton from '../buttons/RoundButton'

import styles from './GarageLayout.scss'

const INIT_STATE = { content: ''
                   , mouseX:  0
                   , mouseY:  0
                   , visible: false
                   , floor:   0 // index of selected floor
                   }

// floors:[
//   { label: string...
//     svg: string...
//     places: [
//       {label: string... , available: bool..., selected: bool... , tooltip: DOMelement... }
//     ]
//   }
// ]
//
// onPlaceClick: function... - what happens on place select
// showEmptyFloors: bool... - floor with no available places will not be clickable


export default class GarageLayout extends Component {
  static propTypes = {
    floors:          PropTypes.array.isRequired, // array of all floors
    onPlaceClick:    PropTypes.func, // handling click on svg
    showEmptyFloors: PropTypes.bool
  }

  constructor(props) {
     super(props)
     this.state = INIT_STATE
  }

  componentDidMount(){
    this.scanPlacesAddLabels()
  }

  componentDidUpdate(prevProps){
    this.scanPlacesAddLabels()
  }

  scanPlacesAddLabels(){
    // add labels to all places
    let gControl = document.getElementById('Gcontrol')
    gControl && document.getElementById('Gcontrol').childNodes.forEach((child)=>{
        (child.id || '').substring(0,5) == 'Place' && this.addLabel(child, child.id.substring(5))
    })

    // remove free and selected classes
    while (document.getElementsByClassName(styles.gvFree).length >= 1) {
      document.getElementsByClassName(styles.gvFree)[0].classList.remove(styles.gvFree)
    }
    while (document.getElementsByClassName(styles.gvSelected).length >= 1) {
      document.getElementsByClassName(styles.gvSelected)[0].classList.remove(styles.gvSelected)
    }


    let { floors } = this.props
    let { floor } = this.state

    // color all selected Yellow
    floors[floor] && floors[floor].places && floors[floor].places
      .filter((place) => { return place.selected})
      .forEach((place)=>{
        let placeRect = document.getElementById('Place'+place.label)
        placeRect && placeRect.classList.add(styles.gvSelected)
      })

    // color all available blue
    floors[floor] && floors[floor].places && floors[floor].places
      .filter((place) => { return place.available && !place.selected})
      .forEach((place)=>{
        let placeRect = document.getElementById('Place'+place.label)
        placeRect && placeRect.classList.add(styles.gvFree)
      })

    // add tooltip event listeners
    floors[floor] && floors[floor].places && floors[floor].places
      .filter((place) => { return place.tooltip })
      .forEach((place) =>{
        let placeRect = document.getElementById('Place'+place.label)
        if (placeRect) {
          placeRect.onmouseenter = () => { this.setState({ ...this.state, visible: place.tooltip && true, content: place.tooltip }) }
          placeRect.onmouseleave = () => { this.setState({ ...this.state, visible:false }) }
          placeRect.onmousemove = (event) => { this.setState({ ...this.state, mouseX: event.clientX, mouseY: event.clientY }) }
        }

      })
  }

  addLabel(place, label){
    if (!document.getElementById('Text'+label)){ // if label doenst exist yet
      let x = 0, y = 0
      switch (place.tagName) {
        case 'polygon':
          place.getAttribute('points').split(' ').forEach((pointPair)=>{
            const xy = pointPair.split(',')
            x += +xy[0] || 0
            y += +xy[1] || 0
          })
          const length = place.getAttribute('points').split(' ').length-1
          x /= length
          y /= length
          break
        case 'rect':
          x = (+place.getAttribute('x')) + (+place.getAttribute('width'))/2
          y = (+place.getAttribute('y')) + (+place.getAttribute('height'))/2
          break
      }

      var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text')
      newElement.setAttributeNS(null, "x",           x)
      newElement.setAttributeNS(null, "y",           y)
      newElement.setAttributeNS(null, "class",       `${styles.gvText} ${styles.text}`)
      newElement.setAttributeNS(null, "text-anchor", 'middle')
      newElement.setAttributeNS(null, "id",          'Text'+label)
      newElement.setAttributeNS(null, "dy",          '0.25em')

      var textNode = document.createTextNode(label)
      newElement.appendChild(textNode)

      place.parentNode.appendChild(newElement)
    }
  }


  render(){
    const divider = <span> </span>
    let { floors, onPlaceClick, showEmptyFloors } = this.props
    let { floor } = this.state

    const prepareButtons = (floor, index, arr) => {
      const onFloorClick = () => { this.setState({...this.state, floor: index}), ()=>{ this.scanPlacesAddLabels() } }
      return(
        <RoundButton key={index} content={floor.label} onClick={onFloorClick} state={this.state.floor === index ? 'selected' : (!showEmptyFloors && floor.places.findIndex((place)=>{return place.available == true}) > 0 && 'disabled')} />
      )
    }

    const handleSVGClick = ({ target }) => {
      let id = target.getAttribute('id')
      if (id && id.substring(0,5)=='Place' ){
        let place = floors[floor].places.find((place)=>{return place.label === id.substring(5)})
        place && place.available && onPlaceClick(place)
      }
    }

    return(
      <div className={styles.widthContainer}>
        <div className={`${styles.width78} ${styles.svgContainer}`}>
          <SvgFromText svg={floors[floor] && floors[floor].scheme || ''} svgClick={handleSVGClick} />
        </div>
        <div className={styles.width18}>
          <ButtonStack divider={divider}>
            {floors.map(prepareButtons)}
          </ButtonStack>

          {Tooltip(this.state)}
        </div>
      </div>
    )
  }
}
