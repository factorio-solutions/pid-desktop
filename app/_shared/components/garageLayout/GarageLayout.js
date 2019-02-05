import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import RandomColor from 'randomcolor'

import detectIE from '../../helpers/internetExplorer'

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

const IS_IE = detectIE()

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
    showSecondaryMenu: PropTypes.bool,
    placeId:           PropTypes.number
  }

  constructor(props) {
    super(props)
    this.state = {
      ...INIT_STATE,
      floor: props.showEmptyFloors ? 0 : INIT_STATE.floor
    }
    this.purgeElements = this.purgeElements.bind(this)
    this.scanPlacesAddLabels = this.scanPlacesAddLabels.bind(this)
  }

  componentDidMount() {
    this.scanPlacesAddLabels()
  }

  componentWillReceiveProps(nextProps) {
    const { floor } = this.state
    const { showEmptyFloors } = this.props
    if (
      !showEmptyFloors
      && (
        floor === -1
        || !(
          nextProps.floors[floor]
          && nextProps.floors[floor].free_places.length
        )
      )
    ) {
      this.setState(state => ({
        ...state,
        floor: nextProps.floors.findIndex(floor => floor.free_places.length)
      }))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { floors, placeId } = this.props
    const { floor } = this.state
    if (floors.length !== 0 && floors.length < floor + 1 && prevState.floor !== 0) {
      this.setState(state => ({ ...state, floor: 0 }))
    } else if (placeId && prevProps.placeId !== placeId && floors) {
      const floorIndex = floors.findIndex(f => f.places.some(place => place.selected))
      if (floorIndex !== prevState.floor && floorIndex > -1) {
        this.setState(state => ({ ...state, floor: floorIndex }))
      }
    }
    this.scanPlacesAddLabels()
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

  prefixStyles(currentSvg, i) { // will go trought svg styles, prefixing them
    Array.from(currentSvg.getElementsByTagName('style')).forEach(styleTag => {
      styleTag.innerHTML.split('{')
        .reduce((acc, str) => [ ...acc, ...str.split('}') ], [])
        .map(str => str.trim())
        // is odd not zero-length class selector that doenst begin with SVG_
        .filter((obj, index) => (
          index % 2 === 0
          && obj.length > 0
          && obj[0] === '.'
          && !obj.includes('SVG_')
        ))
        .forEach(selector => {
          const newName = selector[0] + 'SVG_' + i + '_' + selector.substring(1)
          const className = selector.substring(1)
          Array.from(currentSvg.getElementsByClassName(className)).forEach(element => {
            element.classList.add(newName.substring(1))
            this.removeElementClass(element, className)
          })
          styleTag.innerHTML = styleTag.innerHTML.replace(selector, newName)
        })
    })
  }

  purgeElements(currentSvg) { // will remove elements that will be rerendered
    // remove free and selected classes
    const mainElement = IS_IE ? document : currentSvg
    let elements = Array.from(mainElement.getElementsByClassName(styles.gvFree))
    elements.forEach(element => {
      this.removeElementClass(element, styles.gvFree)
    })

    elements = Array.from(mainElement.getElementsByClassName(styles.gvSelected))
    elements.forEach(element => {
      this.removeElementClass(element, styles.gvSelected)
    })

    elements = Array.from(mainElement.getElementsByClassName('hasColorGroup'))
    elements.forEach(element => {
      this.removeElementClass(element, 'hasColorGroup')
      element.removeAttribute('style')
    })

    elements = Array.from(mainElement.getElementsByClassName('hasHeatGroup'))
    elements.forEach(element => {
      this.removeElementClass(element, 'hasHeatGroup')
      element.removeAttribute('style')
    })

    elements = Array.from(mainElement.getElementsByClassName('groupCircle'))
    elements.forEach(element => {
      element.remove()
    })
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
        if (IS_IE) {
          if (placeRect) { placeRect.className.baseVal += ` ${styles.gvSelected}` }
        } else {
          placeRect && placeRect.classList.add(styles.gvSelected)
        }
      })
  }

  colorizeAvailablePlaces(currentSvg, floor) { // color all available Blue
    floor.places
      .filter(place => place.available && !place.selected)
      .forEach(place => {
        const placeRect = currentSvg.getElementById('Place' + place.label)
        if (IS_IE) {
          if (placeRect) { placeRect.className.baseVal += ` ${styles.gvFree}` }
        } else {
          placeRect && placeRect.classList.add(styles.gvFree)
        }
      })
  }

  colorizeGroupedPlaces(currentSvg, assignColors, places) { // colorizes place with group with according colors
    places
      .filter(place => place.group)
      .forEach(place => {
        const placeRect = currentSvg.getElementById('Place' + place.label)
        if (placeRect) {
          if (!Array.isArray(place.group)) { // colorize Place rect
            place.group = [ place.group ]
          }

          if (place.group.length >= 5) { // render circle with count in it
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
              const x = (arr.length === 3 && i === 2) || arr.length === 1
              // when count is three and group is tha last one or only one circle is being rendered
                ? 0
                : i % 2 === 0
                  // when is on the left
                  ? -GROUP_OFFSET_X / 2
                  : GROUP_OFFSET_X / 2
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
        }
      })
  }

  mapValue(min, max, toMin, toMax, value) {
    return (((value - min) * (toMax - toMin)) / (max - min)) + toMin
  }

  colorizeHeatPlaces(currentSvg, floors) {
    const heatGroups = floors
      .reduce((acc, floor) => [ ...acc, ...(floor.places || []) ], [])
      .reduce((groups, place) => (place.heat !== undefined ? [ ...groups, place.heat ] : groups), [])

    if (heatGroups && heatGroups.length) {
      const min = Math.min(...heatGroups)
      const max = Math.max(...heatGroups)

      const floorOfCurrentSvg = floors.find(floor => currentSvg.parentElement.classList.contains(`id-${floor.id}`))
      const places = floorOfCurrentSvg ? floorOfCurrentSvg.places : []
      places
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
          placeRect.onmouseenter = () => this.setState({ ...this.state, visible: place.tooltip && true, content: place.tooltip })
          placeRect.onmouseleave = () => this.setState({ ...this.state, visible: false })
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
    const elements = Array.from(document.getElementsByTagName('svg')) // go trough all svgs - can be multiple on page)
    // const elements = document.getElementsByClassName('svgFromText') // go trough all svgs - can be multiple on page

    elements.forEach((currentSvg, i) => {
      const gControl = currentSvg.getElementById('Gcontrol')
      const { floors } = this.props
      const { floor } = this.state

      // prefix styles
      if (elements.length > 1) this.prefixStyles(currentSvg, i)
      // remove old elements
      this.purgeElements(currentSvg)

      // add label to each Place
      gControl && Array.from(gControl.childNodes).forEach(child => {
        (child.id || '').substring(0, 5) === 'Place'
        && this.addLabel(child, child.id.substring(5), currentSvg)
      })

      // colorize elements according to their heat
      this.colorizeHeatPlaces(currentSvg, floors)

      if (floors[floor] && floors[floor].places) {
        // color all selected Yellow and all available Blue
        this.colorizeSelectedPlaces(currentSvg, floors[floor])
        this.colorizeAvailablePlaces(currentSvg, floors[floor])

        // colorize elements with their groups
        const assignColors = assignColorsToGroups(floors)

        if (Object.keys(assignColors).length) {
          const floorOfCurrentSvg = floors.find(currentSvgFloor => {
            if (IS_IE) {
              return currentSvg.parentNode.className.includes(`id-${currentSvgFloor.id}`)
            } else {
              return currentSvg.parentElement.classList.contains(`id-${currentSvgFloor.id}`)
            }
          })
          const places = floorOfCurrentSvg ? floorOfCurrentSvg.places : []
          this.colorizeGroupedPlaces(currentSvg, assignColors, places)
        }

        // add tooltip event listeners
        this.addTooltips(currentSvg, floors[floor])
      }
    })
  }

  prepareButtons = (floor, index) => {
    const { floor: stateFloor } = this.state
    const { showEmptyFloors } = this.props
    const onFloorClick = () => this.setState(state => ({ ...state, floor: index }))
    return (
      <RoundButton
        key={index}
        content={floor.label}
        onClick={onFloorClick}
        type="action"
        state={stateFloor === index
          ? 'selected'
          : (
            !showEmptyFloors
            && floor.places
            && !floor.places.some(place => place.available) && 'disabled'
          )}
      />
    )
  }

  prepareFloors = floor => (
    <SvgFromText
      identfier={floor.id}
      svg={floor.scheme || ''}
      svgClick={this.handleSVGClick}
    />
  )

  removeElementClass(element, className) {
    const removeFromArray = (array, toFind) => {
      let index = array.indexOf(toFind)
      while (index > -1) {
        array.splice(index, 1)
        index = array.indexOf(toFind)
      }
    }

    if (IS_IE) {
      const classes = element.className.baseVal.split(' ')
      removeFromArray(classes, className)
      element.className.baseVal = classes.join(' ')
    } else {
      element.classList.remove(className)
    }
  }

  render() {
    const { floors, unfold } = this.props
    const { floor } = this.state

    return (
      unfold
        ? (
          <div className={styles.grayBackground}>
            {floors.map(this.prepareFloors)}
          </div>
        )
        : (
          <div ref={ref => this.containerDiv = ref}>
            <div className={styles.buttons}>
              <div>{floors.map(this.prepareButtons)}</div>
              {(floors.length !== 0) && (
                <div>
                  <RoundButton
                    content={<i className="fa fa-repeat" aria-hidden="true" />}
                    onClick={() => {
                      this.setState(state => ({ ...state, rotate: !state.rotate }))
                    }}
                    state="action"
                  />
                </div>
              )}
            </div>
            <div className={styles.svgContainer}>
              <SvgFromText
                identfier={floors[floor] && floors[floor].id}
                svg={(floors[floor] && floors[floor].scheme) || ''}
                svgClick={this.handleSVGClick}
                rotate={this.state.rotate}
              />
            </div>

            {Tooltip(this.state)}
          </div>
        )
    )
  }
}

// will find unique groups and assigns them colors
export function assignColorsToGroups(floors) {
  const uniqueGroups = floors
    .reduce((acc, floor) => {
      return [
        ...acc,
        ...(floor.places || [])
          .map(place => place.group)
          .filter(o => o)
      ]
    }, [])
    // flatten arrays
    .reduce((acc, group) => [
      ...acc,
      ...(Array.isArray(group) ? group : [ group ])
    ], [])
    // unique values
    .filter((group, index, arr) => arr.indexOf(group) === index)
    // .sort((a, b) => a - b)

  const colors = COLOR_PALETE.length >= uniqueGroups.length
    ? COLOR_PALETE.slice(0, uniqueGroups.length)
    : COLOR_PALETE.concat(RandomColor({
      count:      uniqueGroups.length - COLOR_PALETE.length,
      luminosity: 'light',
      seed:       'as32d165q4'
    }))

  return uniqueGroups.reduce((assign, group, index) => ({ ...assign, [group]: colors[index] }), {})
}

export default connect(
  state => ({ showSecondaryMenu: state.pageBase.showSecondaryMenu }),
  () => ({ actions: {} })
)(GarageLayout)
