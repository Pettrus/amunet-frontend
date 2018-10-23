import React, { PureComponent } from 'react';
import { login } from '../services/connection';

import 'font-awesome/css/font-awesome.min.css';

class Login extends PureComponent {

  state =  {
    email: "",
    password: "",
    incorreto: false
  }

  logar = async (e) => {
    e.preventDefault();
    try {
      const logou = await login({
        email: this.state.email,
        password: this.state.password
      });

      console.log(logou);

      window.location.pathname = '/filmes';
    }catch(e) {
      this.setState({
        incorreto: true,
        usuario: {}
      });
    }
  }

  updateEmail(evt) {
    this.setState({
      email: evt.target.value
    });
  }

  updatePassword(evt) {
    this.setState({
      password: evt.target.value
    });
  }

  render() {
    return (
      <main>
        <section className="section section-shaped section-lg my-0">
          <div className="container pt-lg-md">
            <img src="/assets/images/logo.png" alt="Logo" style={{height: '210px'}} />

            <div className="row justify-content-center">
              <div className="col-lg-5">
                <div className="card bg-secondary shadow border-0">
                  <div className="card-body px-lg-5 py-lg-5">
                    <div className="text-center text-muted mb-4">
                      <small>Faça login</small>
                    </div>
                    <form onSubmit={this.logar}>
                      <div className="form-group mb-3">
                        <div className="input-group input-group-alternative">
                          <div className="input-group-prepend">
                            <span className="input-group-text"><i className="ni ni-email-83"></i></span>
                          </div>
                          <input className="form-control" placeholder="Email" type="email"
                            value={this.state.email} onChange={evt => this.updateEmail(evt)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="input-group input-group-alternative">
                          <div className="input-group-prepend">
                            <span className="input-group-text"><i className="ni ni-lock-circle-open"></i></span>
                          </div>
                          <input className="form-control" placeholder="Password" type="password"
                              value={this.state.password} onChange={evt => this.updatePassword(evt)} />
                        </div>
                      </div>

                      {this.state.incorreto &&
                        <div className="text-center" style={{color: 'red'}}>
                          Login ou senha incorretos
                        </div>
                      }

                      <div className="text-center">
                        <button type="submit" className="btn btn-default my-4">Entrar</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default Login;
