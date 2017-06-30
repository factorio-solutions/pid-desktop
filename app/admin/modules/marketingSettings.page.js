import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase       from '../../_shared/containers/pageBase/PageBase'
import Table          from '../../_shared/components/table/Table'
import Form           from '../../_shared/components/form/Form'
import Wysiwyg        from '../../_shared/components/wysiwyg/Wysiwyg'
import RoundButton    from '../../_shared/components/buttons/RoundButton'
import PatternInput   from '../../_shared/components/input/PatternInput'
import Dropdown       from '../../_shared/components/dropdown/Dropdown'
import Modal          from '../../_shared/components/modal/Modal'

import * as newMarketingActions   from '../../_shared/actions/newMarketing.actions'
import * as nav                   from '../../_shared/helpers/navigation'
import { t }                      from '../../_shared/modules/localization/localization'
import { attributes, imageTags }  from '../../_shared/actions/newMarketing.actions'

import styles from './marketingSettings.page.scss'


export class MarketingSettingsPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    pageBase:     PropTypes.object,
    actions:      PropTypes.object
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.initMarketing()
  }

  componentDidMount(){
    this.props.pageBase.garage && this.props.actions.initMarketing()
  }

  render() {
    const { state, pageBase, actions } = this.props

    const submitForm       = () => { actions.editGarageMarketing() }
    const goBack           = () => { nav.to(`/${pageBase.garage}/admin/modules`) }
    const hightlightInputs = () => { actions.toggleHighlight() }

    const checkSubmitable = () => {
      if (state.short_name.value == undefined || state.short_name.value == ''|| !state.short_name.valid) return false
      if (state.phone.value == undefined || state.phone.value == ''|| !state.phone.valid) return false
      if (state.email.value == undefined || state.email.value == ''|| !state.email.valid) return false
      if (state.images.filter((img, index, arr)=>{return index != arr.length-1}).find((img) => {return img.tag == undefined || img.img == ''}) != undefined) return false
      if (state.images.length == 1 ) return false

      return true
    }

    const prepareAttributes = (attribute, index) => {
      const attributeClick = () => { actions.setParameter(attribute, !state[attribute]) }
      return <tr key={index}><td className={styles.attribute} onClick={attributeClick}><input type="checkbox" checked={state[attribute] || false} onChange={attributeClick}/><span>{t(['newMarketing', attribute])}</span></td></tr>
    }

    const prepareImages = (image, index, arr) => {
      const fileSelector = () => { document.getElementsByName(`image${index}`)[0].click() }
      const removeRow    = () => { actions.removeImage(index) }
      const tagSelected  = (i) => { actions.setTag(imageTags[i], index) }
      const prepareTags  = (tag, i) => { return {label: t(['newMarketing', tag]), onClick: tagSelected.bind(this, i) } }

      const handleFileSelect = (event)=>{
        var reader = new FileReader()
        reader.onload = (e) => { actions.setImage(e.target.result, index) }
        reader.readAsDataURL(event.target.files[0])
        actions.setFile(event.target.files[0].name, index)
      }

      return(
        <div className={styles.imageRow} key={index}>
          <div className={styles.tag}>
            <Dropdown label={t(['newMarketing', 'selectTag'])} content={imageTags.map(prepareTags)} style='light' selected={imageTags.findIndex((tag)=>{return tag == image.tag})} highlight={(index!=arr.length-1 || index==0) && state.highlight}/>
          </div>
          <div className={`${styles.rowContent} ${state.highlight && state.images.length-1 != index && image.img == '' && styles.highlighted}`}>
            <input className={styles.hidden} type="file" accept="image/*" onChange={handleFileSelect} name={`image${index}`} />
            <RoundButton content={<span className='fa fa-file-code-o' aria-hidden="true"></span>} onClick={fileSelector} type={state.images[index].img==''?'action':'confirm'} />
            {state.images.length-1 != index && <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={removeRow} type='remove' question={t(['newGarage', 'removeFloorRowQuestion'])} />}
          </div>
          <div className={styles.imgPreview}>
            {image.img != '' && <img src={image.img}/>}
          </div>
        </div>
      )
    }

    const modalContent = <div className={styles.floatCenter}>
                           { state.modalContent }
                         </div>

    const modalError = <div className={styles.floatCenter}>
                         <div>
                          { state.modalError }
                         </div>
                         <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={()=>{actions.setModalError(undefined)}} type='confirm'  />
                       </div>

    return (
      <PageBase>
        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack} onHighlight={hightlightInputs}>
          <Modal content={modalContent} show={state.modalContent!=undefined} />
          <Modal content={modalError} show={state.modalError!=undefined} />
          <div>
            <PatternInput onChange={actions.setShortName} label={t(['newMarketing', 'shortName'])+' *'} error={t(['newMarketing', 'invalidShortName'])} pattern="^[a-z-.]+$"                                 placeholder={t(['newMarketing', 'shortNamePlaceholder'])} value={state.short_name.value || ''} highlight={state.highlight}/>
            <PatternInput onChange={actions.setPhone}     label={t(['newMarketing', 'phone'])+' *'}     error={t(['newMarketing', 'invalidPhone'])}     pattern="\+?\(?\d{2,4}\)?[\d\s-]{3,}"                placeholder={t(['newMarketing', 'phonePlaceholder'])}     value={state.phone.value || ''}      highlight={state.highlight}/>
            <PatternInput onChange={actions.setEmail}     label={t(['newMarketing', 'email'])+' *'}     error={t(['newMarketing', 'imvalidEmail'])}     pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" placeholder={t(['newMarketing', 'mailPlaceholder'])}      value={state.email.value || ''}      highlight={state.highlight}/>
          </div>

          <h2>{t(['newMarketing', 'description'])}</h2>
          <div className={styles.descriptionContainer}>
            <div className={styles.description}>
              <Wysiwyg content={state.descriptions[state.descriptionLanguage]} onChange={actions.descriptionChange} onLangClick={actions.setLanguage} activeLang={state.descriptionLanguage} max={500}/>
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
            <h2>{t(['newMarketing', 'images'])}</h2>
            {state.images.map(prepareImages)}
          </div>
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.newMarketing, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(newMarketingActions, dispatch) })
)(MarketingSettingsPage)
