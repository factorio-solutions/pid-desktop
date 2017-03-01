import React, { Component, PropTypes }  from 'react'

import styles                           from './CardViewLayout.scss'


export default class CardViewLayout extends Component {
  static propTypes = {
    children: PropTypes.array,
    columns:  PropTypes.number
  }

  constructor(props) {
     super(props);
     this.state = {selected: undefined}
  }

  render(){
    const { columns, children } = this.props

    const prepareChild = React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        onClick: ()=>{this.setState({selected: index==this.state.selected ? undefined : index })},
        selected: index==this.state.selected || children.length <= 5
      })
    })

    const prepareColumns = (element, i) => {
      return (
        <div key={i} className={styles.column}>
          {prepareChild.filter((child, index)=>{return index % columns == i})}
        </div>
      )
    }

    return (
      <div className={styles.cardViewContainer}>
        { Array.apply(null, {length: columns}).map(prepareColumns) }
      </div>
    )
  }
}
