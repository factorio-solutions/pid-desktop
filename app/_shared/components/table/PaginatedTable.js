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
    findId:        PropTypes.number
  }

  static defaultProps = {
    admin: false
  }

  constructor(props) {
    super(props)

    this.requestData = this.requestData.bind(this)
    this.transformData = this.transformData.bind(this)
    this.keyToOrderByAndIncludes = this.keyToOrderByAndIncludes.bind(this)
    this.loadingRequest = this.loadingRequest.bind(this)

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

  componentDidMount() {
    const { variables, findId } = this.props
    const { page, count, key, ascDesc, search } = this.state
    this.requestData({ ...variables, ...this.keyToOrderByAndIncludes(key, ascDesc), page, count, search, find_by_id: findId })
    window.addEventListener('paginatedTableUpdate', this.loadingRequest, true)
  }

  componentWillUpdate(nextProps, nextState) {
    const { variables } = this.props
    const { page, count, key, ascDesc, search } = this.state

    if (JSON.stringify(variables) !== JSON.stringify(nextProps.variables) ||
      JSON.stringify(nextState.search) !== JSON.stringify(search) ||
      nextState.page !== page ||
      nextState.count !== count ||
      nextState.ascDesc !== ascDesc ||
      nextState.key !== key) {
      this.requestData({ ...nextProps.variables, ...this.keyToOrderByAndIncludes(nextState.key, nextState.ascDesc), page: nextState.page, count: nextState.count, search: nextState.search })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('paginatedTableUpdate', this.loadingRequest, true)
  }


  keyToOrderByAndIncludes(key, ascDesc) { // constructs orderBy and includes keys from selected column
    const column = this.props.schema.find(col => col.key === key)
    return { order_by: `${column.orderBy} ${ascDesc.toUpperCase()}`, includes: column.includes }
  }

  loadingRequest() {
    const { variables } = this.props
    const { page, count, key, ascDesc, search } = this.state
    this.setState({ ...this.state, loading: true }, () => this.requestData({ ...variables, ...this.keyToOrderByAndIncludes(key, ascDesc), page, count, search }))
  }

  requestData(variables) { // requests data from server
    const { query, admin } = this.props
    if (admin) {
      requestAdmin(query, variables).then(this.transformData)
    } else {
      request(query, variables).then(this.transformData)
    }
  }

  transformData(data) { // takes care of transforming data and setting the state when data downloads
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

  render() {
    const { schema, findId } = this.props
    const { data, page, pageCount, loading } = this.state

    const prevPage = () => !this.state.loading && this.setState({ ...this.state, page: page - 1, loading: true })
    const nextPage = () => !this.state.loading && this.setState({ ...this.state, page: page + 1, loading: true })
    const setPage = page => () => !this.state.loading && this.setState({ ...this.state, page, loading: true })

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
        <Table schema={schema} data={data} filterClick={filterClick} searchBox={false} searchBar selectId={findId} />
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
