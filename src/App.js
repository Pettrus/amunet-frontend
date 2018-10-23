import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import './App.css';
import './Loader.css';

import Filmes from './routes/Filmes';
import FilmesPesquisa from './routes/FilmesPesquisa';
import FilmeDetalhe from './routes/FilmeDetalhe';

import Series from './routes/serie/Series';
import MinhaLista from './routes/serie/MinhaLista';
import Perfil from './routes/Perfil';
import AssistirOnline from './routes/AssistirOnlne';

import Login from './routes/Login';
import Header from './components/Header';
import { getRequest } from './services/connection';

class App extends Component {

  state = {
    carregado: false
  }

  async componentWillMount() {
    const url = window.location.pathname;
    const auth = localStorage.getItem('auth');

    if(auth != null) {
      let logado = await getRequest('validate-token');

      if(logado) {
        if(url === "/") {
          window.location.pathname = "/filmes";
        }
      }else if(url !== "/") {
        window.location.pathname = "/";
      }
    }else if(url !== "/") {
      window.location.pathname = "/";
    }

    setTimeout(() => {
      this.setState({
        carregado: true
      });
    }, 1000)
  }

  render() {
    const { carregado } = this.state;

    return (
      <div>
        {!carregado &&
          <ul className="loader">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        }

        {carregado &&
          <Router>
            <div className="App">
              {window.location.pathname !== '/' &&
                <Header />
              }

              <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/assistir-online" component={AssistirOnline} />
                <Route exact path="/filmes" component={Filmes} />
                <Route exact path="/filmes/:id" component={FilmeDetalhe} />
                <Route exact path="/filmes/pesquisar/:nome" component={FilmesPesquisa} />
                <Route exact path="/filmes/genero/:genero" component={Filmes} />

                <Route exact path="/series" component={Series} />
                <Route exact path="/minha-lista" component={MinhaLista} />
                <Route exact path="/perfil" component={Perfil} />
              </Switch>
            </div>
          </Router>
        }
      </div>
    )
  }
}

export default App;
