import React, { Component, PropTypes }  from 'react'
import moment 													from 'moment'

import TableRow from '../TableRow/TableRow'

import styles from './Table.scss'


// Table schema is an array of objects, which describe the content type
// and the behavior of each column in the table
// {
//	key: {String}, - key of data's item object
//
// 	title: {String}, - column's header title
//
// 	comparator: {Function|undefined}, - column's comparator
//			allows to sort column unless undefined
// 		~> @params: type {String('asc'|'desc')} - sorting type
// 		~> @params: a {Object} - first object to compare
// 		~> @params: b {Object} - second object to compare
//
// 	representer: {Function|undefined}, - column's representation function
//			allows to represent values in custom way unless undefined
// 		~> @params: o {Object} - object to represent
//
// 	sort: {String('asc'|'desc')|undefined} - describes sorting type
//			first matched object with `sort` key used as a default sorting type
//
//	compareRepresentations: {Boolean|undefined}
// }
export default class Table extends Component {
	static propTypes = {
		schema: 			PropTypes.array.isRequired,
	  data: 				PropTypes.array.isRequired,   // Source data to fill the table
		onRowSelect: 	PropTypes.func // will be called on select, gives it parameters (data, index) or (undefined, -1) on deselect
	}

  constructor(props) {
    super(props)
    this.state = {
    	sortKey: this.props.schema.find((s) => s.sort).key,
    	sortType: this.props.schema.find((s) => s.sort).sort,
    	spoilerId: -1
    }
  }

  render() {
		const { schema, data } = this.props
		const { sortKey, sortType, spoilerId } = this.state
		const { compareRepresentations, comparator, representer } = schema.find((s)=>s.key==sortKey)
		var myComp = undefined // comparator to be used

		const handleHeadClick = (index) => {
			const { sortType, sortKey } = this.state
			const { schema } = this.props
			const isSame = sortKey == schema[index].key

			if(schema[index].comparator) {
				this.setState({ sortKey: isSame ? sortKey : schema[index].key
											, sortType: isSame ? ( sortType=='asc' ? 'desc' : 'asc' ) : 'asc'
											, spoilerId: -1
											})
			}
		}

		const handleRowClick = (spoilerId) => {
				const { onRowSelect } = this.props
		  	if(this.state.spoilerId === spoilerId) {
		    	this.setState({ spoilerId: -1 })
					onRowSelect && onRowSelect(undefined, -1)
		  	} else {
		  		this.setState({ spoilerId })
					onRowSelect && onRowSelect(this.props.data[spoilerId], spoilerId)
		  	}
		  }

			if (typeof comparator == 'function'){ // custom comparator
				myComp = (aRow,bRow) => {
					const a = compareRepresentations ? representer(aRow) : aRow[sortKey]
					const b = compareRepresentations ? representer(bRow) : bRow[sortKey]
					return comparator(sortType, a, b)
				}
			} else { // predefined comparators
				myComp = (aRow,bRow) => {
					const a = compareRepresentations ? representer(aRow[sortKey]) : aRow[sortKey]
					const b = compareRepresentations ? representer(bRow[sortKey]) : bRow[sortKey]

					switch (comparator) {
						case 'date':
							return sortType=='asc' ? moment(a||'1970/1/1').diff(moment(b||'1970/1/1')) : moment(b||'1970/1/1').diff(moment(a||'1970/1/1'))
							break
						case 'string':
							return a.toLowerCase()<b.toLowerCase() ? (sortType=='asc'?-1:1) : (a.toLowerCase()>b.toLowerCase() ? (sortType=='asc'?1:-1) : 0)
							break
						case 'number':
							return sortType=='asc'? (parseFloat(a) || 0)-(parseFloat(b) || 0) : (parseFloat(b) || 0)-(parseFloat(a) || 0)
							break
						case 'boolean':
							return sortType=='asc'? a-b : b-a
							break

						default:
							return sortType=='asc' ? -1 : 1
					}
				}
			}

		data.sort(myComp)

		const prepareHeader = (value,key)=>{
			return (
				<td key={key} onClick={()=>{handleHeadClick(key)}} className={styles.tdHeader}>
					{value.title}
					{value.comparator && sortKey==value.key && <i className={'fa fa-chevron-' + (sortType=='asc'?'up':'down')} aria-hidden='true'></i>}
				</td>
			)
		}

		const prepareBody = (value,key)=>{
			return [
				<TableRow key={key} className={`${spoilerId == key && styles.spoilerRow} ${value.disabled && styles.disabled}`} schema={schema} data={value} onClick={()=>{handleRowClick(key)}} hover/>,
				value.spoiler && spoilerId == key && <tr key={key+'-spoiler'} className={`${styles.tr} ${styles.spoiler}`}><td colSpan={schema.length}>{value.spoiler}</td></tr>
			]
		}

		return (
			<table className={styles.rtTable}>
				<thead>
					<tr>
						{schema.map(prepareHeader)}
					</tr>
				</thead>
				<tbody>
					{data.map(prepareBody)}
				</tbody>
			</table>
		)
  }
}
