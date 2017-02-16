import React, { Component, PropTypes }  from 'react'

import SvgFromText from '../SvgFromText/SvgFromText'
import Tooltip     from '../Tooltip/Tooltip'
import ButtonStack from '../buttonStack/ButtonStack'
import RoundButton from '../buttons/RoundButton'

import styles from './GarageLayout.scss'

const INIT_STATE = { content: ''
                   , mouseX:  0
                   , mouseY:  0
                   , visible: false
                   }


export default class GarageLayout extends Component {
  static propTypes = {
    svg:                   PropTypes.string.isRequired, // svg in string
    floors:                PropTypes.array.isRequired, // array of all floors
    onPlaceClick:          PropTypes.func, // handling click on svg
    onFloorClick:          PropTypes.func, // handling changing floor
    activeFloor:           PropTypes.number, // index of active floor
    activePlaces:          PropTypes.array, // array of objects [{label ... }]
    reservations:          PropTypes.array, // is array of currently ongoing reservations
    availableFloorsPlaces: PropTypes.array
  }

  constructor(props) {
     super(props)
     this.state = INIT_STATE
  }

  componentDidMount(){
    this.scanPlacesAddLabels()
    this.prepare()
  }

  componentDidUpdate(prevProps){
    if (!(prevProps.svg == this.props.svg)){
      this.scanPlacesAddLabels()
    }
    this.prepare()
  }

  scanPlacesAddLabels(){
    if (document.getElementById('Gcontrol')){
      for (var i = 0; i < document.getElementById('Gcontrol').childNodes.length; i++) {
        if ((document.getElementById('Gcontrol').childNodes[i].id || '').substring(0,5) == 'Place'){
          this.addLabel(document.getElementById('Gcontrol').childNodes[i], document.getElementById('Gcontrol').childNodes[i].id.substring(5))
        }
      }
    }
  }

  addLabel(place, label){
    var x = 0
    var y = 0
    switch (place.tagName) {
      case 'polygon':
        var points = place.getAttribute('points').split(' ')
          , sumaX = 0
          , sumaY = 0
          , count = points.length
        for (var i = 0; i < count; i++) {
            var xy = points[i].split(',')
            sumaX += parseFloat(xy[0])||0
            sumaY += parseFloat(xy[1])||0
          }
        x = sumaX/(count-1)
        y = sumaY/(count-1)
        break;
      case 'rect':
        x = parseFloat(place.getAttribute('x')) + parseFloat(place.getAttribute('width'))/2
        y = parseFloat(place.getAttribute('y')) + parseFloat(place.getAttribute('height'))/2
        break
    }

    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text')
    newElement.setAttributeNS(null, "x",           x)
    newElement.setAttributeNS(null, "y",           y)
    newElement.setAttributeNS(null, "class",       `${styles.gvText} ${styles.text}`)
    newElement.setAttributeNS(null, "text-anchor", 'middle')
    newElement.setAttributeNS(null, "id",          'Text'+label)
    newElement.setAttributeNS(null, "dy",          '0.25em')

    var textNode = document.createTextNode(label);
    newElement.appendChild(textNode);

    place.parentNode.appendChild(newElement)
  }

  prepare() {
    while (document.getElementsByClassName(styles.gvFree).length >= 1) {
      document.getElementsByClassName(styles.gvFree)[0].classList.remove(styles.gvFree)
    }
    while (document.getElementsByClassName(styles.gvSelected).length >= 1) {
      document.getElementsByClassName(styles.gvSelected)[0].classList.remove(styles.gvSelected)
    }

    // Color available places blue
    const { availableFloorsPlaces, activeFloor } = this.props
    const availablePlaces = activeFloor != -1 && availableFloorsPlaces[activeFloor] ? availableFloorsPlaces[activeFloor].free_places : []
    for (var i = 0; i < availablePlaces.length; i++) {
      if (document.getElementById('Place'+availablePlaces[i].label) ){
        document.getElementById('Place'+availablePlaces[i].label).classList.add(styles.gvFree)
      }
    }

    // If reservations specified, git places tooltips
    const { reservations } = this.props
    if (reservations!=undefined) {
      for (var i = 0; i < reservations.length; i++) {
        var place = document.getElementById('Place'+reservations[i].place.label)
        if (place) {
          place.classList.add(styles.gvOccupied)

          place.onmouseenter = function(res){
            this.setState({ ...this.state
              , visible: true
              , content:  <div>
              <div><b>Place {res.place.label}</b></div>
              <div> {res.user.full_name} </div>
              <div> {res.begins_at} => {res.ends_at} </div>
              </div>
            })
          }.bind(this, reservations[i])

          place.onmouseleave = function(event){
            this.setState({ ...this.state, visible:false })
          }.bind(this)

          place.onmousemove = function(event){
            this.setState({ ...this.state, mouseX: event.clientX, mouseY: event.clientY })
          }.bind(this)
        }
      }
    }

    // active places highlight
    const { activePlaces } = this.props
    activePlaces && activePlaces.forEach(function(place){
      if (place) {
        let activePlaceelem = document.getElementById('Place'+place.label)
        if (activePlaceelem!=undefined){
          activePlaceelem.classList.remove(styles.gvFree)
          activePlaceelem.classList.add(styles.gvSelected)
        }
      }
    })
  }

  handleSVGClick({ target }) {
    const { availableFloorsPlaces, activeFloor, onPlaceClick, activePlaces } = this.props

    const availablePlaces = availableFloorsPlaces[activeFloor].free_places.concat(activePlaces)
    if (target.getAttribute('id') && target.getAttribute('id').substring(0,5)=='Place'){
      if (availablePlaces.findIndex((place)=>{return place.label == target.getAttribute('id').substring(5)}) != -1){
        var place = availablePlaces.find((place)=>{return place.label == target.getAttribute('id').substring(5)})
        if (place != undefined) {
          onPlaceClick(place)
        }
      }
    }
  }

  render(){
    const { svg, floors, onFloorClick, activeFloor, availableFloorsPlaces } = this.props
    const prepareButtons = (floor, index, arr) => {
      return(
        <RoundButton key={index} content={floor} onClick={onFloorClick.bind(this, index)} state={index==activeFloor ? 'selected' : availableFloorsPlaces[index] && availableFloorsPlaces[index].free_places.length == 0 && 'disabled'} />
      )
    }

    const divider = <span> </span>

    return(
      <div className={styles.widthContainer}>
        <div className={`${styles.width78} ${styles.svgContainer}`}>
          <SvgFromText svg={svg} svgClick={::this.handleSVGClick} />
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
