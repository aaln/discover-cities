// import {Client} from "@googlemaps/google-maps-services-js";

// const client = new Client({});
// console.log(Object.keys(client))
// client
//   .findPlaceFromText({
//     params: {
//       input: "museum",
//       inputtype: "textQuery",
      
//       // locations: [{ lat: 45, lng: -110 }],
//       key: "AIzaSyCsn23akKiKIIsEWu69XMTRGWQdz2v_jGo",
//     },
//     timeout: 1000, // milliseconds
//   })
//   .then((r) => {
//     console.log('data');
//     console.log(r.data);
//   })
//   .catch((e) => {
//     console.log('error', e);
//     console.log(e.response.data.error_message);
//   });

var axios = require('axios');
var api_key = 'AIzaSyCsn23akKiKIIsEWu69XMTRGWQdz2v_jGo';


const getTimezone = async (lat, lng) => {
  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=1331161200&key=${api_key}`,
    headers: { }
  };
  
  const response = await axios(config);
  console.log('response')
  return response.data.candidates[0];
}
const getPlace = async (query) => {
  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id%2Cformatted_address%2Cname%2Cgeometry%2Cphotos&key=${api_key}`,
    headers: { }
  };
  
  const response = await axios(config);
  return response.data.candidates[0];
}
export default async function locate(req, res) {
  const place = await getPlace(req.query.query);
  res.send(place);
  
}