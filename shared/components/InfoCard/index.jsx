import css from './infoCard.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import Moment from 'react-moment';
import moment from 'moment-timezone';
import { MdPlace, MdShare, MdMuseum } from 'react-icons/md';
import { GiForkKnifeSpoon, GiTigerHead } from 'react-icons/gi';

// Local time: 
const InfoCard = ({ city, loading, place, requestMarkersData = () => { } }) => {
  return (
    <div className={cn(css['infoCard'], {
      [css['loading']]: loading,
    })}>


      {
        loading ?

          <div className={css['loader']}>
            <div className={css["lds-ripple"]}><div></div><div></div></div>
          </div> :

          <>
            <div className={css['city']}>{city.city}</div>
            <div className={css['country']}>
              <div className={css['name']}>{city.country}</div>

              <div className={css['flag']}>
                <img src={`https://countryflagsapi.com/png/${city.iso2}`} />
              </div>

            </div>
            <div className={css['population']}> Population: {city.population.toLocaleString()}</div>


            <div className={css['localTime']}>
              Timezone: {place?.timezone?.timeZoneId}
            </div>
            <div className={css['localTime']}>
              <span>Local time</span> <Moment format="HH:mm" tz={`${place?.timezone?.timeZoneId}`} />
            </div>
            <div className={css['placeImgContainer']}>
              {
                (place?.place?.photos?.length > 0 && place?.place?.photos[0]?.photo_reference ? <img className={css['placeImg']} src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place?.place?.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`} /> : null)
              }
            </div>

            <div className={css['actions']}>
              <div className={css['action']} onClick={() => requestMarkersData("tourist_attraction")}>
                <MdPlace className={css['icon']} />
                <div>Tourist</div>
              </div>
              <div className={css['action']} onClick={() => requestMarkersData("museum")}>
                <MdMuseum className={css['icon']} />
                <div>Museums</div>
              </div>
              <div className={css['action']} onClick={() => requestMarkersData("food")}>
                <GiForkKnifeSpoon className={css['icon']} />
                <div>Food</div>
              </div>
              <div className={css['action']} onClick={() => requestMarkersData("zoo")}>
                <GiTigerHead className={css['icon']} />
                <div>Zoos</div>
              </div>

            </div>
          </>
      }

    </div>
  )
};

export default InfoCard;

