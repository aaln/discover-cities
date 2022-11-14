import css from './index.module.scss';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import GoogleMap from '../shared/components/GoogleMap';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import worldcities from '../shared/assets/cities.json';
import NProgress from "nprogress"
import Marker from '../shared/components/Marker';

const Map = () => {
  const [inputVal, setInputVal] = useState("");
  const [mapCoords, setMapCoords] = useState({ lat: 48.8566, lng: 2.3522 });
  const [city, setCity] = useState({"city":"Paris","city_ascii":"Paris","lat":48.8566,"lng":2.3522,"country":"France","iso2":"FR","iso3":"FRA","admin_name":"Île-de-France","capital":"primary","population":11027000,"id":1250015082});
  const render = (status) => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return null;
  };


  useEffect(() => {

  }, [])

  const getNewLocation = () => {
    const keys = Object.keys(worldcities);
    let city = {}
    while(true) {
      city = _.sample(worldcities, 1);
      if(city.population > 100000) {
        setMapCoords({ lat: city.lat, lng: city.lng })
        setCity(city)
        break;
      }
    }
    
  }
  //   <div className={css["form"]}>
  //   <input placeholder="Enter prompt here.... ex. take me to antartica" value={inputVal} onChange={((event) => setInputVal(event.target.value))} />
  //   <button>Search</button>
  // </div>
  return (
    <div className={css["map"]}>
      <div className={css['jumpLocationBtn']} onClick={() => { getNewLocation() }}>
        Discover New City
      </div>
      <div className={css['infoCard']}>
        <div className={css['city']}>{city.city}</div>
        <div className={css['country']}>{city.country}</div>
        <div className={css['population']}>{city.population.toLocaleString()}</div>
      </div>
      <Wrapper apiKey={"AIzaSyCsn23akKiKIIsEWu69XMTRGWQdz2v_jGo"} render={render}>
        <GoogleMap center={mapCoords} city={city}>
          <Marker position={mapCoords} />
          </GoogleMap>
      </Wrapper>
    </div>
  )
}



export default Map;