import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'

import TableRow          from '../tableRow/TableRow'
import HistoryTableRow   from '../tableRow/HistoryTableRow'
import UpdatedAtTableRow from '../tableRow/UpdatedAtTableRow'
import EnumButton        from './EnumButton'
import SearchBox         from './SearchBox'

import { t } from '../../modules/localization/localization'

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
    filterClick:    PropTypes.func, // will return key and ASC or DESC
    selectId:       PropTypes.number,
    dontFilter:     PropTypes.bool
  }

  static defaultProps = {
    searchBox: true,
    searchBar: false,
    selectId:  null,
    scale:     1
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

  componentDidMount() {
    window.addEventListener('resize', this.updateScale)
    this.updateScale()

    if (this.props.selectId) {
      this.setState({
        ...this.state,
        spoilerId: this.filterData(this.props.data).sort(this.createComparator()).findIndexById(this.props.selectId)
      })
    }
  }

  // According to React documentation calling setState is ok in this method if it is wrapped in condition.
  componentDidUpdate(prevProps) {
    this.updateScale()

    const prevFirstItem = prevProps.data[0]
    const firstItem = this.props.data[0]
    // NaN === NaN is false
    const bothSelectIdNan = isNaN(prevProps.selectId) && isNaN(this.props.selectId)

    if (
      (!bothSelectIdNan && (prevProps.selectId !== this.props.selectId)) ||
      (!prevProps.data.length && this.props.data.length) ||
      (prevFirstItem !== firstItem && this.props.selectId !== -1 && !isNaN(this.props.selectId))
    ) {
      this.setState({
        ...this.state,
        spoilerId: this.filterData(this.props.data).findIndexById(this.props.selectId)
      })
    }

    if (this.props.deselect && this.state.spoilerId !== -1) {
      this.setState({ ...this.state, spoilerId: -1 })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateScale)
  }

  updateScale = () => { // will calculate scale for table to fit window
    const scale = this.table.parentNode.getBoundingClientRect().width / this.table.offsetWidth
    const newScale = scale > 1 ? 1 : scale

    this.state.scale !== newScale && this.setState({
      ...this.state,
      scale: scale > 1 ? 1 : scale
    })
  }

  filterData(data) {
    const { schema, searchBar } = this.props

    const stringifyElement = obj => {
      if (typeof obj === 'object') {
        return obj && obj.props && obj.props.children ?
          ([ 'number', 'string' ].includes(typeof obj.props.children) ?
            obj.props.children :
            obj.props.children.map(child => stringifyElement(child)).join(' ')) :
            ''
      } else if (obj) {
        return obj
      } else {
        return ''
      }
    }

    return data.filter(object => {
      let show = true
      if (this.state.search !== '') {
        show = show && schema.map(value => value.representer ? value.representer(object[value.key]) : object[value.key])
          .map(value => stringifyElement(value).toString().replace(/\s\s+/g, ' ').trim()
          .toLowerCase()
          .includes(this.state.search.toLowerCase())
       ).includes(true)
      }
      if (searchBar) {
        show = show && Object.keys(this.state.searchBar).map(key => ({ name: key, value: this.state.searchBar[key] }))
        .reduce((acc, filter) => {
          const compare = () => {
            if (typeof filter.value === 'string' && isNaN(object[filter.name])) {
              return (object[filter.name] + '').toLowerCase().includes(filter.value.toLocaleLowerCase())
            } else if (!isNaN(object[filter.name])) {
              return !isNaN(filter.value) && +object[filter.name] === +filter.value
            } else {
              return object[filter.name] === filter.value
            }
          }
          if (filter.value === '') {
            return acc
          }
          return acc && compare()
        }, true)
      }
      return show
    })
  }

  createComparator() {
    const { schema } = this.props
    const { sortKey, sortType } = this.state
    const { compareRepresentations, comparator, representer } = schema.find(s => s.key === sortKey)

    if (typeof comparator === 'function') { // custom comparator
      return (aRow, bRow) => {
        const a = compareRepresentations ? representer(aRow) : aRow[sortKey]
        const b = compareRepresentations ? representer(bRow) : bRow[sortKey]
        return comparator(sortType, a, b)
      }
    } else { // predefined comparators
      return (aRow, bRow) => {
        const a = compareRepresentations ? representer(aRow[sortKey]) : aRow[sortKey]
        const b = compareRepresentations ? representer(bRow[sortKey]) : bRow[sortKey]

        switch (comparator) {
          case 'date':
            return sortType === 'asc' ? moment(a || '1970/1/1').diff(moment(b || '1970/1/1')) : moment(b || '1970/1/1').diff(moment(a || '1970/1/1'))
          case 'string':
            return (a || '').toLowerCase() < (b || '').toLowerCase() ? (sortType === 'asc' ? -1 : 1) : ((a || '').toLowerCase() > (b || '').toLowerCase() ? (sortType === 'asc' ? 1 : -1) : 0)
          case 'number':
            return sortType === 'asc' ? (parseFloat(a) || 0) - (parseFloat(b) || 0) : (parseFloat(b) || 0) - (parseFloat(a) || 0)
          case 'boolean':
            return sortType === 'asc' ? a - b : b - a

          default:
            return sortType === 'asc' ? -1 : 1
        }
      }
    }
  }

  normalizeData(data) {
    return data.map((obj, index) => ({ ...obj, key: obj.key || index }))
  }

  render() {
    const { schema, data, searchBox, searchBar, returnFiltered, filterClick, dontFilter } = this.props
    const { sortKey, sortType, spoilerId } = this.state

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

    let newData = this.normalizeData(data)
    if (!dontFilter) {
      newData = this.filterData(newData)
    }

    newData = newData.sort(this.createComparator())

    const handleRowClick = spoilerId => {
      const { onRowSelect } = this.props
      if (this.state.spoilerId === spoilerId) {
        this.setState({ spoilerId: -1 })
        onRowSelect && onRowSelect(undefined, -1)
      } else {
        this.setState({ spoilerId })
        onRowSelect && onRowSelect(newData.find(obj => obj.key === spoilerId), spoilerId)
      }
    }

    const prepareHeader = (value, key) => {
      const title = Array.isArray(value.title)
        ? t(value.title)
        : value.title
      return (
        <td key={key} onClick={() => { handleHeadClick(key) }} className={styles.tdHeader}>
          {title}
          {value.comparator && sortKey === value.key && <i className={'fa fa-chevron-' + (sortType === 'asc' ? 'up' : 'down')} aria-hidden="true" />}
        </td>
      )
    }

    const prepareSearchBar = (value, key) => {
      const searchChange = searchValue => this.setState({
        ...this.state,
        searchBar: {
          ...this.state.searchBar,
          [value.key]: searchValue
        }
      }, () => filterClick && filterClick(this.state.sortKey, this.state.sortType, this.state.searchBar))

      const renderEnum = enumValue => {
        const onEnumClick = () => this.state.searchBar[value.key] === enumValue ? searchChange('') : searchChange(enumValue)

        return (<EnumButton disabled={this.state.searchBar[value.key] !== enumValue} onClick={onEnumClick}>
          {value.representer ? value.representer(enumValue) : enumValue}
        </EnumButton>)
      }

      const onChange = value => searchChange(value)

      return (value.representer && !value.enum && value.comparator !== 'date') ?
        <td /> :
        (<td key={key}>
          <div className={styles.tdSearchBar}>
            { value.enum ? value.enum.map(renderEnum) :
              <SearchBox value={this.state.searchBar[value.key]} onChange={onChange} type={value.comparator} />
            }
          </div>
        </td>)
        // [ <input type="search" value={this.state.searchBar[value.key]} onChange={onChange} placeholder="----------------" />,
        // <i className="fa fa-search" aria-hidden="true" /> ]
    }

    const prepareBody = (value, key, arr) => {
      const createHistortRow = (historyRow, index, arr) => [
        <HistoryTableRow
          schema={schema}
          newData={arr[index - 1] || value}
          data={historyRow}
        />,
        value.record_updates && <UpdatedAtTableRow
          data={value.record_updates[index]}
        />,
        index === arr.length - 1 && <HistoryTableRow
          schema={schema}
          newData={arr[index - 1] || value}
          data={historyRow}
          originalValues
        />
      ].filter(o => o)

      return [ <TableRow
        key={key}
        className={`
          ${(spoilerId === value.key) && styles.spoilerRow}
          ${value.disabled && styles.disabled}
          ${value.deleted_at && styles.deleted}
          ${value.loading && styles.loading}
        `}
        schema={schema}
        data={value}
        onClick={() => { handleRowClick(value.key) }}
        hover
      />,
        ((arr.length <= 5 || spoilerId === value.key) && value.history && value.history.map(createHistortRow)) || [],
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

        <table
          className={styles.rtTable}
          style={{ transform: `scale(${this.state.scale})` }}
          ref={table => { this.table = table }}
        >
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
