var axios = require('axios');

const getPlaces = async (lat, lng, type) => {
  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=200000&type=${type}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    headers: {}
  };

  const response = await axios(config);
  return response.data;  
}

export default async function locate(req, res) {
  const places = await getPlaces(req.query.lat, req.query.lng, req.query.type);
  res.status(200).send({ places });
}