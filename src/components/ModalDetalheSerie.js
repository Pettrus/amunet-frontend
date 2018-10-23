import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getRequest, postRequest } from '../services/connection';
import styled from 'styled-components';
import SkeletonLoaderModal from './SkeletonLoaderModal';

class ModalDetalheSerie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      serie: null,
      carregado: false,
      serieId: null,
      episodio: null,
      carregando: false,
      listaTodosEps: [],
      seasonSelecionada: 1,
      epSelecionado: 1
    };

    this.toggle = this.toggle.bind(this);
  }

  async componentWillReceiveProps(prop) {
    if(prop.serie !== null && prop.serie !== this.state.serieId) {
      this.setState({
        modal: prop.estadoModal,
        serie: {},
        carregado: false,
        serieId: prop.serie,
        listaTodosEps: []
      });

      const serie = await getRequest("series/detalhe/" + prop.serie);
      let proximoEpisodio = null;
      let listaTodosEps = {};
      let achou = false;

      if(serie.temporada_assistido != null) {
        for(let ep of serie.episodes) {
          if(listaTodosEps[ep.season] == null) {
            listaTodosEps[ep.season] = [ep.episode];
          }else {
            listaTodosEps[ep.season].push(ep.episode);
          }

          if(serie.temporada_assistido+1 === ep.season && ep.episode === 1 && !achou) {
            proximoEpisodio = ep;
          }else if(serie.temporada_assistido === ep.season && serie.episodio_assistido+1 === ep.episode) {
            proximoEpisodio = ep;
            achou = true;
          }
        }
      }

      Object.keys(listaTodosEps).forEach(function(key,index) {
        listaTodosEps[key].sort((a, b) => a -b );
      });

      this.setState({
        serie: serie,
        carregado: true,
        episodio: proximoEpisodio,
        listaTodosEps: listaTodosEps,
        seasonSelecionada: proximoEpisodio == null ? 1 : proximoEpisodio.season,
        epSelecionado: proximoEpisodio == null ? 1 : proximoEpisodio.episode
      });
    }
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  removerDaLista = async () => {
    try {
      if(!this.state.carregando) {
        this.setState({
          carregando: true
        });
  
        await postRequest("series/remover", {
          imdb_id: this.state.serie.imdb_id
        });
  
        if(typeof this.props.removerComponentPai === "function") {
          this.props.removerComponentPai(this.state.serie);
        }
  
        setTimeout(() => {
          this.toggle();
  
          this.setState({
            carregando: false
          });  
        }, 500);
      }
    }catch(e) {
      console.log(e);
    }
  }

  download = async () => {
    try {
      let torrent = null;

      const season = this.state.episodio == null ? 1 : this.state.episodio.season;
      const ep = this.state.episodio == null ? 1 : this.state.episodio.episode;

      for (let e of this.state.serie.episodes) {
        if(e.episode === 1 && e.season === 1) {
          Object.keys(e.torrents).forEach(function(key,index) {
            if (torrent === null || e.torrents[key].seeds > torrent.seeds) {
              torrent = e.torrents[key]
            }
          });

          break;
        }
      }

      await postRequest('series/download', {
        imdb_id: this.state.serie.imdb_id,
        temporada: season,
        episodio: ep,
        poster: this.state.serie.images.poster
      });

      let link = document.createElement('a');
      link.id = 'someLink';

      link.href = torrent.url;

      document.getElementById('lista').appendChild(link);
      document.getElementById('someLink').click();
      document.getElementById('someLink').outerHTML = '';

      setTimeout(() => {
        this.toggle();
      }, 500);
    }catch(e) {
      console.log(e);
    }
  }

  trocouSeason = (data) => {
    let proxEp = {};
    console.log("trocou season");

    for(let ep of this.state.serie.episodes) {
      if(ep.season == data.target.value && ep.episode == 1) {
        proxEp = ep;
        break;
      }
    }

    this.setState({
      seasonSelecionada: data.target.value,
      epSelecionado: 1,
      episodio: proxEp
    });
  }

  trocouEp = (data) => {
    let proxEp = {};

    console.log(this.state.seasonSelecionada);

    for(let ep of this.state.serie.episodes) {
      if(ep.season == this.state.seasonSelecionada && ep.episode == data.target.value) {
        proxEp = ep;
        break;
      }
    }

    console.log(proxEp);

    this.setState({
      epSelecionado: data.target.value,
      episodio: proxEp
    });
  }

  render() {
    const { serie, carregado } = this.state;

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
                    <Poster src={serie.images.poster} alt={serie.title} />
                  </div>

                  <div className="col-12 col-md-8">
                    <div className="text-center">
                        <h2>{serie.title}</h2>
                        <h4>{serie.year}</h4>

                        <SerieRating>
                            <span>
                                <i className="fa fa-hourglass"></i>
                                {serie.runtime} Min
                            </span>

                            <span>
                                <i className="fa fa-star"></i>
                                {serie.rating.percentage}%
                            </span>

                            <span>
                                {serie.num_seasons} Temporadas
                            </span>
                        </SerieRating>
                    </div>

                    <p className="text-justify">{serie.synopsis}</p>
                  </div>
                </div>

                {serie.episodes.length > 0 &&
                    <div>
                        <hr />

                        <div>
                            <div className="text-center">
                                {this.state.episodio != null ? this.state.episodio.title : serie.episodes[0].title}
                                <div>
                                    {this.state.episodio != null &&
                                      <div className="form-inline">
                                        <div className="form-group" style={{marginLeft: 'auto', marginRight: '1em'}}>
                                          <select className="form-control" value={this.state.episodio.season} onChange={this.trocouSeason}>
                                            {Object.keys(this.state.listaTodosEps).map(key => (
                                              <option key={key} value={key}>S{key}</option>
                                            ))}
                                          </select>
                                        </div>

                                        <div className="form-group" style={{marginRight: 'auto'}}>
                                          <select className="form-control" value={this.state.episodio.episode} onChange={this.trocouEp}>
                                            {this.state.listaTodosEps[this.state.seasonSelecionada].map(ep => (
                                              <option key={ep} value={ep}>E{ep}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    }

                                    {this.state.episodio == null &&
                                      <span>S1 EP1</span>
                                    }
                                </div>
                            </div>

                            <p className="text-justify">
                              {this.state.episodio != null ? this.state.episodio.overview : serie.episodes[0].overview}
                            </p>
                        </div>

                        <div className="text-center">
                            <a className="btn btn-default cor-branco" onClick={this.download}>
                                <i className="fa fa-download"></i>
                                Download
                            </a>
                        </div>
                    </div>
                }
              </div>
            }
          </ModalBody>
          <ModalFooter>
            {(this.state.serie != null && this.state.serie.temporada_assistido != null) &&
              <div className="pull-left">
                <button className="btn btn-danger" onClick={this.removerDaLista} disabled={this.state.carregando}>Remover</button>
              </div>
            }
            <button className="btn btn-neutral" onClick={this.toggle} disabled={this.state.carregando}>Fechar</button>
          </ModalFooter>
        </Modal>

        <div id="lista"></div>
      </div>
    );
  }
}

export default ModalDetalheSerie;

const SerieRating = styled.div`
  padding: 0.5em;
  > span {
    padding: 0.5em;
  }
  span i {
    margin-right: 7px;
  }
`
export const Poster = styled.img`
  box-shadow: 0 0 35px black;
  width: 100%;
`