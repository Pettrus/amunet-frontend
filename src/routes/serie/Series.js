import React, { PureComponent } from 'react';

import Serie from '../../components/Serie';
import styled from 'styled-components';
import { getRequest } from '../../services/connection';
import InfiniteScroll from 'react-infinite-scroll-component';
import Carregando from '../../components/Carregando';
import SkeletonLoader from '../../components/SkeletonLoader';
import ModalDetalheSerie from '../../components/ModalDetalheSerie';

class Series extends PureComponent {

  state =  {
    series: [],
    pagina: 1,
    serieDetalhe: null,
    mostrarModal: false
  }

  componentDidMount() {
    console.log("Montou");
    this.listarSeries();
  }

  componentWillReceiveProps(nextProps) {
    //this.listarFilmes(nextProps);
  }

  listarSeries = async (proxProps) => {
    try {
      this.setState({
        series: []
      });

      let series = await getRequest("series/recentes");

      this.setState({
        series: series
      });
    }catch(e) {
      console.log(e);
    }
  }

  carregarMais = async () => {
    try {
      if(this.state != null && this.state.series.length > 0) {
        let pagina = this.state.pagina + 1;
        let novos;

        novos = await getRequest("series/recentes/" + pagina);

        let series = [];

        series = series.concat(this.state.series);
        series = series.concat(novos);

        this.setState({
          series: series,
          pagina: pagina
        });
      }
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

  render() {
    return (
      <div>
        <div className="cor-branco capitalize">
          <h2 style={{color:'white'}}>Atualizados recentemente</h2>
        </div>

        <div>
          {this.state.series.length == 0 &&
            <div className="row">
              {[...Array(12)].map((e, i) => (
                <SkeletonLoader key={i}></SkeletonLoader>
              ))}
            </div>
          }
          {this.state.series.length > 0 &&
            <InfiniteScroll
                dataLength={this.state.series.length}
                next={this.carregarMais}
                hasMore={true}
                loader={<Carregando></Carregando>}>

                <div className="row">
                  {this.state.series.map(serie => (
                    <SerieGrid key={serie._id} className="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-2" onClick={() => this.abrirModal(serie.imdb_id)}>
                      <Serie serie={serie} />
                    </SerieGrid>
                  ))}
                </div>
            </InfiniteScroll>
          }
        </div>

        <ModalDetalheSerie estadoModal={this.state.mostrarModal} serie={this.state.serieDetalhe}></ModalDetalheSerie>
      </div>
    );
  }
}

export default Series;

const SerieGrid = styled.div`
  margin-bottom: 1em;
`;