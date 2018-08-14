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
    keyid: '[replace_with_keyid]',
    format: 'json',
    areacode_l: 'AREAL2101'
  }
}).then(result => {
  result.data.rest.forEach(async value => {
    /*
    const restaurantDetails = {
      gurunaviId: value.id,
      update_date: value.update_date,
      name: value.name,
      name_kana: value.name_kana,
      latitude: value.latitude,
      longitude: value.longitude,
      category: value.category,
      url: value.url,
      url_mobile: value.url_mobile,
      shop_image1: value.shop_image1,
      shop_image2: value.shop_image2,
      qrcode: value.qrcode,
      address: value.address,
      tel: value.tel,
      tel_sub: value.tel_sub,
      fax: value.fax,
      opentime: value.opentime,
      holiday: value.holiday,
      parking_lots: value.parking_lots,
      budget: value.budget,
      party: value.party,
      lunch: value.lunch,
      credit_card: value.credit_card,
      e_money: value.e_money
    }
    */

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

    const restaurantDetails = {
      gurunavi_id: value.id,
      name: value.name,
      name_kana: value.name_kana,
      longitude: value.longitude,
      latitude: value.latitude
    }

    await client.query(createRestaurant, restaurantDetails)
  })
})
