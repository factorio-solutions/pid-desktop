import React, { Component, PropTypes } from 'react'

import Table from './Table'
import RoundButton from '../buttons/RoundButton'
import Loading from '../loading/Loading'

import request from '../../helpers/requestPromise'

import styles from './Table.scss'


export default class PaginatedTable extends Component {
  static propTypes = {
    schema:        PropTypes.array.isRequired, // schema for table
    query:         PropTypes.string, // query to ask
    transformData: PropTypes.func, // if set to true, will reset selected item
    variables:     PropTypes.object
  }

  constructor(props) {
    super(props)

    this.requestData = this.requestData.bind(this)
    this.transformData = this.transformData.bind(this)
    this.keyToOrderByAndIncludes = this.keyToOrderByAndIncludes.bind(this)
    this.loadingRequest = this.loadingRequest.bind(this)

    const sortedColumn = props.schema.find(column => column.sort !== undefined)
    this.state = {
      data:    [],
      loading: true,
      page:    1,
      count:   10,
      key:     sortedColumn.key, // sorting by this key
      ascDesc: sortedColumn.sort
    }
  }

  componentDidMount() {
    const { variables } = this.props
    const { page, count, key, ascDesc } = this.state
    this.requestData({ ...variables, ...this.keyToOrderByAndIncludes(key, ascDesc), page, count: count + 1 })
    window.addEventListener('paginatedTableUpdate', this.loadingRequest, true)
  }

  componentWillUpdate(nextProps, nextState) {
    const { variables } = this.props
    const { page, count, key, ascDesc } = this.state

    if (JSON.stringify(variables) !== JSON.stringify(nextProps.variables) || nextState.page !== page || nextState.count !== count || nextState.ascDesc !== ascDesc || nextState.key !== key) {
      this.requestData({ ...nextProps.variables, ...this.keyToOrderByAndIncludes(nextState.key, nextState.ascDesc), page: nextState.page, count: nextState.count + 1 })
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
    const { page, count, key, ascDesc } = this.state
    this.setState({ ...this.state, loading: true }, () => this.requestData({ ...variables, ...this.keyToOrderByAndIncludes(key, ascDesc), page, count: count + 1 }))
  }

  requestData(variables) { // requests data from server
    const { query } = this.props
    request(query, variables).then(this.transformData)
  }

  transformData(data) { // takes care of transforming data and setting the state when data downloads
    const { transformData } = this.props
    const transformedData = transformData(data)
    this.setState({
      ...this.state,
      data:    transformedData,
      loading: false,
      page:    transformedData.length === 0 ? 1 : this.state.page
    })
  }

  render() {
    const { schema } = this.props
    const { data, page, count, loading } = this.state

    const prevPage = () => !this.state.loading && this.setState({ ...this.state, page: page - 1, loading: true })
    const nextPage = () => !this.state.loading && this.setState({ ...this.state, page: page + 1, loading: true })

    const filterClick = (key, ascDesc) => this.setState({ ...this.state, key, ascDesc, loading: true })

    return (
      <div className={styles.paginatedTable}>
        {loading && <div className={styles.loading}>
          <Loading show />
        </div>}
        <Table schema={schema} data={data.length > count ? data.filter((row, index) => index < count) : data} filterClick={filterClick} searchBox={false} />
        <div>
          <RoundButton
            content={<i className="fa fa-chevron-left" aria-hidden="true" />}
            onClick={prevPage}
            state={page === 1 && 'disabled'}
          />
          <RoundButton
            content={<i className="fa fa-chevron-right" aria-hidden="true" />}
            onClick={nextPage}
            state={count >= data.length && 'disabled'}
          />
        </div>
      </div>
    )
  }
}
