const axios = require('axios');
const { Client } = require('graphqurl')
const client = new Client({
  endpoint: 'http://localhost:8080/v1alpha1/graphql',
  headers: {
    'Content-Type': 'application/json',
    'X-Hasura-Access-Key': 'mysecretkey'
  }
})

const langs = ['ja', 'zh_cn', 'zh_tw', 'ko', 'en']

const createRestaurantDescriptionMutation = `mutation insert_restaurant_description (
  $gurunavi_id: String!,
  $lang: String!,
  $name: String,
  $business_hour: String,
  $holiday: String,
  $access: String,
  $pr_short: String,
  $pr_long: String) {
    insert_restaurant_description(
      objects: [
      {
        gurunavi_id: $gurunavi_id,
        lang: $lang,
        name: $name,
        business_hour: $business_hour,
        holiday: $holiday,
        access: $access,
        pr_short: $pr_short,
        pr_long: $pr_long
      }
    ]
  ) {
      returning {
      id
      name
    }
  }
}`

const getRestaurantsQuery = `query restaurant {
  restaurant {
    id
    name
    gurunavi_id
  }
}`

createRestaurantDescription()

async function createRestaurantDescription() {
  const result = await client.query(getRestaurantsQuery)

  let gurunavi_ids = []
  result.data.restaurant.forEach(value => {
    gurunavi_ids.push(value.gurunavi_id)
  })

  langs.forEach(async lang => {
    const result = await axios.get('https://api.gnavi.co.jp/ForeignRestSearchAPI/20150630/', {
      params: {
        keyid: '[replace with keyid]',
        format: 'json',
        lang: lang,
        id: gurunavi_ids.join(",")
      }
    })

    result.data.rest.forEach(async restaurant => {
      const restaurantDescriptionDetails = {
        gurunavi_id: restaurant.id,
        lang: lang,
        name: restaurant.name.name,
        name_sub: restaurant.name.name_sub,
        business_hour: restaurant.business_hour,
        holiday: JSON.stringify(restaurant.holiday),
        access: restaurant.access,
        pr_short: JSON.stringify(restaurant.sales_points.pr_short),
        pr_long: JSON.stringify(restaurant.sales_points.pr_long)
      }

      await client.query(createRestaurantDescriptionMutation, restaurantDescriptionDetails)
      .catch(error => {
        console.log(JSON.stringify(error, null, 2))
      })
    })
  })
}
