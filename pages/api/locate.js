var axios = require('axios');

const getGeoJSON = async (query) => {
  const { data, error } = await axios.get(`https://nominatim.openstreetmap.org/search.php?q=${query}&polygon_geojson=1&format=jsonv2`);
  console.log({ data, error });

  const picked = data.reduce((prev, item) => {
    if (prev) return prev;
    if (item.category === "boundary") {
      return item;
    }
  }, null)
  return picked;
}
const getTimezone = async (lat, lng) => {
  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=1331161200&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    headers: {}
  };

  const response = await axios(config);
  console.log(response.data);
  return response.data;
}

const getTouristPlaces = async (lat, lng) => {
  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=200000&type=tourist_attraction,point_of_interest&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    headers: {}
  };

  const response = await axios(config);
  console.log(response.data);
  return response.data;  
}
const getPlace = async (query) => {
  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id%2Cformatted_address%2Cname%2Cgeometry%2Cphotos&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    headers: {}
  };

  const response = await axios(config);
  console.log(response.data);
  return response.data.candidates[0];
}
export default async function locate(req, res) {
  const place = await getPlace(req.query.query);
  const timezone = await getTimezone(place.geometry.location.lat, place.geometry.location.lng)
  const geoJSON = await getGeoJSON(req.query.query);
  const places = await getTouristPlaces(place.geometry.location.lat, place.geometry.location.lng);
  res.status(200).send({ place, timezone, geoJSON, places });
}