import React from 'react';
import styled from 'styled-components';

const Cast = ({ cast }) => (
  <div>
    {cast != null && cast.length > 0 &&
      <div>
        <h2>Cast</h2>

        {cast.map(ator => (
          <div key={ator.name}>
            <a target="_blank" href={'https://www.imdb.com/name/nm' + ator.imdb_code}>
              <CastDetalhe>
                <img src={ator.url_small_image} alt="" />
                <h4>{ator.name}</h4>
                <small>{ator.character_name}</small>

                <div className="clear"></div>
              </CastDetalhe>
            </a>
          </div>
        ))}
      </div>
    }
  </div>
);

export default Cast;

const CastDetalhe = styled.div`
  > h4 {
    margin-bottom: 0px;
    padding-top: 0.7em;
  }

  img {
    margin-right: 1em;
    float: left;
    position: unset !important;
    border-radius: 50%;
    height: 50px !important;
    width: 50px;
  }
`
