import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import Table              from '../../_shared/components/table/Table'
import RoundButton        from '../../_shared/components/buttons/RoundButton'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'
import PageBase           from '../../_shared/containers/adminPageBase/PageBase'

import * as newsActions from '../../_shared/actions/pid-admin.news.actions'
import { initNewNews }  from '../../_shared/actions/pid-admin.newNews.actions'
import { t }            from '../../_shared/modules/localization/localization'

import styles from './news.page.scss'
import Button from '../../_shared/components/buttons/Button'


class PidAdminNewsPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initNews()
    this.props.actions.setGar()
  }

  render() {
    const { actions, state } = this.props

    const schema = [
      {
        key:        'id', title:      t([ 'pidAdmin', 'news', 'id' ]), comparator: 'number', sort:       'asc'
      },
      {
        key:         'label', title:       t([ 'pidAdmin', 'news', 'label' ]), comparator:  'string', representer: o => <span dangerouslySetInnerHTML={{ __html: o }} />
      },
      { key: 'url', title: t([ 'pidAdmin', 'news', 'url' ]), comparator: 'string' },
      {
        key:         'created_at',
        title:       t([ 'pidAdmin', 'news', 'createdAt' ]),
        comparator:  'date',
        representer: o => (
          <span>
            {moment(o).format('ddd DD.MM.')}
            {' '}
            <br />
            {' '}
            {moment(o).format('H:mm')}
          </span>
        )
      }
    ]

    const addNews = () => actions.initNewNews(null, '', '')

    const addSpoiler = news => {
      const editNews = () => actions.initNewNews(news.id, news.label, news.url)
      const deleteNews = () => actions.deleteNews(news.id)

      return {
        ...news,
        spoiler: (
          <div className={styles.spoiler}>
            <LabeledRoundButton
              label={t([ 'pidAdmin', 'news', 'editNews' ])}
              content={<span className="fa fa-pencil" aria-hidden="true" />}
              onClick={editNews}
              type="action"
            />
            <LabeledRoundButton
              label={t([ 'pidAdmin', 'news', 'deleteNews' ])}
              content={<span className="fa fa-times" aria-hidden="true" />}
              onClick={deleteNews}
              type="remove"
            />
          </div>
        )
      }
    }

    return (
      <PageBase>
        <div>
          <Table schema={schema} data={state.news.map(addSpoiler)} />
        </div>
        <div className={styles.addButton}>
          <RoundButton content={<span className="fa fa-plus" aria-hidden="true" />} onClick={addNews} type="action" size="big" />
        </div>
        <Button
          content={state.garName}
          onClick={actions.mpiGarage}
        />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.pidAdminNews }),
  dispatch => ({ actions: bindActionCreators({ ...newsActions, initNewNews }, dispatch) })
)(PidAdminNewsPage)
