import css from './googleMap.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';

const GoogleMap = ({ city = { lat: 48.8566, lng: 2.3522 }}) => {
  const ref = useRef();
  const [currentMap, setCurrentMap] = useState();

  const [clicks, setClicks] = useState([]);
  const [zoom, setZoom] = useState(10); // initial zoom
  const [center, setCenter] = useState({
    lat: city.lat,
    lng: city.lng,
  });

  const onClick = (e) => {
    // avoid directly mutating state
    setClicks([...clicks, e.latLng]);
  };
  
  const onIdle = (m) => {
    console.log("onIdle");
    setZoom(m.getZoom());
    setCenter(m.getCenter().toJSON());
  };

  useEffect(() => {
  if (currentMap) {
    ["click", "idle"].forEach((eventName) =>
      google.maps.event.clearListeners(currentMap, eventName)
    );
    if (onClick) {
      currentMap.addListener("click", onClick);
    }

    if (onIdle) {
      currentMap.addListener("idle", () => onIdle(currentMap));
    }
  }
}, [currentMap, onClick, onIdle]);

  
    

  const createMarker = async ({ lat, lng }) => {
    if (currentMap) {
      const svgMarker = {
        path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "blue",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new window.google.maps.Point(15, 30),
      };

      new window.google.maps.Marker({
        position: currentMap.getCenter(),
        icon: svgMarker,
        map: currentMap,
      });
    }


  }
  const initMap = async () => {
    let map = new window.google.maps.Map(ref.current, {
      mapId: "b385199a3d5ff27",
      center: center,
      zoom,
    });

    // let service = new window.google.maps.places.PlacesService(map);
    // console.log('service', service);
    
    new window.google.maps.Marker({
      map,
      position: center,
    });

    const svgMarker = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };

  new google.maps.Marker({
    position: map.getCenter(),
    icon: svgMarker,
    map: map,
  });
    
  }
  useEffect(() => {
    initMap();
  }, []);

  // useEffect(() => {
  //   if (ref.current && !currentMap) {
  //     setCurrentMap(new window.google.maps.Map(ref.current, {}));
  //   }
  // }, [ref, currentMap]);
  useEffect(() => {
    console.log('city', city);
    setCenter({
      lat: city.lat,
      lng: city.lng,
    });
    if (ref.current) {
      setCurrentMap(new window.google.maps.Map(ref.current, {
        mapId: "b385199a3d5ff27",
        center: {lat: city.lat,
      lng: city.lng},
        zoom,
      }));

    }
    createMarker({ lat: city.lat, lng: city.lng });
  }, [city]);
  // useEffect(() => {
  //   if (map) {
  //     createMarker({ lat: city.lat, lng: city.lng })
  //   }
  // }, [city]);


  return (
    <>
    <div ref={ref} id="map" className={css['map']} />
     
    </>
    

    
  )
}



export default GoogleMap;