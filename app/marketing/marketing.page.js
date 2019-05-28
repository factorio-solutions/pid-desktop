import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import Map, { Marker } from 'google-maps-react'
import { withRouter } from 'react-router-dom'

import Logo     from '../_shared/components/logo/Logo'
import Carousel from '../_shared/components/carousel/Carousel'

import * as marketingActions   from '../_shared/actions/marketing.actions'
import { AVAILABLE_LANGUAGES } from '../routes'
import { t }                   from '../_shared/modules/localization/localization'

import properties from './propertiesDefinition'

import styles from './marketing.page.scss'

class MarketingPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object,
    match:   PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { actions, match: { params } } = this.props
    actions.initMarketingPage(params.short_name, () => this.forceUpdate()) // to redraw map to show correct position
  }

  componentDidUpdate() {
    const { match: { params }, state } = this.props

    if (
      state.marketing
      && !state.marketing.descriptions.some(desc => desc.language === params.lang)
    ) {
      this.changeLanguage(state.marketing.descriptions[0].language)
    }
  }

  changeLanguage = lang => {
    const { match: { url }, history } = this.props
    const pathSplit = url.substring(1).split('/')
    pathSplit[0] = lang
    history.push(`/${pathSplit.join('/')}`)
  }

  render() {
    const { state } = this.props
    const { marketing } = state

    // download page first, make sure marketing is launched
    if (!marketing || !marketing.marketing_launched) {
      return null
    }

    const filterLanguages = lang => {
      return marketing.descriptions.map(desc => { return desc.language }).includes(lang)
    }

    const filterProperties = property => {
      return marketing[property.key]
    }

    const prepareLanguages = lang => {
      const { match: { params } } = this.props
      const langClick = () => {
        this.changeLanguage(lang)
      }

      return (
        <span
          key={lang}
          className={params.lang == lang ? styles.active : undefined}
          onClick={langClick}
        >
          {lang.toUpperCase()}
        </span>
      )
    }

    const prepareImages = image => {
      return image.img
    }

    const prepareTableBody = (property, index, arr) => { // make pairs into tr
      if (index % 2 === 0) {
        return (
          <tr>
            <td className={styles.active}>
              {arr[index].icon}
              {t([ 'newMarketing', arr[index].key ])}
            </td>
            {arr[index + 1] !== undefined && (
            <td className={styles.active}>
              {arr[index + 1].icon}
              {t([ 'newMarketing', arr[index + 1].key ])}
            </td>
            )}
          </tr>
        )
      } else {
        return null
      }
    }

    const marketingOfLanguage = marketing.descriptions.find(desc => desc.language == window.location.hash.substring(2, 4))

    return (
      <div className={styles.container}>

        <div className={styles.pidHeader}>
          <a href={`https://${process.env.CLIENT_DOMAIN || 'localhost:8080'}/`}>
            <Logo />
          </a>
          <div className={styles.languages}>
            {' '}
            {AVAILABLE_LANGUAGES.filter(filterLanguages).map(prepareLanguages)}
            {' '}
          </div>
        </div>

        {marketing.images && <Carousel width="100%" height="500px" images={marketing.images.map(prepareImages)} />}

        <div className={styles.content}>
          <div className={styles.displayFlex}>
            <div className={styles.textContent}>
              <h1>{marketing.garage.name}</h1>
              <h3>{t([ 'marketing', 'description' ])}</h3>
              <div className={styles.innerContent} dangerouslySetInnerHTML={{ __html: (marketingOfLanguage || marketing.descriptions[0]).text }} />

              <h3>{t([ 'marketing', 'properties' ])}</h3>
              <div className={styles.innerContent}>
                <table className={styles.propertiesTtable}>
                  <tbody>
                    {properties.filter(filterProperties).map(prepareTableBody)}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.contacts}>
              <h2>{t([ 'marketing', 'contacts' ])}</h2>
              <div className={styles.contact}>
                <i className="fa fa-phone" aria-hidden="true" />
                <br />
                {marketing.phone}
              </div>
              <div className={styles.contact}>
                <i className="fa fa-at" aria-hidden="true" />
                <br />
                {marketing.email}
              </div>
              <div className={styles.contact}>
                <i className="fa fa-map-marker" aria-hidden="true" />
                <br />
                <strong>{marketing.garage.name}</strong>
                <br />
                {marketing.garage.address.line_1}
                <br />
                {marketing.garage.address.line_2}
                {marketing.garage.address.line_2 && <br />}
                {marketing.garage.address.city}
                <br />
                {marketing.garage.address.postal_code}
                <br />
                {marketing.garage.address.state}
                {marketing.garage.address.state && <br />}
                {marketing.garage.address.country}
                <br />
                <small>
                  {t([ 'marketing', 'lat' ])}
                  {': '}
                  {marketing.garage.address.lat}
                  {', '}
                  {t([ 'marketing', 'lng' ])}
                  {': '}
                  {marketing.garage.address.lng}
                  <br />
                </small>
              </div>
            </div>
          </div>

          <div className={styles.mapConiner}>
            <Map google={window.google} zoom={14} center={{ lat: marketing.garage.address.lat, lng: marketing.garage.address.lng }} style={{ height: '400px', maxWidth: '700px' }}>
              <Marker position={{ lat: marketing.garage.address.lat, lng: marketing.garage.address.lng }} name="garagePosition" />
            </Map>
          </div>
        </div>

      </div>
    )
  }
}

const enhancers = compose(
  withRouter,
  connect(
    state => ({ state: state.marketing }),
    dispatch => ({ actions: bindActionCreators(marketingActions, dispatch) })
  )
)

export default enhancers(MarketingPage)
