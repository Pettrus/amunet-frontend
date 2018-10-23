import React, { Component } from 'react';

import { getRequest, postRequest } from '../services/connection';

class Perfil extends Component {
  state = {
    usuario: {},
    atual: "",
    nova: "",
    repetir: ""
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

  alterarSenha = async () => {
    try {
      await postRequest("usuario/alterar-senha", {
        atual: this.state.atual,
        nova: this.state.nova
      });
    }catch(e) {
      console.log(e);
    }
  }

  updateAtual(evt) {
    this.setState({
      atual: evt.target.value
    });
  }

  updateNova(evt) {
    this.setState({
      nova: evt.target.value
    });
  }

  updateRepetir(evt) {
    this.setState({
      repetir: evt.target.value
    });
  }

  render() {
    return (
      <div className="container inicial">
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <img src="/assets/images/perfil.jpg" alt="Perfil" className="img-fluid rounded tamanho-imagem" />

                <div className="text-center">
                  <h3>{this.state.usuario.nome}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <div className="form-group">
                  <label>Senha Atual</label>
                  <input type="password" className="form-control" value={this.state.atual} onChange={evt => this.updateAtual(evt)} disabled />
                </div>

                <div className="form-group">
                  <label>Nova Senha</label>
                  <input type="password" className="form-control" value={this.state.nova} onChange={evt => this.updateNova(evt)} disabled />
                </div>

                <div className="form-group">
                  <label>Repetir Senha</label>
                  <input type="password" className="form-control" value={this.state.repetir} onChange={evt => this.updateRepetir(evt)} disabled />
                </div>

                <div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Perfil;
