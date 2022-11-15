import css from './filterSettings.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import Moment from 'react-moment';
import moment from 'moment-timezone';
import RangeSlider from 'react-range-slider-input';

const FilterSettings = ({ city, loading, place }) => {
  return (
    <div className={cn(css['filterSettings'])}>
        <div className={css['population']}>
          <RangeSlider />
        </div>
      </div>
  )
};

export default FilterSettings;

