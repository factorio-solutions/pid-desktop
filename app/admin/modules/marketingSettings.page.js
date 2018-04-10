import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import ModulesPageBase    from './components/modulesPageBase'
import Form               from '../../_shared/components/form/Form'
import Wysiwyg            from '../../_shared/components/wysiwyg/Wysiwyg'
import RoundButton        from '../../_shared/components/buttons/RoundButton'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'
import UploadButton       from '../../_shared/components/buttons/UploadButton'
import PatternInput       from '../../_shared/components/input/PatternInput'
import Dropdown           from '../../_shared/components/dropdown/Dropdown'
import Modal              from '../../_shared/components/modal/Modal'

import { t }                              from '../../_shared/modules/localization/localization'
import * as newMarketingActions           from '../../_shared/actions/newMarketing.actions'
import { PRESIGNE_MARKETING_IMAGE_QUERY } from '../../_shared/queries/newMarketing.queries'

import styles from './marketingSettings.page.scss'


class MarketingSettingsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.pageBase.garage && this.props.actions.initMarketing()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.initMarketing()
  }

  submitForm = () => this.props.actions.editGarageMarketing()

  hightlightInputs = () => this.props.actions.toggleHighlight()

  render() {
    const { state, pageBase, actions } = this.props
    const { attributes, imageTags } = newMarketingActions


    const checkSubmitable = () => {
      if (state.short_name.value === undefined || state.short_name.value === '' || !state.short_name.valid) return false
      if (state.phone.value === undefined || state.phone.value === '' || !state.phone.valid) return false
      if (state.email.value === undefined || state.email.value === '' || !state.email.valid) return false
      if (state.images.filter((img, index, arr) => index !== arr.length - 1).find(img => img.tag === undefined || img.img === '') !== undefined) return false
      if (state.images.length === 1) return false

      return true
    }

    const prepareAttributes = (attribute, index) => {
      const attributeClick = () => actions.setParameter(attribute, !state[attribute])
      return <tr key={index}>
        <td className={styles.attribute} onClick={attributeClick}><input type="checkbox" checked={state[attribute] || false} onChange={attributeClick} />
          {t([ 'newMarketing', attribute ])}
        </td>
      </tr>
    }

    const prepareImages = (image, index, arr) => {
      const removeRow = () => actions.removeImage(index)
      const tagSelected = i => actions.setTag(imageTags[i], index)
      const prepareTags = (tag, i) => ({ label: t([ 'newMarketing', tag ]), onClick: tagSelected.bind(this, i) })

      return (
        <div className={styles.imageRow} key={index}>
          <div className={styles.tag}>
            <Dropdown
              label={t([ 'newMarketing', 'selectTag' ])}
              content={imageTags.map(prepareTags)}
              style="light"
              selected={imageTags.findIndex(tag => tag === image.tag)}
              highlight={(index !== arr.length - 1 || index === 0) && state.highlight}
            />
          </div>
          <div className={`${styles.rowContent} ${state.highlight && state.images.length - 1 !== index && image.img === '' && styles.highlighted}`}>
            <UploadButton
              label={t([ 'newMarketing', state.images[index].img === '' ? 'addImage' : 'editImage' ])}
              type={state.images[index].img === '' ? 'action' : 'confirm'}
              onUpload={url => { actions.setImage(url, index) }}
              query={PRESIGNE_MARKETING_IMAGE_QUERY}
              variables={{ garage_id: pageBase.garage }}
            />
            {state.images.length - 1 !== index &&
              <LabeledRoundButton
                label={t([ 'newMarketing', 'removeImage' ])}
                content={<span className="fa fa-times" aria-hidden="true" />}
                onClick={removeRow}
                type="remove"
                question={t([ 'newMarketing', 'removeImageQuestion' ])}
              />
            }
          </div>
          <div className={styles.imgPreview}>
            {image.img !== '' && <img src={image.img} />}
          </div>
        </div>
      )
    }

    const modalContent = (<div className={styles.floatCenter}>
      { state.modalContent }
    </div>)

    const modalError = (<div className={styles.floatCenter}>
      <div>
        { state.modalError }
      </div>
      <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={() => actions.setModalError()} type="confirm" />
    </div>)

    return (
      <ModulesPageBase>
        <Form onSubmit={this.submitForm} submitable={checkSubmitable()} onHighlight={this.hightlightInputs}>
          <Modal content={modalContent} show={state.modalContent !== undefined} />
          <Modal content={modalError} show={state.modalError !== undefined} />
          <div>
            <PatternInput
              onChange={actions.setShortName}
              label={t([ 'newMarketing', 'shortName' ]) + ' *'}
              error={t([ 'newMarketing', 'invalidShortName' ])}
              pattern="^[a-z-.]+$"
              placeholder={t([ 'newMarketing', 'shortNamePlaceholder' ])}
              value={state.short_name.value || ''}
              highlight={state.highlight}
            />
            <PatternInput
              onChange={actions.setPhone}
              label={t([ 'newMarketing', 'phone' ]) + ' *'}
              error={t([ 'newMarketing', 'invalidPhone' ])}
              pattern="\+[\d]{2,4}[\d]{3,}"
              placeholder={t([ 'newMarketing', 'phonePlaceholder' ])}
              value={state.phone.value || ''}
              highlight={state.highlight}
            />
            <PatternInput
              onChange={actions.setEmail}
              label={t([ 'newMarketing', 'email' ]) + ' *'}
              error={t([ 'newMarketing', 'imvalidEmail' ])}
              pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
              placeholder={t([ 'newMarketing', 'mailPlaceholder' ])}
              value={state.email.value || ''}
              highlight={state.highlight}
            />
          </div>

          <h2>{t([ 'newMarketing', 'description' ])}</h2>
          <div className={styles.descriptionContainer}>
            <div className={styles.description}>
              <Wysiwyg
                content={state.descriptions[state.descriptionLanguage]}
                onChange={actions.descriptionChange}
                onLangClick={actions.setLanguage}
                activeLang={state.descriptionLanguage}
                max={500}
              />
            </div>

            <div className={styles.parameters}>
              <table className={styles.attributesTable}>
                <tbody>
                  {attributes.map(prepareAttributes)}
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.images}>
            <h2>{t([ 'newMarketing', 'images' ])}</h2>
            {state.images.map(prepareImages)}
          </div>
        </Form>

        <div className={styles.bottomMargin} />
      </ModulesPageBase>
    )
  }
}

export default connect(
  state => ({ state: state.newMarketing, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(newMarketingActions, dispatch) })
)(MarketingSettingsPage)
