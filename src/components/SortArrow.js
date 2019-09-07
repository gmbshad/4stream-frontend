import React from 'react';

import {SORTING_ORDER} from '../utils/Constants';

export default class SortArrow extends React.Component {
    render() {
      const {sortOrder} = this.props;
      let sortingClass = '';
      if (sortOrder === SORTING_ORDER.ACS) {
        sortingClass = 'b-sorting-arrow--asc';
      } else if (sortOrder === SORTING_ORDER.DESC) {
        sortingClass = 'b-sorting-arrow--desc';
      }
      const classes = `b-sorting-arrow ${sortingClass}`;
      return (
        <div className={classes}>
        </div>  
      );
    }
}

SortArrow.propTypes = {
  sortOrder: React.PropTypes.oneOf(Object.keys(SORTING_ORDER).map(key => SORTING_ORDER[key]))
};

