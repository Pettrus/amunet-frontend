import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Filme = ({ filme }) => (
  <div className="pointer">
    {filme.id != null &&
      <Poster src={filme.medium_cover_image} alt={filme.title} />
    }
  </div>
);

Filme.propTypes = {
  filme: PropTypes.shape({
    title: PropTypes.string.isRequired
  }).isRequired
}

export default Filme;

export const Poster = styled.img`
  box-shadow: 0 0 35px black;
`
