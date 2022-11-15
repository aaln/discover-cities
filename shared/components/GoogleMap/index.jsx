import css from './googleMap.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { GoogleMapsOverlay as DeckOverlay } from '@deck.gl/google-maps';
import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers';
import { map_styles } from './map_styles';
import default_geojson from './default_geojson.json'
import { FaMapPin } from 'react-icons/fa';

const GoogleMap = ({ city = { lat: 48.8566, lng: 2.3522 }, place = {}, markersData = [] }) => {
  const mapRef = useRef();
  const [currentMap, setCurrentMap] = useState();

  const [mapClicks, setMapClicks] = useState([]);
  const [zoom, setZoom] = useState(10); // initial zoom
  const [center, setCenter] = useState({
    lat: city.lat,
    lng: city.lng,
  });

  useEffect(() => {
    console.log('place', place);
  }, [place])
  const onMapClick = (e) => {
    setMapClicks([...mapClicks, e.latLng]);
  };

  const onIdle = (m) => {
    console.log("onIdle");
    setZoom(m.getZoom());
    setCenter(m.getCenter().toJSON());
  };

  const setOverlay = (map) => {
    const overlay = new DeckOverlay({
      layers: [
        new GeoJsonLayer({
          id: 'city_polygon',
          data: place?.geoJSON?.geojson ?? default_geojson,
          // Styles
          filled: true,
          pointRadiusMinPixels: 8,
          pointRadiusScale: 2000,
          getPointRadius: f => 11 - f.properties.scalerank,
          getFillColor: [41, 41, 65, 50],
          // Interactive props
          pickable: true,
          // autoHighlight: true,
          onClick: info =>
            // eslint-disable-next-line
            info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
        }),
      ]
    });

    overlay.setMap(map);

  }


  const contentString = `<div>
    
  
  </div>`

  function setMarker(map) {
    if (map) {
      let infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: "Uluru",
      });
      let marker = new google.maps.Marker({
        position: map.getCenter(),
        draggable: true,
        map: map,
      });

      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
        });
      });

    }
  }
  function addMarkersCustom(map, markersData) {
    if (map && markersData?.length > 0) {
      markersData.forEach((p) => {
        console.log('p', p)
        let content = `<h5>${p.name}</h5>`;
        if (p?.photos?.length > 0) {
          content = content + `<img style="max-height: 25px" src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}" />`
        }

        let infowindow = new google.maps.InfoWindow({
          content,
          ariaLabel: "Uluru",
        });
        let marker = new google.maps.Marker({
          position: { lat: p.geometry.location.lat, lng: p.geometry.location.lng },

          map: map,
          scale: 10,
        });
        marker.addListener("click", () => {
          infowindow.open({
            anchor: marker,
            map,
          });
        });
      })
    }
  }
  function addMarkers(map) {
    if (map && place?.places?.results) {
      place.places.results.forEach((p) => {
        console.log('p', p)
        let content = `<h5>${p.name}</h5>`;
        if (p?.photos?.length > 0) {
          content = content + `<img style="max-height: 25px" src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}" />`
        }

        let infowindow = new google.maps.InfoWindow({
          content,
          ariaLabel: "Uluru",
        });
        let marker = new google.maps.Marker({
          position: { lat: p.geometry.location.lat, lng: p.geometry.location.lng },
          animation: google.maps.Animation.DROP,
          map: map,
          scale: 10,
        });
        marker.addListener("click", () => {
          infowindow.open({
            anchor: marker,
            map,
          });
        });
      })
    }
  }
  // the smooth zoom function
  function smoothZoom(map, max, cnt) {
    if (cnt >= max) {
      return;
    }
    else {
      let z = google.maps.event.addListener(map, 'zoom_changed', function(event) {
        google.maps.event.removeListener(z);
        smoothZoom(map, max, cnt + 1);
      });
      setTimeout(function() { map.setZoom(cnt) }, 200); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
  }
  function smoothZoomOut(map, min, cnt) {
    if (cnt <= min) {
      return;
    }
    else {
      let z = google.maps.event.addListener(map, 'zoom_changed', function(event) {
        google.maps.event.removeListener(z);
        smoothZoom(map, min, cnt - 1);
      });
      setTimeout(function() { map.setZoom(cnt) }, 250); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
  }



  useEffect(() => {
    if (currentMap) {
      ["click", "idle", "dblclick"].forEach((eventName) =>
        window.google.maps.event.clearListeners(currentMap, eventName)
      );

      // add the double-click event listener
      // currentMap.addListener('dblclick', function(event) {
      //   let latlng = new google.maps.LatLng(city.lat, city.lng);
      //   currentMap.setCenter(latlng)
      //   smoothZoom(currentMap, 12, currentMap.getZoom()); 
      // });


      if (onMapClick) {
        currentMap.addListener("click", onMapClick);
      }

      if (onIdle) {
        currentMap.addListener("idle", () => onIdle(currentMap));
      }
    }
  }, [currentMap, onMapClick, onIdle]);


  useEffect(() => {
    setTimeout(() => {
      if (currentMap) {
        // currentMap.setZoom(5);
        smoothZoom(currentMap, 11, currentMap.getZoom());
      }
    }, 1000);
    setOverlay(currentMap)
    addMarkers(currentMap);

  }, [currentMap])

  const initMap = async () => {
    let map = new window.google.maps.Map(mapRef.current, {
      mapId: "c5ba58b2056b28c9",
      center: center,
      zoom,
      styles: map_styles
    });

  }
  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      let latlng1 = new google.maps.LatLng(city.lat, city.lng);
      // currentMap.setCenter(latlng1);
      setCurrentMap(new window.google.maps.Map(mapRef.current, {
        mapId: "c5ba58b2056b28c9",
        center: {
          lat: city.lat,
          lng: city.lng
        },
        zoom: 5,
        styles: map_styles
      }));
      setOverlay(currentMap)
      addMarkers(currentMap);

      // setTimeout(() => {
      //   let latlng = new google.maps.LatLng(city.lat, city.lng);
      //   smoothZoom(currentMap, 10, currentMap.getZoom());

      // }, 1000)

    }
  }, [city]);

  return (
    <div ref={mapRef} id="map" className={css['map']} />
  )
}

export default GoogleMap;
