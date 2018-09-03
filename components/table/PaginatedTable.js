import React, { Component, PropTypes } from 'react'

import Table from './Table'
import RoundButton from '../buttons/RoundButton'
import Loading from '../loading/Loading'

import request from '../../helpers/requestPromise'
import requestAdmin from '../../helpers/requestAdmin'

import styles from './Table.scss'

const PAGE_BUTTONS_ON_THE_SIDE = 2 // number of pages displayed arround currently selected page


export default class PaginatedTable extends Component {
  static propTypes = {
    schema:        PropTypes.array.isRequired, // schema for table
    parseMetadata: PropTypes.func.isRequired, // if set to true, will reset selected item
    query:         PropTypes.string, // query to ask
    transformData: PropTypes.func, // if set to true, will reset selected item
    variables:     PropTypes.object,
    admin:         PropTypes.bool,
    findId:        PropTypes.number,
    storeState:    PropTypes.func,
    state:         PropTypes.object
  }

  static defaultProps = {
    admin: false
  }

  constructor(props) {
    super(props)

    if (props.state) {
      this.state = {
        ...props.state,
        data: props.state.data.map(row => ({ ...row, loading: true }))
      }
    } else {
      const sortedColumn = props.schema.find(column => column.sort !== undefined)
      this.state = {
        data:      [],
        loading:   true,
        page:      1,
        count:     10, // records per page
        key:       sortedColumn.key, // sorting by this key
        ascDesc:   sortedColumn.sort,
        search:    {},
        pageCount: 0
      }
    }
  }

  componentDidMount() {
    const { variables, findId } = this.props
    const { page, count, key, ascDesc, search } = this.state
    this.requestData({ ...variables, ...this.keyToOrderByAndIncludes(key, ascDesc), page, count, search, find_by_id: findId }, true)
    window.addEventListener('paginatedTableUpdate', this.loadingRequest, true)
  }

  componentDidUpdate(prevProps, prevState) {
    const { variables } = this.props
    const { count, key, ascDesc, search, page } = this.state

    if (JSON.stringify(variables) !== JSON.stringify(prevProps.variables) ||
      JSON.stringify(prevState.search) !== JSON.stringify(search) ||
      prevState.count !== count ||
      prevState.ascDesc !== ascDesc ||
      prevState.key !== key) {
      this.requestData({ ...variables, ...this.keyToOrderByAndIncludes(key, ascDesc), page, count, search })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('paginatedTableUpdate', this.loadingRequest, true)

    const { storeState } = this.state
    storeState && storeState(this.state)
  }


  keyToOrderByAndIncludes = (key, ascDesc) => { // constructs orderBy and includes keys from selected column
    const column = this.props.schema.find(col => col.key === key)
    return { order_by: `${column.orderBy} ${ascDesc.toUpperCase()}`, includes: column.includes }
  }

  loadingRequest = () => {
    const { variables } = this.props
    const { page, count, key, ascDesc, search } = this.state
    this.setState({ ...this.state, loading: true }, () => this.requestData({ ...variables, ...this.keyToOrderByAndIncludes(key, ascDesc), page, count, search }))
  }

  requestData = (variables, calledOnMount = false) => { // requests data from server
    const { query, admin } = this.props

    if (!(calledOnMount && this.state.data.length)) {
      this.setState({ ...this.state, loading: true })
    }

    if (admin) {
      requestAdmin(query, variables).then(this.transformData)
    } else {
      request(query, variables).then(this.transformData)
    }
  }

  transformData = data => { // takes care of transforming data and setting the state when data downloads
    const { transformData, parseMetadata } = this.props
    const transformedData = transformData ? transformData(data) : data
    const parsedMetadata = parseMetadata(data)

    this.setState({
      ...this.state,
      data:      transformedData,
      loading:   false,
      page:      transformedData.length === 0 ? 1 : parsedMetadata.page,
      pageCount: parsedMetadata.count
    })
  }

  requestPage = page => () => this.requestData({
    ...this.props.variables,
    ...this.keyToOrderByAndIncludes(this.state.key, this.state.ascDesc),
    page,
    count:  this.state.count,
    search: this.state.search
  })

  render() {
    const { schema, findId } = this.props
    const { data, page, pageCount, loading } = this.state

    const prevPage = () => !this.state.loading && this.setState({ ...this.state, page: page - 1, loading: true }, this.requestPage(page - 1))
    const nextPage = () => !this.state.loading && this.setState({ ...this.state, page: page + 1, loading: true }, this.requestPage(page + 1))
    const setPage = page => () => !this.state.loading && this.setState({ ...this.state, page, loading: true }, this.requestPage(page))

    const filterClick = (key, ascDesc, searchBox) => {
      const search = Object.keys(searchBox)
      .filter(key => searchBox[key] || searchBox[key] === false)
      .reduce((acc, key) => {
        const column = schema.find(o => o.key === key)
        return { ...acc,
          [column.orderBy || key]: {
            value: searchBox[key],
            joins: column.includes ? column.includes : null
          }
        }
      }, {})

      this.setState({ ...this.state, key, ascDesc, loading: true, search })
    }

    const pages = new Array(pageCount)
      .fill()
      .map((o, i) => i + 1)
      .slice(page - 1 > PAGE_BUTTONS_ON_THE_SIDE ? page - PAGE_BUTTONS_ON_THE_SIDE - 1 : 0, page + PAGE_BUTTONS_ON_THE_SIDE)

    const renderPageButtons = number => (<RoundButton
      content={number}
      onClick={setPage(number)}
      state={number === page && 'selected'}
    />)

    return (
      <div className={styles.paginatedTable}>
        {loading && <div className={styles.loading}>
          <Loading show />
        </div>}
        <Table
          schema={schema}
          data={data}
          filterClick={filterClick}
          searchBox={false}
          selectId={findId}
          searchBar
        />
        <div>
          <RoundButton
            content={<i className="fa fa-chevron-left" aria-hidden="true" />}
            onClick={prevPage}
            state={page <= 1 && 'disabled'}
          />
          {page - 1 > PAGE_BUTTONS_ON_THE_SIDE && '...'}
          {pages.map(renderPageButtons)}
          {page < pageCount - PAGE_BUTTONS_ON_THE_SIDE && '...'}
          <RoundButton
            content={<i className="fa fa-chevron-right" aria-hidden="true" />}
            onClick={nextPage}
            state={page >= pageCount && 'disabled'}
          />
        </div>
      </div>
    )
  }
}
