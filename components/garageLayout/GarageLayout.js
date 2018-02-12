import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import RandomColor                      from 'randomcolor'

import SvgFromText from '../svgFromText/SvgFromText'
import Tooltip     from '../tooltip/Tooltip'
import RoundButton from '../buttons/RoundButton'

import styles from './GarageLayout.scss'

const COLOR_PALETE = [ '#803E75', '#FF6800', '#A6BDD7', '#C10020', '#CEA262', '#817066', '#007D34', '#F6768E', '#00538A', '#FF7A5C', '#53377A', '#FF8E00', '#B32851', '#7F180D', '#93AA00', '#593315', '#F13A13', '#232C16' ]
const INIT_STATE = {
  content: '',
  mouseX:  0,
  mouseY:  0,
  visible: false,
  floor:   -1, // index of selected floor
  rotate:  false
}

const GROUP_OFFSET_X = 20 // px
const GROUP_OFFSET_Y = GROUP_OFFSET_X // px

// floors:[
//   { label: string...
//     svg: string...
//     places: [
//       {label: string... , available: bool..., selected: bool... , tooltip: DOMelement..., group: string/number... }
//     ]
//   }
// ]
//
// onPlaceClick: function... - what happens on place select
// showEmptyFloors: bool... - floor with no available places will not be clickable


