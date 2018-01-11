import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import RandomColor                      from 'randomcolor'

import SvgFromText from '../svgFromText/SvgFromText'
import Tooltip     from '../tooltip/Tooltip'
import ButtonStack from '../buttonStack/ButtonStack'
import RoundButton from '../buttons/RoundButton'

import styles from './GarageLayout.scss'

const COLOR_PALETE = [ '#803E75', '#FF6800', '#A6BDD7', '#C10020', '#CEA262', '#817066', '#007D34', '#F6768E', '#00538A', '#FF7A5C', '#53377A', '#FF8E00', '#B32851', '#7F180D', '#93AA00', '#593315', '#F13A13', '#232C16' ]
const INIT_STATE = {
  content: '',
  mouseX:  0,
  mouseY:  0,
  visible: false,
  floor:   0, // index of selected floor
  rotate:  false
}

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
    this.state = INIT_STATE
  }

  componentDidMount() {
    this.scanPlacesAddLabels()
  }

  componentDidUpdate(prevProps) {
    this.props.floors.length !== 0 && this.props.floors.length < this.state.floor + 1 && this.setState({ ...this.state, floor: 0 })
    this.scanPlacesAddLabels()
  }

  scanPlacesAddLabels() {
    // add labels to all places
    const elements = document.getElementsByTagName('svg') // go trough all svgs - can be multiple on page

    for (let i = 0; i < elements.length; i++) {
      const currentSvg = elements[i]

      // scan styles and prefix them
      if (elements.length > 1) { // dont do if there is only one svg
        for (const styleTag of currentSvg.getElementsByTagName('style')) {
          styleTag.innerHTML.split('{')
          .reduce((acc, str) => { return [ ...acc, ...str.split('}') ] }, [])
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

      const gControl = currentSvg.getElementById('Gcontrol')

      // const labelChildren = child => {
      //   (child.id || '').substring(0, 5) == 'Place' && this.addLabel(child, child.id.substring(5), currentSvg)
      // }

      gControl && Array.prototype.slice.call(currentSvg.getElementById('Gcontrol').childNodes).forEach(child => { // convert childNodet to array cuz of Safari
        (child.id || '').substring(0, 5) === 'Place' && this.addLabel(child, child.id.substring(5), currentSvg)
      })

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


      const { floors } = this.props
      const { floor } = this.state

      // color all selected Yellow
      floors[floor] && floors[floor].places && floors[floor].places
        .filter(place => { return place.selected })
        .forEach(place => {
          const placeRect = currentSvg.getElementById('Place' + place.label)
          placeRect && placeRect.classList.add(styles.gvSelected)
        })

      // color all available blue
      floors[floor] && floors[floor].places && floors[floor].places
        .filter(place => { return place.available && !place.selected })
        .forEach(place => {
          const placeRect = currentSvg.getElementById('Place' + place.label)
          placeRect && placeRect.classList.add(styles.gvFree)
        })

      // color all with same group same color
      const uniqueGroups = floors[floor] && floors[floor].places && floors[floor].places
        .reduce((groups, place) => {
          place.group && !groups.includes(place.group) && groups.push(place.group)
          return groups
        }, [])

      if (uniqueGroups && uniqueGroups.length) {
        const colors = COLOR_PALETE.length >= uniqueGroups.length ?
          COLOR_PALETE.slice(0, uniqueGroups.length) :
          COLOR_PALETE.concat(RandomColor({ count: uniqueGroups.length - COLOR_PALETE.length, luminosity: 'light', seed: 'as32d165q4' }))

        const assignColors = uniqueGroups
          .reduce((assign, group, index) => {
            assign[group] = colors[index]
            return assign
          }, {})

        floors[floor] && floors[floor].places && floors[floor].places
          .filter(place => { return place.group })
          .forEach(place => {
            const placeRect = currentSvg.getElementById('Place' + place.label)
            placeRect && placeRect.classList.add('hasColorGroup')
            placeRect && placeRect.setAttribute('style', `fill: ${assignColors[place.group]};`)
          })
      }

      const heatGroups = floors[floor] && floors[floor].places && floors[floor].places
        .reduce((groups, place) => place.heat !== undefined ? [ ...groups, place.heat ] : groups, [])

      if (heatGroups && heatGroups.length) {
        const min = Math.min(...heatGroups)
        const max = Math.max(...heatGroups)
        const mapValue = (min, max, toMin, toMax, value) => {
          return (value - min) * (toMax - toMin) / (max - min) + toMin
        }

        floors[floor] && floors[floor].places && floors[floor].places
          .filter(place => { return place.heat !== undefined })
          .forEach(place => {
            const yellow = Math.round(mapValue(min, max, 255, 0, place.heat))
            const placeRect = currentSvg.getElementById('Place' + place.label)
            placeRect && placeRect.classList.add('hasHeatGroup')
            placeRect && placeRect.setAttribute('style', `fill: rgb(255, ${yellow}, 70);`)
          })
      }

      // add tooltip event listeners
      floors[floor] && floors[floor].places && floors[floor].places
        .filter(place => { return place.tooltip })
        .forEach(place => {
          const placeRect = currentSvg.getElementById('Place' + place.label)
          if (placeRect) {
            placeRect.onmouseenter = () => { this.setState({ ...this.state, visible: place.tooltip && true, content: place.tooltip }) }
            placeRect.onmouseleave = () => { this.setState({ ...this.state, visible: false }) }
            placeRect.onmousemove = event => {
              const rect = this.refs.containerDiv ? this.refs.containerDiv.getBoundingClientRect() : { left: 0, top: 0 }
              this.setState({ ...this.state, mouseX: event.clientX - 160 - (this.props.showSecondaryMenu ? 200 : 0) + 20, mouseY: event.clientY - 60 })
            }
          }
        })
    }
  }

  addLabel(place, label, el) {
    if (!el.getElementById('Text' + label)) { // if label doenst exist yet
      let x = 0,
        y = 0
      switch (place.tagName) {
        case 'polygon':
          place.getAttribute('points').split(' ').forEach(pointPair => {
            const xy = pointPair.split(',')
            x += +xy[0] || 0
            y += +xy[1] || 0
          })
          const length = place.getAttribute('points').split(' ').length - 1
          x /= length
          y /= length
          break
        case 'rect':
          x = (+place.getAttribute('x')) + (+place.getAttribute('width')) / 2
          y = (+place.getAttribute('y')) + (+place.getAttribute('height')) / 2
          break
      }

      const newElement = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      newElement.setAttributeNS(null, 'x', x)
      newElement.setAttributeNS(null, 'y', y)
      newElement.setAttributeNS(null, 'class', `${styles.gvText} ${styles.text}`)
      newElement.setAttributeNS(null, 'text-anchor', 'middle')
      newElement.setAttributeNS(null, 'id', 'Text' + label)
      newElement.setAttributeNS(null, 'dy', '0.25em')

      const textNode = document.createTextNode(label)
      newElement.appendChild(textNode)

      place.parentNode.appendChild(newElement)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.showEmptyFloors) {
      const freePlacesFloor = nextProps.floors.findIndex(floor => floor.free_places.length)
      this.setState({
        ...this.state,
        floor: freePlacesFloor === -1 ? 0 : freePlacesFloor
      })
    }
  }


  render() {
    const divider = <span />
    const { floors, onPlaceClick, showEmptyFloors, unfold } = this.props
    const { floor } = this.state

    const prepareButtons = (floor, index) => {
      const onFloorClick = () => this.setState({ ...this.state, floor: index })
      return (
        <RoundButton
          key={index}
          content={floor.label}
          onClick={onFloorClick}
          state={this.state.floor === index ? 'selected' : (!showEmptyFloors && floor.places && floor.places.findIndex(place => place.available) === -1 && 'disabled')}
        />
      )
    }

    const handleSVGClick = ({ target }) => {
      const id = target.getAttribute('id')
      if (id && id.substring(0, 5) === 'Place') {
        const place = floors[floor].places.find(place => { return place.label === id.substring(5) })
        place && place.available && onPlaceClick(place)
      }
    }

    const prepareFloors = floor => <SvgFromText svg={floor.scheme || ''} svgClick={handleSVGClick} />

    return (
      unfold === true ? <div className={styles.grayBackground}>
        {floors.map(prepareFloors)}
      </div> :
      <div className={`${styles.widthContainer}`} ref={'containerDiv'}>
        <div className={`${styles.width78} ${styles.svgContainer}`}>
          <SvgFromText svg={floors[floor] && floors[floor].scheme || ''} svgClick={handleSVGClick} rotate={this.state.rotate} />
        </div>
        <div className={styles.width18}>
          <ButtonStack divider={divider}>
            {floors.map(prepareButtons)}
          </ButtonStack>
          <div className={styles.rotateButton}>
            <RoundButton content={<i className="fa fa-refresh" aria-hidden="true" />} onClick={() => { this.setState({ ...this.state, rotate: !this.state.rotate }) }} state={'action'} />
          </div>

          {Tooltip(this.state)}
        </div>
      </div>
    )
  }
}


export default connect(
  state => ({ showSecondaryMenu: state.pageBase.showSecondaryMenu }),
  dispatch => ({ actions: {} })
)(GarageLayout)
