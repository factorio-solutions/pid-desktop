import React, { Component, PropTypes }  from 'react'

import styles from './TableRow.scss'


export default class TableRow extends Component {
  static propTypes = {
    schema: 		PropTypes.array.isRequired,
    data: 			PropTypes.object.isRequired,
    hover: 			PropTypes.bool,
    onClick: 		PropTypes.func,
    className: 	PropTypes.string
	}

  render() {
  	const { schema, data, hover, onClick, className } = this.props

    return (<tr className={`${styles.tr} ${hover && styles.hover} ${className}`} onClick={onClick}>
				{schema.map((value, index)=>{ return <td key={index}>{(value.representer ? value.representer(data[value.key]) : data[value.key]) || '\u00A0'}</td> })}
			</tr>)
  }
}
