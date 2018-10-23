import React, { PureComponent } from 'react';
import { getRequest } from '../services/connection';
import { Poster } from '../components/Filme';
import styled from 'styled-components';
import Cast from '../components/Cast';

import 'font-awesome/css/font-awesome.min.css';

class FilmeDetalhe extends PureComponent {

  state =  {
    filme: {}
  }

  static contextTypes = {
    router: () => null, // replace with PropTypes.object if you use them
  }

  async componentDidMount() {
    try {
      const filme = await getRequest("filmes/detalhe/" + this.props.match.params.id);
      console.log(filme);
      this.setState({
        filme: filme.data.movie
      });
    }catch(e) {
      console.log(e);
    }
  }

  download = () => {
    let torrent = null

    for (let t of this.state.filme.torrents) {
      if (torrent == null || t.seeds > torrent.seeds) {
        torrent = t
      }
    }

    let mag = 'magnet:?xt=urn:btih:' + torrent.hash + '&dn=' + this.state.filme.slug + '&tr=- udp://tracker.openbittorrent.com:80'

    let link = document.createElement('a')
    link.id = 'someLink'

    link.href = mag;
    
    document.getElementById('lista').appendChild(link)
    document.getElementById('someLink').click()
    document.getElementById('someLink').outerHTML = ''
  }

  render() {
    const { filme } = this.state;

    return (
      <div>
        <Voltar onClick={this.context.router.history.goBack}>
          <i className="fa fa-arrow-left fa-2x"></i>
          <span>Voltar</span>
        </Voltar>

        {filme.id != null &&
          <FilmeWrapper backdrop={filme.large_screenshot_image1}>
            <FilmeInfo>
              <Poster src={filme.medium_cover_image} alt={filme.title} />

              <div>
                <div className="text-right">
                  <a className="btn btn-neutral" onClick={this.download}>
                    <i className="fa fa-download"></i>
                    Download
                  </a>
                </div>

                <h1>{filme.title}</h1>
                <h3>{filme.year}</h3>
                <p>{filme.description_full}</p>

                <FilmeRating>
                  <span>
                    <i className="fa fa-hourglass"></i>
                    {filme.runtime} Min
                  </span>

                  <span>
                    <i className="fa fa-star"></i>
                    {filme.rating}
                  </span>
                </FilmeRating>

                <hr />
                <br />

                <h3>Trailer</h3>
                <div className="video-container">
                  <iframe title="Trailer" width="853" height="480" src={'https://www.youtube.com/embed/' + filme.yt_trailer_code} allowFullScreen></iframe>
                </div>

                <Cast cast={filme.cast} />
              </div>
            </FilmeInfo>
          </FilmeWrapper>
        }

        <div id="lista"></div>
      </div>
    );
  }
}

export default FilmeDetalhe;

const Voltar = styled.div`
  text-align: left;
  color: white;
  padding: 0.5em 10%;
  cursor: pointer;
  > span {
    margin-left: 0.7em;
  }
`

const FilmeWrapper = styled.div`
  position: relative;
  padding-top: 50vh;
  background: url(${props => props.backdrop}) no-repeat;
  background-size: contain;
`

const FilmeRating = styled.div`
  padding: 0.5em;
  > span {
    padding: 0.5em;
  }
`

const FilmeInfo = styled.div`
  background: white;
  text-align: left;
  padding: 2rem 10%;
  display: flex;
  > div {
    width: 80%;
    margin-left: 20px;
  }

  div h1 {
    margin-top: 0px;
  }

  img {
    position: relative;
    top: -5em;
    height: 22em;
  }
`
