import React, {Component} from 'react'

import Dropdown from '../dropdown/Dropdown'

import styles from './GarageSelector.scss'

// content = [{name, image inBase64}, ... ]
// onSelect will return selected object


export default class GarageSelector extends Component {
  static propTypes = {
    content:  PropTypes.array, // [{name, image base64 or path}, ... ]
    onSelect: PropTypes.func
  }

  constructor(props) {
     super(props);
     this.state = {selected: 0}
  }

  render(){
    const { content, onSelect } = this.props
    if (content === undefined || content.length === 0) return null

    const selected = (index) => {
      this.setState({selected: index})
      onSelect(content[index])
    }
    const dropdownContent = content.map((object, index) => {return {label: object.name, onClick: selected.bind(this, index) }})

    return (
      <div>
        <div className={styles.img} >
          <img src={content[this.state.selected].image}/>
        </div>
        <Dropdown label={'t(selectGarage)'} content={dropdownContent} selected={this.state.selected} style={'garageSelector'} position='fixed'/>
      </div>
    )
  }
}
