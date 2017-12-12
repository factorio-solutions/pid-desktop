import React, { Component, PropTypes } from 'react'
import moment from 'moment'

import TableRow from '../tableRow/TableRow'

import styles from './Table.scss'


// Table schema is an array of objects, which describe the content type
// and the behavior of each column in the table
// {
//  key: {String}, - key of data's item object
//
//   title: {String}, - column's header title
//
//   comparator: {Function|undefined}, - column's comparator
//    allows to sort column unless undefined
//    ~> @params: type {String('asc'|'desc')} - sorting type
//    ~> @params: a {Object} - first object to compare
//    ~> @params: b {Object} - second object to compare
//
//  representer: {Function|undefined}, - column's representation function
//    allows to represent values in custom way unless undefined
//    ~> @params: o {Object} - object to represent
//
//  sort: {String('asc'|'desc')|undefined} - describes sorting type
//     first matched object with `sort` key used as a default sorting type
//
//  compareRepresentations: {Boolean|undefined}
// }
export default class Table extends Component {
  static propTypes = {
    schema:         PropTypes.array.isRequired,
    data:           PropTypes.array.isRequired,   // Source data to fill the table
    onRowSelect:    PropTypes.func, // will be called on select, gives it parameters (data, index) or (undefined, -1) on deselect
    deselect:       PropTypes.bool, // if set to true, will reset selected item
    searchBox:      PropTypes.bool,
    searchBar:      PropTypes.bool,
    returnFiltered: PropTypes.func,
    filterClick:    PropTypes.func // will return key and ASC or DESC
  }

  static defaultProps = {
    searchBox: true,
    searchBar: false
  }

  constructor(props) {
    super(props)
    this.state = {
      sortKey:   this.props.schema.find(s => s.sort).key,
      sortType:  this.props.schema.find(s => s.sort).sort,
      spoilerId: -1,
      search:    '',
      searchBar: props.schema.reduce((acc, column) => ({ ...acc, [column.key]: '' }), {})
    }
  }

  componentWillUpdate(nextProps) {
    nextProps.deselect && this.state.spoilerId !== -1 && this.setState({ ...this.state, spoilerId: -1 })
  }

  filterData(data) {
    const { schema } = this.props

    const stringifyElement = obj => {
      if (typeof obj === 'object') {
        return obj && obj.props && obj.props.children ?
          ([ 'number', 'string' ].includes(typeof obj.props.children) ?
            obj.props.children :
            obj.props.children.map(child => { return stringifyElement(child) }).join(' ')) :
            ''
      } else {
        return obj
      }
    }

    return data.map((object, index) => ({ ...object, key: object.key || index }))
    .filter(object => {
      if (this.state.search === '') {
        return true
      } else {
        return schema.map(value => { return value.representer ? value.representer(object[value.key]) : object[value.key] })
       .map(value => stringifyElement(value).toString().replace(/\s\s+/g, ' ').trim()
         .toLowerCase()
         .includes(this.state.search.toLowerCase())
       ).includes(true)
      }
    })
  }

