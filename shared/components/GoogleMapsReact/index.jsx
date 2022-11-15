import css from './googleMapsReact.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
const { compose, withProps, withState, withHandlers } = require("recompose");

const GoogleMapsReact = () => {

  const MapWithControlledZoom = compose(
    withProps({
      googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
  withState('zoom', 'onZoomChange', 8),
    withHandlers(() => {
      const refs = {
        map: undefined,
      }

      return {
        onMapMounted: () => ref => {
          refs.map = ref
        },
        onZoomChanged: ({ onZoomChange }) => () => {
          onZoomChange(refs.map.getZoom())
        }
      }
    }),
    withScriptjs,
    withGoogleMap
  ) (props =>
  <GoogleMap
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
    zoom={props.zoom}
    ref={props.onMapMounted}
    onZoomChanged={props.onZoomChanged}
  >
    <Marker
      position={{ lat: -34.397, lng: 150.644 }}
      onClick={props.onToggleOpen}
    >
      <InfoWindow onCloseClick={props.onToggleOpen}>
        <div>
          <FaAnchor />
          {" "}
          Controlled zoom: {props.zoom}
        </div>
      </InfoWindow>
    </Marker>
  </GoogleMap>
);

return (<MapWithControlledZoom />)

}

export default GoogleMapsReact;

