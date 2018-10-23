import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getRequest, postRequest } from '../services/connection';
import { Poster } from '../components/Filme';
import styled from 'styled-components';
import Cast from '../components/Cast';
import SkeletonLoaderModal from './SkeletonLoaderModal';
import { Link } from 'react-router-dom';

class ModalDetalhe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      filme: null,
      carregado: false,
      filmeId: null
    };

    this.toggle = this.toggle.bind(this);
  }

  async componentWillReceiveProps(prop) {
    if(prop.filme !== null && prop.filme !== this.state.filmeId) {
      this.setState({
        modal: prop.estadoModal,
        filme: {},
        carregado: false,
        filmeId: prop.filme
      });

      const filme = await getRequest("filmes/detalhe/" + prop.filme);

      console.log(filme.data.movie);

      this.setState({
        filme: filme.data.movie,
        carregado: true
      });
    }
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
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

    link.href = mag

    document.getElementById('lista').appendChild(link)
    document.getElementById('someLink').click()
    document.getElementById('someLink').outerHTML = ''
  }

  assistirOnline = async () => {
    let torrent = null

    for (let t of this.state.filme.torrents) {
      if (torrent == null || t.seeds > torrent.seeds) {
        torrent = t
      }
    }

    await postRequest("assistir-online/pre-assistir", {
      torrentHash: torrent.hash,
      slug: this.state.filme.slug,
      imdb: this.state.filme.imdb_code,
      nome: this.state.filme.title,
      background: this.state.filme.large_screenshot_image1
    });
  }

  render() {
    const { filme, carregado } = this.state;

    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-lg">
          <ModalHeader toggle={this.toggle}>Detalhes</ModalHeader>
          <ModalBody>
            {!carregado &&
              <SkeletonLoaderModal></SkeletonLoaderModal>
            }
            {carregado &&
              <div>
                <div className="row">
                  <div className="col-12 col-md-4 text-center">
                    <Poster src={filme.medium_cover_image} alt={filme.title} />
                  </div>

                  <div className="col-12 col-md-8">
                    <div className="text-center">
                      <h2>{filme.title}</h2>
                      <h4>
                        {filme.year}
                      </h4>

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
                    </div>

                    <p>{filme.description_full}</p>

                    <a className="btn btn-default cor-branco" onClick={this.download}>
                      <i className="fa fa-download"></i>
                      Download
                    </a>

                    <Link className="btn btn-primary cor-branco" to={'/assistir-online'} onClick={this.assistirOnline}>
                      <i className="fa fa-eye"></i>
                      Assistir online
                    </Link>
                  </div>
                </div>

                <hr />

                <h3>Trailer</h3>
                <div className="video-container">
                  <iframe title="Trailer" width="853" height="480" src={'https://www.youtube.com/embed/' + filme.yt_trailer_code} allowFullScreen></iframe>
                </div>

                <hr />

                <Cast cast={filme.cast} />
              </div>
            }
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-neutral" onClick={this.toggle}>Fechar</button>
          </ModalFooter>
        </Modal>

        <div id="lista"></div>
      </div>
    );
  }
}

export default ModalDetalhe;

const FilmeRating = styled.div`
  padding: 0.5em;
  > span {
    padding: 0.5em;
  }
  span i {
    margin-right: 7px;
  }
`
