import React, { Component } from 'react';
import { getRequest, postRequest } from '../services/connection';
import styled from 'styled-components';

class AssistirOnline extends Component {
    state = {
        baixandoAgora: {},
        assistindo: false,
        ativarLegenda: false,
        naoAchouLegenda: false,
        pesquisandoLegenda: false,
        interval: null,
        usuario: null
    }
    
    async componentDidMount() {
        const usuario = await getRequest("usuario/dados")

        this.baixandoAgora();

        let interval = setInterval(() => {
            this.baixandoAgora();
        }, 5000);

        this.setState({
            interval: interval,
            usuario: usuario
        });
    }

    componentWillUnmount() {
        if(this.state.interval) {
            clearInterval(this.state.interval);
        }
    }

    baixandoAgora = async () => {
        const baixando = await getRequest("assistir-online/baixando-agora");

        if(baixando.id != null) {
            baixando.caminho = baixando.caminho.replace("/", "%2F");

            this.setState({
                baixandoAgora: baixando,
            });
        }
    }

    assistir = async () => {
        if(this.state.ativarLegenda) {
            this.setState({
                pesquisandoLegenda: true
            });

            const retorno = await postRequest("assistir-online/baixar-legenda")
            console.log(retorno)

            if(retorno == false) {
                this.setState({
                    naoAchouLegenda: true,
                    pesquisandoLegenda: false
                });
            }else {
                this.assistindo();
            }
        }else {
            this.assistindo();
        }
    }

    assistindo = () => {
        this.setState({
            assistindo: true,
            pesquisandoLegenda: false
        });
    }

    removerFilme = async () => {
        if(!this.state.pesquisandoLegenda) {
            await postRequest("assistir-online/remover-filme");

            this.setState({
                baixandoAgora: {},
                assistindo: false
            });
        }
    }

    handleCheck = () => {
        this.setState({ativarLegenda: !this.state.ativarLegenda});
    }

    render() {
        return (
            <div>
                {this.state.baixandoAgora.id == null &&
                    <div>
                        <div className="row">
                            <div className="col-md-6 mx-auto">
                                <div className="card shadow">
                                    <div className="card-body text-center">
                                        Nenhum filme sendo baixado no momento
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                
                {this.state.baixandoAgora.id != null &&
                    <div>
                        {this.state.assistindo == false &&
                            <div>
                                <FilmeBackGround url={this.state.baixandoAgora.background}></FilmeBackGround>

                                <div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
                                    <div className="col-md-6 mx-auto">
                                        <div className="card shadow">
                                            <div className="card-body text-center">
                                                {this.state.baixandoAgora.finalizado == true &&
                                                    <div className="text-right" onClick={this.removerFilme}>
                                                        <i title="Remover filme" className="fa fa-trash pointer vermelho"></i>
                                                    </div>
                                                }

                                                <div>
                                                    <h3>{this.state.baixandoAgora.nome}</h3>
                                                    {this.state.baixandoAgora.finalizado == false &&
                                                        <div>
                                                            <h4>{(this.state.baixandoAgora.progresso * 100).toFixed(2)}%</h4>
                                                        </div>
                                                    }
                                                </div>

                                                <div>
                                                    {this.state.baixandoAgora.finalizado == true &&
                                                        <div>
                                                            {this.state.naoAchouLegenda == false &&
                                                                <div>
                                                                    <div>
                                                                        Ativar legenda?
                                                                    </div>
                                                                    <label className="custom-toggle">
                                                                        <input type="checkbox" onChange={this.handleCheck} 
                                                                            disabled={this.state.pesquisandoLegenda} defaultChecked={this.state.ativarLegenda} />
                                                                        <span className="custom-toggle-slider rounded-circle"></span>
                                                                    </label>

                                                                    <div>
                                                                        <button type="button" className="btn btn-primary cor-branco" 
                                                                            disabled={this.state.pesquisandoLegenda} onClick={this.assistir}>
                                                                            <i className="fa fa-play"></i>
                                                                            {this.state.pesquisandoLegenda ? 'Pesquisando legenda...' : 'Play'}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            }

                                                            {this.state.naoAchouLegenda == true &&
                                                                <div className="text-center">
                                                                    Não foi possível encontrar nenhuma legenda compatível com o filme
                                                                    <div>
                                                                        Deseja reproduzir sem legenda?
                                                                    </div>

                                                                    <button type="button" className="btn btn-primary cor-branco" onClick={this.assistindo}>
                                                                        Sim
                                                                    </button>
                                                                </div>
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {this.state.assistindo == true &&

                            <div>
                                <video controls autoPlay crossOrigin="anonymous">
                                    <source src={'http://localhost:8080/assistir-online/play/' + this.state.usuario.id + "/" 
                                        + this.state.baixandoAgora.caminho} type="video/mp4"></source>

                                    {this.state.ativarLegenda &&
                                        <track label="Portugues" kind="subtitles" srcLang="pt" 
                                            src={'http://localhost:8080/assistir-online/play/servir-legenda/' + this.state.baixandoAgora.caminho} default></track>
                                    }
                                </video>
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }
}

export default AssistirOnline;

const FilmeBackGround = styled.div`
  padding-top: 30vh;
  background: url(${props => props.url}) no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  margin-top: -1em;
`;