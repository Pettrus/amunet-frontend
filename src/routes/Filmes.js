import React, { PureComponent } from 'react';

import Filme from '../components/Filme';
import { getRequest } from '../services/connection';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import ModalDetalhe from '../components/ModalDetalhe';
import Carregando from '../components/Carregando';
import SkeletonLoader from '../components/SkeletonLoader';

class Filmes extends PureComponent {

  state =  {
    filmes: [],
    pagina: 1,
    filmeDetalhe: null,
    mostrarModal: false
  }

  componentDidMount() {
    this.listarFilmes();
  }

  componentWillReceiveProps(nextProps) {
    this.listarFilmes(nextProps);
  }

  listarFilmes = async (proxProps?) => {
    try {
      this.setState({
        filmes: []
      });

      let filmes;
      let props = (proxProps == null) ? this.props.match.params.genero : proxProps.match.params.genero;

      if(props == null) {
        filmes = await getRequest("filmes/recentes");
      }else {
        filmes = await getRequest("filmes/genero/" + props);
      }

      this.setState({
        filmes: filmes.data.movies
      });
    }catch(e) {
      console.log(e);
    }
  }

  carregarMais = async () => {
    try {
      if(this.state != null && this.state.filmes.length > 0) {
        let pagina = this.state.pagina + 1;
        let novos;

        if(this.props.match.params.genero == null) {
          novos = await getRequest("filmes/recentes/" + pagina);
        }else {
          novos = await getRequest("filmes/genero/" + this.props.match.params.genero + "/" + pagina);
        }

        let filmes = [];

        filmes = filmes.concat(this.state.filmes);
        filmes = filmes.concat(novos.data.movies);

        this.setState({
          filmes: filmes,
          pagina: pagina
        });
      }
    }catch(e) {
      console.log(e);
    }
  }

  abrirModal = (filmeId) => {
    if(filmeId !== this.state.filmeDetalhe) {
      this.setState({
        filmeDetalhe: filmeId,
        mostrarModal: true
      });
    }
  }

  render() {
    return (
      <div>
        <div className="cor-branco capitalize">
          <h2 style={{color:'white'}}>{this.props.match.params.genero == null ? 'Adicionados Recentemente' : this.props.match.params.genero}</h2>
        </div>

        <div>
          {this.state.filmes.length == 0 &&
            <div className="row">
              {[...Array(12)].map((e, i) => (
                <SkeletonLoader key={i}></SkeletonLoader>
              ))}
            </div>
          }

          {this.state.filmes.length > 0 &&
            <InfiniteScroll
              dataLength={this.state.filmes.length}
              next={this.carregarMais}
              hasMore={true}
              loader={<Carregando></Carregando>}>

                <div className="row">
                  {this.state.filmes.map(filme => (
                    <FilmeGrid key={filme.id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" onClick={() => this.abrirModal(filme.id)}
                      >
                      <Filme filme={filme} />
                    </FilmeGrid>
                  ))}
                </div>
            </InfiniteScroll>
          }
        </div>

        <ModalDetalhe estadoModal={this.state.mostrarModal} filme={this.state.filmeDetalhe}></ModalDetalhe>
      </div>
    );
  }
}

export default Filmes;

const FilmeGrid = styled.div`
  margin-bottom: 1em;
`;
