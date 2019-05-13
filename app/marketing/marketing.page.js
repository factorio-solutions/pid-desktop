import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Map, { Marker } from 'google-maps-react'

import Logo     from '../_shared/components/logo/Logo'
import Carousel from '../_shared/components/carousel/Carousel'

import * as marketingActions   from '../_shared/actions/marketing.actions'
import { AVAILABLE_LANGUAGES } from '../routes'
import { t }                   from '../_shared/modules/localization/localization'
import { entryPoint }          from '../index'

import styles from './marketing.page.scss'


class MarketingPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object,
    match:   PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount() {
    const { actions, match: { params } } = this.props
    actions.initMarketingPage(params.short_name, () => this.forceUpdate()) // to redraw map to show correct position
  }

  componentWillUpdate(nextProps) {
    if (nextProps.state.marketing && !nextProps.state.marketing.descriptions.find(desc => desc.language === window.location.hash.substring(2, 4))) {
      this.context.router.push(`/${nextProps.state.marketing.descriptions[0].language}${window.location.hash.substring(4)}`)
    }
  }

  render() {
    const { state, actions } = this.props
    const { marketing } = state

    const properties = [
      {
        icon: <div><i className="icon-size-restriction" title="size_restriction" /></div>,
        key:  'size_restriction'
      },
      {
        icon: <div><i className="icon-non-stop-open" title="non_stop_open" /></div>,
        key:  'non_stop_open'
      },
      {
        icon: <div><i className="icon-non-stop-reception" title="non_stop_reception" /></div>,
        key:  'non_stop_reception'
      },
      {
        icon: <div>
          <span className="icon-gate-opened-by-phone">
            <span className="path1" />
            <span className="path2" />
            <span className="path3" />
            <span className="path4" />
            <span className="path5" />
            <span className="path6" />
            <span className="path7" />
          </span>
        </div>,
        key: 'gate_opened_by_phone'
      },
      {
        icon: <div>
          <span className="icon-gate-opened-by-receptionist">
            <span className="path1" />
            <span className="path2" />
            <span className="path3" />
            <span className="path4" />
            <span className="path5" />
          </span>
              </div>,
        key: 'gate_opened_by_receptionist'
      },
      {
        icon: <div><i className="icon-historical-center" title="historical_center" /></div>,
        key:  'historical_center'
      },
      {
        icon: <div><i className="icon-city-center" title="city_center" /></div>,
        key:  'city_center'
      },
      {
        icon: <div><i className="icon-fifteen-minutes-from-center" title="fifteen_minutes_from_center" /></div>,
        key:  'fifteen_minutes_from_center'
      },
      {
        icon: <div><i className="icon-cameras" title="cameras" /></div>,
        key:  'cameras'
      },
      {
        icon: <div><i className="icon-camera-at-gate" title="camera_at_gate" /></div>,
        key:  'camera_at_gate'
      },
      {
        icon: <div><i className="icon-tram-nearby" title="tram_nearby" /></div>,
        key:  'tram_nearby'
      },
      {
        icon: <div><i className="icon-wc" title="wc" /></div>,
        key:  'wc'
      },
      {
        icon: <div><i className="icon-charging-station" title="charging_station" /></div>,
        key:  'charging_station'
      },
      {
        icon: <div><i className="icon-guarded-parking" title="guarded_parking" /></div>,
        key:  'guarded_parking'
      },
      {
        icon: <div><i className="icon-car-wash" title="car_wash" /></div>,
        key:  'car_wash'
      },
      {
        icon: <div><i className="icon-airport-nearby" title="airport_nearby" /></div>,
        key:  'airport_nearby'
      }
    ]

    // download page first, make sure marketing is launched
    if (marketing == undefined || marketing.marketing_launched != true) {
      return null
    }

    const filterLanguages = lang => {
      return marketing.descriptions.map(desc => { return desc.language }).includes(lang)
    }

    const filterProperties = propertie => {
      return marketing[propertie.key]
    }

    const prepareLanguages = (lang, index) => {
      const langClick = () => { this.context.router.push(`/${lang}${window.location.hash.substring(4)}`) }
      return <span key={index} className={window.location.hash.substring(2, 4) == lang && styles.active} onClick={langClick}>{lang.toUpperCase()}</span>
    }

    const prepareImages = image => {
      return image.img
    }

    const prepareTableBody = (propertie, index, arr) => { // make pairs into tr
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

export default connect(
  state => ({ state: state.marketing }),
  dispatch => ({ actions: bindActionCreators(marketingActions, dispatch) })
)(MarketingPage)
