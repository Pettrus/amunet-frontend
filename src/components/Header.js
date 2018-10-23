import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { getRequest } from '../services/connection';
import {
  Link,
  withRouter
} from 'react-router-dom';

class Header extends Component {
  state = {
    pesquisa: '',
    usuario: {}
  }

  async componentDidMount() {
    try {
      const usuario = await getRequest("usuario/dados");

      this.setState({
        usuario: usuario
      });
    }catch(e) {
      console.log(e);
    }
  }

  pesquisar = (e) => {
    e.preventDefault();
    this.props.history.push("/filmes/pesquisar/" + this.state.pesquisa);
  }

  sair = () => {
    localStorage.removeItem('auth');
    window.location.pathname = "/";
  }

  render() {
    return (
      <header className="header-global" style={{marginBottom: '5em'}}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-amunet fixed-top">
          <Link className="navbar-brand" to={'/filmes'}>Amunet</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav navbar-nav-hover mr-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle pointer">Filmes</a>

                <div className="dropdown-menu">
                  <Link to={'/filmes'} className="dropdown-item">Adicionados recentemente</Link>
                  <Link to={'/filmes/genero/action'} className="dropdown-item">Ação</Link>
                  <Link to={'/filmes/genero/adventure'} className="dropdown-item">Aventura</Link>
                  <Link to={'/filmes/genero/animation'} className="dropdown-item">Animação</Link>
                  <Link to={'/filmes/genero/comedy'} className="dropdown-item">Comédia</Link>
                  <Link to={'/filmes/genero/crime'} className="dropdown-item">Crime</Link>
                  <Link to={'/filmes/genero/drama'} className="dropdown-item">Drama</Link>
                  <Link to={'/filmes/genero/documentary'} className="dropdown-item">Documentário</Link>
                  <Link to={'/filmes/genero/family'} className="dropdown-item">Família</Link>
                  <Link to={'/filmes/genero/fantasy'} className="dropdown-item">Fantasia</Link>
                  <Link to={'/filmes/genero/horror'} className="dropdown-item">Horror</Link>
                  <Link to={'/filmes/genero/sci-fi'} className="dropdown-item">Sci-Fi</Link>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle pointer">
                  Series
                </a>

                <div className="dropdown-menu">
                  <Link to={'/minha-lista'} className="dropdown-item">
                    Minha lista
                  </Link>
                  <Link to={'/series'} className="dropdown-item">
                    Atualizados recentemente
                  </Link>
                </div>
              </li>

              <li className="nav-item">
                <Link to={'/assistir-online'} className="nav-link">
                  Assistir Online
                </Link>
              </li>
            </ul>

            <form onSubmit={this.pesquisar.bind(this)} className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="search" placeholder="Pesquisar" aria-label="Pesquisar"
                value={this.state.pesquisa} onChange={evt => this.updateInputValue(evt)}/>
            </form>
          </div>
        </nav>
      </header>
    )
  }

  updateInputValue(evt) {
    this.setState({
      pesquisa: evt.target.value
    });
  }
}

export default withRouter(Header);
