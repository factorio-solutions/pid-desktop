import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import Map, { Marker }                 from 'google-maps-react'

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
    actions: PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initMarketingPage(this.props.params.short_name, () => { this.forceUpdate() }) // to redraw map to show correct position
  }

  render() {
    const { state, actions } = this.props
    const { marketing }      = state

    const properties = [ { icon: <div><i className="fa fa-compress" title='size_restriction'></i></div>
                         , key:  'size_restriction'
                         }
                       , { icon: <div><i className="fa fa-repeat" title='non_stop_open'></i></div>
                         , key:  'non_stop_open'
                         }
                       , { icon: <div><i className="fa fa-repeat" title='non_stop_reception'></i><i className="fa fa-female" title='non_stop_reception'></i></div>
                         , key:  'non_stop_reception'
                         }
                       , { icon: <div><i className="fa fa-mobile" title='gate_opened_by_phone'></i><i className="fa fa-window-maximize" title='gate_opened_by_phone'></i></div>
                         , key:  'gate_opened_by_phone'
                         }
                       , { icon: <div><i className="fa fa-female" title='gate_opened_by_receptionist'></i><i className="fa fa-window-maximize" title='gate_opened_by_receptionist'></i></div>
                         , key:  'gate_opened_by_receptionist'
                         }
                       , { icon: <div><i className="fa fa-building" title='historical_center'></i></div>
                         , key:  'historical_center'
                         }
                       , { icon: <div><i className="fa fa-building-o" title='city_center'></i></div>
                         , key:  'city_center'
                         }
                       , { icon: <div>5m<i className="fa fa-building-o" title='five_minutes_from_center'></i></div>
                         , key:  'five_minutes_from_center'
                         }
                       , { icon: <div>10m<i className="fa fa-building-o" title='ten_minutes_from_center'></i></div>
                         , key:  'ten_minutes_from_center'
                         }
                       , { icon: <div>15m<i className="fa fa-building-o" title='fifteen_minutes_from_center'></i></div>
                         , key:  'fifteen_minutes_from_center'
                         }
                       , { icon: <div><i className="fa fa-video-camera" title='cameras'></i></div>
                         , key:  'cameras'
                         }
                       , { icon: <div><i className="fa fa-video-camera" title='camera_at_gate'></i><i className="fa fa-window-maximize" title='camera_at_gate'></i></div>
                         , key:  'camera_at_gate'
                         }
                       , { icon: <div><i className="fa fa-train" title='tram_nearby'></i></div>
                         , key:  'tram_nearby'
                         }
                       , { icon: <div><i className="fa fa-subway" title='subway_nearby'></i></div>
                         , key:  'subway_nearby'
                         }
                       , { icon: <div><i className="fa fa-shower" title='wc'></i></div>
                         , key:  'wc'
                         }
                       , { icon: <div>5m<i className="fa fa-subway" title='five_minutes_from_subway'></i></div>
                         , key:  'five_minutes_from_subway'
                         }
                       , { icon: <div><i className="fa fa-video-camera" title='number_plate_recognition'></i><i className="fa fa-address-card-o" title='number_plate_recognition'></i></div>
                         , key:  'number_plate_recognition'
                         }
                       , { icon: <div><i className="fa fa-bolt" title='charging_station'></i></div>
                         , key:  'charging_station'
                         }
                       ]

    // download page first, make sure marketing is launched
    if (marketing == undefined || marketing.marketing_launched != true){
      return null
    }

    const filterLanguages = (lang) => {
      return marketing.descriptions.map((desc)=> {return desc.language}).includes(lang)
    }

    const filterProperties = (propertie) => {
      return marketing[propertie.key]
    }

    const prepareLanguages = (lang, index) => {
      const langClick = () => { this.context.router.push(`/${lang}${window.location.hash.substring(4)}`) }
      return <span key={index} className={window.location.hash.substring(2,4) == lang && styles.active} onClick={langClick}>{lang.toUpperCase()}</span>
    }

    const prepareImages = (image) => {
      return image.img
    }

    const prepareTableBody = (propertie, index, arr) => { // make pairs into tr
      if (index % 2 === 0) {
        return <tr>
          <td className={styles.active}>
            {arr[index].icon}
            {t(['newMarketing', arr[index].key])}
          </td>
          {arr[index+1] !== undefined && <td className={styles.active}>
            {arr[index+1].icon}
            {t(['newMarketing', arr[index+1].key])}
          </td>}
        </tr>
      } else {
        return null
      }
    }



    return (
      <div className={styles.container}>

        <div className={styles.pidHeader}>
          <a href={`https://${process.env.CLIENT_DOMAIN || 'localhost:8080'}/`}>
            <Logo />
          </a>
          <div className={styles.languages}> {AVAILABLE_LANGUAGES.filter(filterLanguages).map(prepareLanguages)} </div>
        </div>

        {marketing.images && <Carousel width='100%' height='500px' images={marketing.images.map(prepareImages)} />}

        <div className={styles.content}>
          <div className={styles.displayFlex}>
            <div className={styles.textContent}>
              <h1>{marketing.garage.name}</h1>
              <h3>{t(['marketing', 'description'])}</h3>
              <div className={styles.innerContent} dangerouslySetInnerHTML={{__html: marketing.descriptions.filter((desc) => {return desc.language == window.location.hash.substring(2,4)})[0].text}} />

              <h3>{t(['marketing', 'properties'])}</h3>
              <div className={styles.innerContent} >
                <table className={styles.propertiesTtable}>
                  <tbody>
                    {properties.filter(filterProperties).map(prepareTableBody)}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.contacts}>
              <h2>{t(['marketing', 'contacts'])}</h2>
              <div className={styles.contact}>
                <i className="fa fa-phone" aria-hidden="true"></i><br/>
                {marketing.phone}
              </div>
              <div className={styles.contact}>
                <i className="fa fa-at" aria-hidden="true"></i><br/>
                {marketing.email}
              </div>
              <div className={styles.contact}>
                <i className="fa fa-map-marker" aria-hidden="true"></i><br/>
                <strong>{marketing.garage.name}</strong><br/>
                {marketing.garage.address.line_1}<br/>
                {marketing.garage.address.line_2}{marketing.garage.address.line_2 && <br/>}
                {marketing.garage.address.city}<br/>
                {marketing.garage.address.postal_code}<br/>
                {marketing.garage.address.state}{marketing.garage.address.state && <br/>}
                {marketing.garage.address.country}<br/>
                <small>{t(['marketing', 'lat'])}: {marketing.garage.address.lat}, {t(['marketing', 'lng'])}: {marketing.garage.address.lng}<br/></small>
              </div>
            </div>
          </div>

          <div className={styles.mapConiner}>
            <Map google={window.google} zoom={14} center={{lat: marketing.garage.address.lat, lng: marketing.garage.address.lng}} style={{height: '400px', maxWidth: '700px'}}>
              <Marker position={{lat: marketing.garage.address.lat, lng: marketing.garage.address.lng}} name='garagePosition'/>
            </Map>
          </div>
        </div>

      </div>
    )
  }
}

export default connect(
  state    => ({ state: state.marketing }),
  dispatch => ({ actions: bindActionCreators(marketingActions, dispatch) })
)(MarketingPage)
