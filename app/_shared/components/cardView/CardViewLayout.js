import React, { Component, PropTypes }  from 'react'
<<<<<<< HEAD
=======

>>>>>>> feature/new_api
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
<<<<<<< HEAD
        selected: index==this.state.selected
      })
    })

    const prepareColumns = () => {
      var divs = []
      for (var i = 0; i < columns; i++) {
        divs.push(
          <div key={i} className={styles.column}>
            {prepareChild.filter((child, index)=>{return index % columns == i})}
          </div>
        )
      }
      return divs
=======
        selected: index==this.state.selected || children.length <= 5
      })
    })

    const prepareColumns = (element, i) => {
      return (
        <div key={i} className={styles.column}>
          {prepareChild.filter((child, index)=>{return index % columns == i})}
        </div>
      )
>>>>>>> feature/new_api
    }

    return (
      <div className={styles.cardViewContainer}>
<<<<<<< HEAD
        {prepareColumns()}
=======
        { Array.apply(null, {length: columns}).map(prepareColumns) }
>>>>>>> feature/new_api
      </div>
    )
  }
}
