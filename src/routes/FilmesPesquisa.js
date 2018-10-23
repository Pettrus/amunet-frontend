import React, { PureComponent } from 'react';

import Serie from '../components/Serie';
import Filme from '../components/Filme';
import { getRequest } from '../services/connection';
import styled from 'styled-components';
import ModalDetalhe from '../components/ModalDetalhe';
import ModalDetalheSerie from '../components/ModalDetalheSerie';
import SkeletonLoader from '../components/SkeletonLoader';

class FilmesPesquisa extends PureComponent {

  state =  {
    filmes: [],
    series: [],
    filmeDetalhe: null,
    serieDetalhe: null,
    mostrarModal: false,
    mostrarModalSerie: false,
    carregando: false,
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.listarFilmes();
    }
  }

  componentDidMount() {
    this.listarFilmes();
  }

  listarFilmes = async () => {
    try {
      this.atualizarLista([], [], true);
      let filmes = await getRequest("filmes/pesquisar/" + this.props.match.params.nome);
      let series = await getRequest("series/pesquisar/" + this.props.match.params.nome);

      console.log(series);

      this.atualizarLista(filmes.data.movies, series, false);
    }catch(e) {
      console.log(e);
    }
  }

  atualizarLista = (lista, series, carregando) => {
    this.setState({
      filmes: lista,
      series: series,
      carregando: carregando
    });
  }

  abrirModal = (filmeId) => {
    if(filmeId !== this.state.filmeDetalhe) {
      this.setState({
        filmeDetalhe: filmeId,
        mostrarModal: true
      });
    }
  }

  abrirModalSerie = (serieId) => {
    if(serieId !== this.state.serieDetalhe) {
      this.setState({
        serieDetalhe: serieId,
        mostrarModalSerie: true
      });
    }
  }

  render() {
    return (
      <div>
        <div className="capitalize">
          <h2 className="cor-branco">{this.props.match.params.nome}</h2>
        </div>

        {this.state.carregando &&
          <div className="row">
            {[...Array(12)].map((e, i) => (
              <SkeletonLoader key={i}></SkeletonLoader>
            ))}
          </div>
        }

        {!this.state.carregando &&
          <div>
            <div>
              <h3 className="cor-branco">Filmes</h3>
            </div>

            {this.state.filmes == null &&
              <h4 className="text-center cor-branco">
                Nenhum filme encontrado
              </h4>
            }

            {this.state.filmes != null &&
              <div className="row">
                {this.state.filmes.map(filme => (
                  <FilmeGrid key={filme.id} className="col-sm-5 col-md-4 col-lg-3 col-xl-2" onClick={() => this.abrirModal(filme.id)}>
                    <Filme filme={filme} />
                  </FilmeGrid>
                ))}
              </div>
            }

            <hr style={{borderColor: 'white'}} />

            <div>
              <h3 className="cor-branco">Series</h3>
            </div>

            {this.state.series != null &&
              <div className="row">
                {this.state.series.map(serie => (
                  <FilmeGrid key={serie.imdb_id} className="col-sm-6 col-md-4 col-lg-3 col-xl-2" onClick={() => this.abrirModalSerie(serie.imdb_id)}>
                    <Serie serie={serie} />
                  </FilmeGrid>
                ))}
              </div>
            }
          </div>
        }

        <ModalDetalhe estadoModal={this.state.mostrarModal} filme={this.state.filmeDetalhe}></ModalDetalhe>
        <ModalDetalheSerie estadoModal={this.state.mostrarModalSerie} serie={this.state.serieDetalhe}></ModalDetalheSerie>
      </div>
    );
  }
}

export default FilmesPesquisa;

const FilmeGrid = styled.div`
  margin-bottom: 1em;
`;
