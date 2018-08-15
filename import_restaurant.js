const axios = require('axios');
const { Client } = require('graphqurl')
const client = new Client({
  endpoint: 'http://localhost:8080/v1alpha1/graphql',
  headers: {
    'Content-Type': 'application/json',
    'X-Hasura-Access-Key': 'mysecretkey'
  }
})

axios.get('https://api.gnavi.co.jp/RestSearchAPI/20150630/', {
  params: {
    keyid: '[replace with keyid]',
    format: 'json',
    areacode_l: 'AREAL2101'
  }
}).then(result => {
  const createRestaurant = `mutation insert_restaurant (
    $gurunavi_id: String!,
    $name:  String!,
    $name_kana: String!,
    $longitude: Float!,
    $latitude: Float!) {
      insert_restaurant(
        objects: [
          {
            gurunavi_id: $gurunavi_id,
            name: $name,
            name_kana: $name_kana,
            longitude: $longitude,
            latitude: $latitude
          }
        ]
      ) {
        returning {
          id
          name
          name_kana
        }
      }
    }`

    result.data.rest.forEach(async value => {
      const restaurantDetails = {
        gurunavi_id: value.id,
        name: value.name,
        name_kana: value.name_kana,
        longitude: value.longitude,
        latitude: value.latitude
      }

      console.log(restaurantDetails)

      await client.query(createRestaurant, restaurantDetails)
      .catch(error => {
        console.log(JSON.stringify(error, null, 2))
      })
    })

  })
