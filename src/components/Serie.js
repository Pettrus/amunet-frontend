import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Serie = ({ serie }) => (
  <div className="pointer">
    <Poster src={serie.images == null ? serie.poster : serie.images.poster} alt={serie.imdb_id} style={{width: '90%'}} />
  </div>
);

Serie.propTypes = {
  serie: PropTypes.shape({
    imdb_id: PropTypes.string.isRequired
  }).isRequired
}

export default Serie;

export const Poster = styled.img`
  box-shadow: 0 0 35px black;
`
