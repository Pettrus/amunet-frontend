import React, { PureComponent } from 'react';

import Serie from '../../components/Serie';
import styled from 'styled-components';
import { getRequest } from '../../services/connection';
import Carregando from '../../components/Carregando';
import ModalDetalheSerie from '../../components/ModalDetalheSerie';

class Series extends PureComponent {

  state =  {
    series: [],
    serieDetalhe: null,
    mostrarModal: false,
    carregando: false
  }

  async componentDidMount() {
    try {
      this.setState({
        carregando: true
      });

      const minhaLista = await getRequest("series/minha-lista");

      this.setState({
        series: minhaLista,
        carregando: false
      });
    }catch(e) {
        console.log(e);
    }
  }

  abrirModal = (serieId) => {
    if(serieId !== this.state.serieDetalhe) {
      this.setState({
        serieDetalhe: serieId,
        mostrarModal: true
      });
    }
  }

  atualizarLista = (removido) => {
    let lista = [];
    lista.push.apply(lista, this.state.series);

    for(let s of this.state.series) {
      if(s.imdb_id === removido.imdb_id) {
        lista.splice(lista.indexOf(s), 1);
        break;
      }
    }

    console.log(lista);

    this.setState({
      series: lista
    });
  }

  render() {
    return (
      <div>
        <div>
          <h2 className="cor-branco capitalize">Minha lista</h2>
        </div>

        {this.state.c}

        {(!this.state.carregando && this.state.series.length <= 0) &&
          <div className="text-center">
            <h3 className="cor-branco">Nenhuma série na sua lista</h3>
          </div>
        }

        {this.state.carregando &&
          <div>
            <Carregando></Carregando>
          </div>
        }

        {this.state.series.length > 0 &&
          <div>
            <div className="row">
              {this.state.series.map(serie => (
                  <SerieGrid key={serie.id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" onClick={() => this.abrirModal(serie.imdb_id)}>
                      <Serie serie={serie} />
                  </SerieGrid>
              ))}
            </div>
          </div>
        }

        <ModalDetalheSerie estadoModal={this.state.mostrarModal} serie={this.state.serieDetalhe} removerComponentPai={this.atualizarLista}></ModalDetalheSerie>
      </div>
    );
  }
}

export default Series;

const SerieGrid = styled.div`
  margin-bottom: 1em;
`;