import css from './index.module.scss';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import GoogleMap from '../shared/components/GoogleMap';
import { useState } from 'react';
import _ from 'lodash';
import InfoCard from '../shared/components/InfoCard';
import worldcities from '../shared/assets/cities.json';
import axios from 'axios';
import defaultPlaces from '../shared/assets/default.json'

const defaultCity = { "city": "Paris", "city_ascii": "Paris", "lat": 48.8566, "lng": 2.3522, "country": "France", "iso2": "FR", "iso3": "FRA", "admin_name": "Île-de-France", "capital": "primary", "population": 11027000, "id": 1250015082 };

const Map = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [city, setCity] = useState(defaultCity);
  const [placeData, setPlaceData] = useState(defaultPlaces);
  const [markersData, setMarkersData] = useState([]);

  const getCityData = async (thisCity) => {
    const response = await axios.get(`/api/locate?query=${thisCity.city},${thisCity.country}`);
    return response.data;
  }

  const getNewLocation = async () => {
    await setIsLoading(true);
    const keys = Object.keys(worldcities);
    let city = {}
    while (true) {
      city = _.sample(worldcities, 1);
      if (city.population > 1000000) {
        await setPlaceData(await getCityData(city));
        await setCity(city);
        await setIsLoading(false);
        break;
      }
    }
  }
  const retrieveMarkersData = async (type) => {
    const response = await axios.get(`/api/places?lat=${city.lat}&lng=${cit.lat}&type=${type}`);
    setMarkersData(response.data);
  }
  const renderMap = (status) => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return null;
  };
  return (
    <div className={css["map"]}>
      <div className={css['jumpLocationBtn']} onClick={() => { getNewLocation() }}>
        {isLoading ? <span className={css["loader"]}></span> : "Discover New City"}
      </div>

      <InfoCard city={city} loading={isLoading} place={placeData} />
      {/*<FilterSettings />*/}


      <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} render={renderMap}>
        <GoogleMap center={{ lat: city.lat, lng: city.lng }} city={city} place={placeData}></GoogleMap>
      </Wrapper>



    </div>
  )
}



export default Map;