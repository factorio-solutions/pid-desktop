import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase       from '../_shared/containers/pageBase/PageBase'
import Table          from '../_shared/components/table/Table'
import Form           from '../_shared/components/form/Form'
import Wysiwyg        from '../_shared/components/wysiwyg/Wysiwyg'
import RoundButton    from '../_shared/components/buttons/RoundButton'
import PatternInput   from '../_shared/components/input/PatternInput'
import Dropdown       from '../_shared/components/dropdown/Dropdown'
import Modal          from '../_shared/components/modal/Modal'

import * as newMarketingActions   from '../_shared/actions/newMarketing.actions'
import * as nav                   from '../_shared/helpers/navigation'
import { t }                      from '../_shared/modules/localization/localization'
import { attributes, imageTags }  from '../_shared/actions/newMarketing.actions'

import styles from './newMarketing.page.scss'


export class NewMarketingPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.actions.initMarketingPage(this.props.params.id)
    if (this.props.params.marketingId){ // if marketing editing
      this.props.actions.initMarketing(this.props.params.marketingId)
    }
  }

  render() {
    const { state, actions } = this.props

    const submitForm = () => {
      this.props.params.marketingId ? actions.editGarageMarketing(this.props.params.marketingId, this.props.params.id)
                                    : actions.submitGarageMarketing(this.props.params.id)
    }

    const goBack = () => {
      nav.to(`/garages/${this.props.params.id}/marketing`)
    }

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
      return <tr key={index}><td className={styles.attribute} onClick={attributeClick}><input type="checkbox" checked={state[attribute] || false} onChange={attributeClick}/> {t(['newMarketing', attribute])} </td></tr>
    }

    const prepareImages = (image, index) => {
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
            <Dropdown label={t(['newMarketing', 'selectTag'])} content={imageTags.map(prepareTags)} style='light' selected={imageTags.findIndex((tag)=>{return tag == image.tag})}/>
          </div>
          <div className={styles.rowContent}>
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
                           { state.modalContent } <br/>
                         </div>

    const modalError = <div className={styles.floatCenter}>
                         { state.modalError } <br/>
                         <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={()=>{actions.setModalError(undefined)}} type='confirm'  />
                       </div>

    const content = <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                      <Modal content={modalContent} show={state.modalContent!=undefined} />
                      <Modal content={modalError} show={state.modalError!=undefined} />
                      <div>
                        <PatternInput onChange={actions.setShortName} label={t(['newMarketing', 'shortName'])} error={t(['newMarketing', 'invalidShortName'])} pattern="^[a-z-.]+$" placeholder={t(['newMarketing', 'shortNamePlaceholder'])} value={state.short_name.value || ''}/>
                        <PatternInput onChange={actions.setPhone} label={t(['newMarketing', 'phone'])} error={t(['newMarketing', 'invalidPhone'])} pattern="\+?\(?\d{2,4}\)?[\d\s-]{3,}" placeholder={t(['newMarketing', 'phonePlaceholder'])} value={state.phone.value || ''}/>
                        <PatternInput onChange={actions.setEmail} label={t(['newMarketing', 'email'])} error={t(['newMarketing', 'imvalidEmail'])} pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" placeholder={t(['newMarketing', 'mailPlaceholder'])} value={state.email.value || ''}/>
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

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.newMarketing }),
  dispatch => ({ actions: bindActionCreators(newMarketingActions, dispatch) })
)(NewMarketingPage)
