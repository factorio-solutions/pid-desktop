import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase from '../../_shared/containers/pageBase/PageBase'
import Input    from '../../_shared/components/input/Input'
import Form     from '../../_shared/components/form/Form'

import * as nav           from '../../_shared/helpers/navigation'
import { t }              from '../../_shared/modules/localization/localization'
import * as newCarActions from '../../_shared/actions/newCar.actions'

import styles from './newCar.page.scss'


class NewCarPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object,
    params:  PropTypes.object
  }

  componentDidMount() {
    this.props.params.id && this.props.actions.initCar(this.props.params.id)
  }

  submitForm = () => this.checkSubmitable() && this.props.actions.submitNewCar(this.props.params.id)
  goBack = () => nav.to('/profile')

  checkSubmitable = () => {
    const { state } = this.props
    if (state.name === '') return false
    if (state.licence_plate === '') return false
    if (state.color === '') return false
    if (state.model === '') return false
    return true
  }

  render() {
    const { state, actions } = this.props


    return (
      <PageBase>
        <div>
          <Form
            onSubmit={this.submitForm}
            submitable={this.checkSubmitable()}
            onBack={this.goBack}
            onHighlight={actions.toggleHighlight}
          >
            <Input
              onEnter={this.submitForm}
              onChange={actions.setName}
              label={t([ 'newCar', 'name' ]) + ' *'}
              error={t([ 'newCar', 'nameInvalid' ])}
              value={state.name}
              placeholder={t([ 'newCar', 'namePlaceholder' ])}
              highlight={state.highlight}
            />
            <Input
              onEnter={this.submitForm}
              onChange={actions.setLicencePlate}
              label={t([ 'newCar', 'licencePlate' ]) + ' *'}
              error={t([ 'newCar', 'licencePlateInvalid' ])}
              value={state.licence_plate}
              placeholder={t([ 'newCar', 'licencePlatePlaceholder' ])}
              highlight={state.highlight}
            />
            <Input
              onEnter={this.submitForm}
              onChange={actions.setColor}
              label={t([ 'newCar', 'color' ]) + ' *'}
              error={t([ 'newCar', 'colorInvalid' ])}
              value={state.color}
              placeholder={t([ 'newCar', 'colorPlaceholder' ])}
              highlight={state.highlight}
            />
            <Input
              onEnter={this.submitForm}
              onChange={actions.setModel}
              label={t([ 'newCar', 'model' ]) + ' *'}
              error={t([ 'newCar', 'modelInvalid' ])}
              value={state.model}
              placeholder={t([ 'newCar', 'modelPlaceholder' ])}
              highlight={state.highlight}
            />
            
            <input
              type="checkbox"
              checked={state.lpg || false}
              onChange={actions.setLPG}
            />
            {t([ 'newCar', 'lpg' ])}

            <div className={styles.inlineForm}>
              <Input
                onEnter={this.submitForm}
                step="0.01"
                onChange={actions.setWidth}
                label={t([ 'newCar', 'width' ])}
                error={t([ 'newCar', 'widthInvalid' ])}
                value={state.width}
                placeholder={t([ 'newCar', 'widthPlaceholder' ])}
                type="number"
              />
              <Input
                onEnter={this.submitForm}
                style={styles.middle}
                step="0.01"
                onChange={actions.setHeight}
                label={t([ 'newCar', 'height' ])}
                error={t([ 'newCar', 'heightInvalid' ])}
                value={state.height}
                placeholder={t([ 'newCar', 'heightPlaceholder' ])}
                type="number"
              />
              <Input
                onEnter={this.submitForm}
                step="0.01"
                onChange={actions.setLength}
                label={t([ 'newCar', 'length' ])}
                error={t([ 'newCar', 'lengthInvalid' ])}
                value={state.length}
                placeholder={t([ 'newCar', 'lengthPlaceholder' ])}
                type="number"
              />
            </div>
          </Form>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.newCar }),
  dispatch => ({ actions: bindActionCreators(newCarActions, dispatch) })
)(NewCarPage)