  render() {
    const { schema, data, searchBox, searchBar, returnFiltered, filterClick } = this.props
    const { sortKey, sortType, spoilerId } = this.state
    const { compareRepresentations, comparator, representer } = schema.find(s => s.key === sortKey)
    let myComp // comparator to be used

    const handleHeadClick = index => {
      const isSame = sortKey === schema[index].key
      filterClick && filterClick(schema[index].key, isSame ? (sortType === 'asc' ? 'desc' : 'asc') : 'asc', this.state.searchBar)
      if (schema[index].comparator) {
        this.setState({ ...this.state,
          sortKey:  isSame ? sortKey : schema[index].key,
          sortType: isSame ? (sortType === 'asc' ? 'desc' : 'asc') : 'asc'
        })
      }
    }


    if (typeof comparator === 'function') { // custom comparator
      myComp = (aRow, bRow) => {
        const a = compareRepresentations ? representer(aRow) : aRow[sortKey]
        const b = compareRepresentations ? representer(bRow) : bRow[sortKey]
        return comparator(sortType, a, b)
      }
    } else { // predefined comparators
      myComp = (aRow, bRow) => {
        const a = compareRepresentations ? representer(aRow[sortKey]) : aRow[sortKey]
        const b = compareRepresentations ? representer(bRow[sortKey]) : bRow[sortKey]

        switch (comparator) {
          case 'date':
            return sortType === 'asc' ? moment(a || '1970/1/1').diff(moment(b || '1970/1/1')) : moment(b || '1970/1/1').diff(moment(a || '1970/1/1'))
          case 'string':
            return a.toLowerCase() < b.toLowerCase() ? (sortType === 'asc' ? -1 : 1) : (a.toLowerCase() > b.toLowerCase() ? (sortType === 'asc' ? 1 : -1) : 0)
          case 'number':
            return sortType === 'asc' ? (parseFloat(a) || 0) - (parseFloat(b) || 0) : (parseFloat(b) || 0) - (parseFloat(a) || 0)
          case 'boolean':
            return sortType === 'asc' ? a - b : b - a

          default:
            return sortType === 'asc' ? -1 : 1
        }
      }
    }

    const newData = this.filterData(data).sort(myComp)

    const handleRowClick = spoilerId => {
      const { onRowSelect } = this.props
      if (this.state.spoilerId === spoilerId) {
        this.setState({ spoilerId: -1 })
        onRowSelect && onRowSelect(undefined, -1)
      } else {
        this.setState({ spoilerId })
        onRowSelect && onRowSelect(newData.find(obj => { return obj.key === spoilerId }), spoilerId)
      }
    }

    const prepareHeader = (value, key) => {
      return (
        <td key={key} onClick={() => { handleHeadClick(key) }} className={styles.tdHeader}>
          {value.title}
          {value.comparator && sortKey === value.key && <i className={'fa fa-chevron-' + (sortType === 'asc' ? 'up' : 'down')} aria-hidden="true" />}
        </td>
      )
    }

    const prepareSearchBar = (value, key) => {
      const searchChange = search => this.setState({
        ...this.state,
        searchBar: {
          ...this.state.searchBar,
          [value.key]: search.target.value
        }
      }, () => filterClick && filterClick(this.state.sortKey, this.state.sortType, this.state.searchBar))
      return (value.comparator !== 'string' && value.comparator !== 'number') || value.representer ?
        <td /> :
        (<td key={key}>
          <div className={styles.tdSearchBar}>
            <i className="fa fa-search" aria-hidden="true" />
            <input type="search" value={this.state.searchBar[value.key]} onChange={searchChange} />
          </div>
        </td>)
    }

    const prepareBody = (value, key, arr) => {
      return [
        <TableRow
          key={key}
          className={`${(spoilerId === value.key) && styles.spoilerRow} ${value.disabled && styles.disabled}`}
          schema={schema}
          data={value}
          onClick={() => { handleRowClick(value.key) }}
          hover
        />,
        (arr.length <= 5 || spoilerId === value.key) && value.spoiler && <tr key={value.key + '-spoiler'} className={`${styles.tr} ${styles.spoiler}`}>
          <td colSpan={schema.length}>{value.spoiler}</td>
        </tr>
      ]
    }

    const onFilterChange = e => {
      this.setState({ ...this.state, search: e.target.value }, () => {
        returnFiltered && returnFiltered(this.filterData(data))
      })
    }

    return (
      <div>
        {searchBox && <div className={styles.searchBox}>
          <input type="search" onChange={onFilterChange} value={this.state.search} />
          <i className="fa fa-search" aria-hidden="true" />
        </div>}

        <table className={styles.rtTable}>
          <thead>
            <tr>
              {schema.map(prepareHeader)}
            </tr>
            <tr>
              {searchBar && schema.map(prepareSearchBar)}
            </tr>
          </thead>
          <tbody>
            {newData.map(prepareBody)}
          </tbody>
        </table>
      </div>

    )
  }
}