class GarageLayout extends Component {
  static propTypes = {
    floors:            PropTypes.array.isRequired, // array of all floors
    onPlaceClick:      PropTypes.func, // handling click on svg
    showEmptyFloors:   PropTypes.bool,
    unfold:            PropTypes.bool,
    showSecondaryMenu: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      ...INIT_STATE,
      floor: props.showEmptyFloors ? 0 : INIT_STATE.floor
    }
  }

  componentDidMount() {
    this.scanPlacesAddLabels()
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.showEmptyFloors && (this.state.floor === -1 || !(nextProps.floors[this.state.floor] && nextProps.floors[this.state.floor].free_places.length))) {
      this.setState({
        ...this.state,
        floor: nextProps.floors.findIndex(floor => floor.free_places.length)
      })
    }
  }

  componentDidUpdate() {
    this.props.floors.length !== 0 && this.props.floors.length < this.state.floor + 1 && this.setState({ ...this.state, floor: 0 })
    this.scanPlacesAddLabels()
  }

  prefixStyles(currentSvg, i) { // will go trought svg styles, prefixing them
    for (const styleTag of currentSvg.getElementsByTagName('style')) {
      styleTag.innerHTML.split('{')
      .reduce((acc, str) => [ ...acc, ...str.split('}') ], [])
      .map(str => str.trim())
      .filter((obj, index) => index % 2 === 0 && obj.length > 0 && obj[0] === '.' && !obj.includes('SVG_')) // is odd not zero-length class selector that doenst begin with SVG_
      .forEach(selector => {
        const newName = selector[0] + 'SVG_' + i + '_' + selector.substring(1)
        const className = selector.substring(1)
        while (currentSvg.getElementsByClassName(className)[0] !== undefined) {
          currentSvg.getElementsByClassName(className)[0].classList.add(newName.substring(1))
          currentSvg.getElementsByClassName(className)[0].classList.remove(className)
        }
        styleTag.innerHTML = styleTag.innerHTML.replace(selector, newName)
      })
    }
  }

  purgeElements(currentSvg) { // will remove elements that will be rerendered
    // remove free and selected classes
    while (currentSvg.getElementsByClassName(styles.gvFree).length >= 1) {
      currentSvg.getElementsByClassName(styles.gvFree)[0].classList.remove(styles.gvFree)
    }
    while (currentSvg.getElementsByClassName(styles.gvSelected).length >= 1) {
      currentSvg.getElementsByClassName(styles.gvSelected)[0].classList.remove(styles.gvSelected)
    }
    while (currentSvg.getElementsByClassName('hasColorGroup').length >= 1) {
      const element = currentSvg.getElementsByClassName('hasColorGroup')[0]
      element.classList.remove('hasColorGroup')
      element.removeAttribute('style')
    }
    while (currentSvg.getElementsByClassName('hasHeatGroup').length >= 1) {
      const element = currentSvg.getElementsByClassName('hasHeatGroup')[0]
      element.classList.remove('hasHeatGroup')
      element.removeAttribute('style')
    }
    while (currentSvg.getElementsByClassName('groupCircle').length >= 1) {
      currentSvg.getElementsByClassName('groupCircle')[0].remove()
    }
  }

  addLabel(place, label, el) {
    if (!el.getElementById('Text' + label)) { // if label doenst exist yet
      const xy = this.calculateCenter(place)

      const newElement = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      newElement.setAttribute('x', xy.x)
      newElement.setAttribute('y', xy.y)
      newElement.setAttribute('class', `${styles.gvText} ${styles.text}`)
      newElement.setAttribute('text-anchor', 'middle')
      newElement.setAttribute('id', 'Text' + label)
      newElement.setAttribute('dy', '0.25em')

      const textNode = document.createTextNode(label)
      newElement.appendChild(textNode)

      place.parentNode.appendChild(newElement)
    }
  }

  calculateCenter(element) {
    switch (element.tagName) {
      case 'polygon': {
        const pointPairs = element.getAttribute('points').split(' ')
        const xy = pointPairs.reduce((acc, pair) => ({
          x: acc.x + (+pair.split(',')[0] || 0),
          y: acc.y + (+pair.split(',')[1] || 0)
        }), { x: 0, y: 0 })

        return {
          x: xy.x / (pointPairs.length - 1),
          y: xy.y / (pointPairs.length - 1)
        }
      }

      case 'rect': return {
        x: +element.getAttribute('x') + (+element.getAttribute('width') / 2),
        y: +element.getAttribute('y') + (+element.getAttribute('height') / 2)
      }

      default: return { x: 0, y: 0 }
    }
  }

  colorizeSelectedPlaces(currentSvg, floor) { // color all selected Yellow
    floor.places
      .filter(place => place.selected)
      .forEach(place => {
        const placeRect = currentSvg.getElementById('Place' + place.label)
        placeRect && placeRect.classList.add(styles.gvSelected)
      })
  }

  colorizeAvailablePlaces(currentSvg, floor) { // color all available Blue
    floor.places
      .filter(place => place.available && !place.selected)
      .forEach(place => {
        const placeRect = currentSvg.getElementById('Place' + place.label)
        placeRect && placeRect.classList.add(styles.gvFree)
      })
  }

  colorizeGroupedPlaces(currentSvg, assignColors, floor) { // colorizes place with group with according colors
    floor.places
    .filter(place => place.group)
    .forEach(place => {
      const placeRect = currentSvg.getElementById('Place' + place.label)
      if (!Array.isArray(place.group) || (Array.isArray(place.group) && place.group.length === 1)) { // colorize Place rect
        placeRect && placeRect.classList.add('hasColorGroup')
        placeRect && placeRect.setAttribute('style', `fill: ${assignColors[Array.isArray(place.group) ? place.group[0] : place.group]};`)
      } else if (place.group.length >= 5) { // render circle with count in it
        const center = this.calculateCenter(placeRect)
        const y = GROUP_OFFSET_Y * 2
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle') // circle for count
        circle.setAttribute('r', 18)
        circle.setAttribute('cx', center.x)
        circle.setAttribute('cy', center.y + y)
        circle.setAttribute('style', 'fill: #5a5a5a;')
        circle.classList.add('groupCircle')
        circle.classList.add(styles.text)
        placeRect.parentNode.appendChild(circle)

        const count = document.createElementNS('http://www.w3.org/2000/svg', 'text') // text with count
        count.setAttribute('x', center.x)
        count.setAttribute('y', center.y + y)
        count.setAttribute('class', `${styles.gvText} ${styles.text} groupCircle`)
        count.setAttribute('text-anchor', 'middle')
        count.setAttribute('style', 'fill: white;')
        count.setAttribute('dy', '0.35em')
        count.appendChild(document.createTextNode(place.group.length))
        placeRect.parentNode.appendChild(count)
      } else { // render multiple circles with coresponding colors
        const center = this.calculateCenter(placeRect)
        place.group.forEach((group, i, arr) => {
          const x = arr.length === 3 && i === 2 ? // when count is three and group is tha last one
          0 :
          i % 2 === 0 ? // when is on the left
          -GROUP_OFFSET_X / 2 :
          GROUP_OFFSET_X / 2
          const y = i >= 2 ? GROUP_OFFSET_Y * 2 : GROUP_OFFSET_Y

          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          circle.setAttribute('style', `fill: ${assignColors[group]};`)
          circle.classList.add('groupCircle')
          circle.classList.add('text')
          circle.setAttribute('r', 8)
          circle.setAttribute('cx', center.x + x)
          circle.setAttribute('cy', center.y + y)
          placeRect.parentNode.appendChild(circle)
        })
      }
    })
  }

  mapValue(min, max, toMin, toMax, value) {
    return (((value - min) * (toMax - toMin)) / (max - min)) + toMin
  }

  colorizeHeatPlaces(currentSvg, floors) {
    const heatGroups = floors
      .reduce((acc, floor) => [ ...acc, ...(floor.places || []) ], [])
      .reduce((groups, place) => place.heat !== undefined ? [ ...groups, place.heat ] : groups, [])

    if (heatGroups && heatGroups.length) {
      const min = Math.min(...heatGroups)
      const max = Math.max(...heatGroups)

      floors.reduce((acc, floor) => [ ...acc, ...(floor.places || []) ], [])
        .filter(place => place.heat)
        .forEach(place => {
          const yellow = Math.round(this.mapValue(min, max, 255, 0, place.heat))
          const placeRect = currentSvg.getElementById('Place' + place.label)
          placeRect && placeRect.classList.add('hasHeatGroup')
          placeRect && placeRect.setAttribute('style', `fill: rgb(255, ${yellow}, 70);`)
        })
    }
  }

  addTooltips(currentSvg, floor) {
    floor.places
      .filter(place => place.tooltip)
      .forEach(place => {
        const placeRect = currentSvg.getElementById('Place' + place.label)
        if (placeRect) {
          placeRect.onmouseenter = () => { this.setState({ ...this.state, visible: place.tooltip && true, content: place.tooltip }) }
          placeRect.onmouseleave = () => { this.setState({ ...this.state, visible: false }) }
          placeRect.onmousemove = event => {
            const secondaryMenuCorrection = window.innerWidth > 1300 && (window.location.hash.includes('/admin/') || window.location.hash.includes('/analytics/'))
            this.setState({
              ...this.state,
              mouseX: event.clientX - (this.props.showSecondaryMenu || secondaryMenuCorrection ? 200 : 0) + 20,
              mouseY: event.clientY
            })
          }
        }
      })
  }

  scanPlacesAddLabels() { // add labels to all places
    const elements = document.getElementsByTagName('svg') // go trough all svgs - can be multiple on page

    for (let i = 0; i < elements.length; i++) {
      const currentSvg = elements[i]
      const gControl = currentSvg.getElementById('Gcontrol')
      const { floors } = this.props
      const { floor } = this.state

      // prefix styles
      if (elements.length > 1) this.prefixStyles(currentSvg, i)
      // remove old elements
      this.purgeElements(currentSvg)

      // add label to each Place
      gControl && Array.prototype.slice.call(gControl.childNodes).forEach(child => {
        (child.id || '').substring(0, 5) === 'Place' && this.addLabel(child, child.id.substring(5), currentSvg)
      })

      // colorize elements according to their heat
      this.colorizeHeatPlaces(currentSvg, floors)

      if (floors[floor] && floors[floor].places) {
        // color all selected Yellow and all available Blue
        this.colorizeSelectedPlaces(currentSvg, floors[floor])
        this.colorizeAvailablePlaces(currentSvg, floors[floor])

        // colorize elements with their groups
        const assignColors = assignColorsToGroups(floors)
        if (Object.keys(assignColors).length) this.colorizeGroupedPlaces(currentSvg, assignColors, floors[floor])

        // add tooltip event listeners
        this.addTooltips(currentSvg, floors[floor])
      }
    }
  }

  handleSVGClick = ({ target }) => {
    const { floors, onPlaceClick } = this.props
    const { floor } = this.state

    const id = target.getAttribute('id')
    if (id && id.substring(0, 5) === 'Place') {
      const place = floors[floor].places.find(p => p.label === id.substring(5))
      place && place.available && onPlaceClick(place)
    }
  }

  render() {
    const { floors, showEmptyFloors, unfold } = this.props
    const { floor } = this.state

    const prepareButtons = (floor, index) => {
      const onFloorClick = () => this.setState({ ...this.state, floor: index })
      return (
        <RoundButton
          key={index}
          content={floor.label}
          onClick={onFloorClick}
          type="action"
          state={this.state.floor === index ? 'selected' : (!showEmptyFloors && floor.places && floor.places.findIndex(place => place.available) === -1 && 'disabled')}
        />
      )
    }

    const prepareFloors = floor => <SvgFromText svg={floor.scheme || ''} svgClick={this.handleSVGClick} />

    return (
      unfold === true ? <div className={styles.grayBackground}>
        {floors.map(prepareFloors)}
      </div> :
      <div ref={'containerDiv'}>
        <div className={styles.buttons}>
          <div>{floors.map(prepareButtons)}</div>
          <div>
            <RoundButton content={<i className="fa fa-refresh" aria-hidden="true" />} onClick={() => { this.setState({ ...this.state, rotate: !this.state.rotate }) }} state="action" />
          </div>
        </div>
        <div className={styles.svgContainer}>
          <SvgFromText svg={(floors[floor] && floors[floor].scheme) || ''} svgClick={this.handleSVGClick} rotate={this.state.rotate} />
        </div>

        {Tooltip(this.state)}
      </div>
    )
  }
}

export function assignColorsToGroups(floors) { // will find unique groups and assigns them colors
  const uniqueGroups = floors
    .reduce((acc, floor) => [ ...acc, ...(floor.places || []).map(place => place.group).filter(o => o) ], [])
    .reduce((acc, group) => [ ...acc, ...(Array.isArray(group) ? group : [ group ]) ], []) // flatten arrays
    .filter((group, index, arr) => arr.indexOf(group) === index) // unique values
    .sort((a, b) => a - b)

  const colors = COLOR_PALETE.length >= uniqueGroups.length ?
    COLOR_PALETE.slice(0, uniqueGroups.length) :
    COLOR_PALETE.concat(RandomColor({ count: uniqueGroups.length - COLOR_PALETE.length, luminosity: 'light', seed: 'as32d165q4' }))

  return uniqueGroups.reduce((assign, group, index) => ({ ...assign, [group]: colors[index] }), {})
}

export default connect(
  state => ({ showSecondaryMenu: state.pageBase.showSecondaryMenu }),
  () => ({ actions: {} })
)(GarageLayout)
