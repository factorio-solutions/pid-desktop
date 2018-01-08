export default function geocode(callback, line1, city, postalCode, country) {
  const geocoder = new google.maps.Geocoder()

  geocoder.geocode({ address: `${line1}, ${city}, ${postalCode}, ${country}` }, (results, status) => {
    if (status === 'OK') {
      callback(results[0].geometry.location.lat(), results[0].geometry.location.lng())
    } else {
      console.log(`Geocode was not successful on ${line1}, ${city}, ${postalCode}, ${country} for the following reason: ` + status)
      callback(undefined, undefined)
    }
  })
}
