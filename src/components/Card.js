import React, { Component } from 'react';
import styled from 'styled-components';
import 'font-awesome/css/font-awesome.min.css';

class Card extends Component {
  constructor() {
    super();

    this.state = {
      showMenu: false,
    };

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu(event) {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu(event) {

    if (!this.dropdownMenu.contains(event.target)) {

      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });

    }
  }

  render() {
    return (
      <OpcaoMenu>
        <a onClick={this.showMenu} className="pointer">
          Gênero
        </a>

        {
          this.state.showMenu
            ? (
              <div
                className="menu"
                ref={(element) => {
                  this.dropdownMenu = element;
                }}
              >
                <a href="/filmes/genero/action">Ação</a>
                <a href="/filmes/genero/adventure">Aventura</a>
                <a href="/filmes/genero/animation">Animação</a>
                <a href="/filmes/genero/comedy">Comédia</a><br/>
                <a href="/filmes/genero/crime">Crime</a>
                <a href="/filmes/genero/documentary">Documentário</a>
                <a href="/filmes/genero/drama">Drama</a>
                <a href="/filmes/genero/family">Família</a><br/>
                <a href="/filmes/genero/horror">Horror</a>
                <a href="/filmes/genero/romance">Romance</a>
                <a href="/filmes/genero/sci-fi">Sci-fi</a>
              </div>
            )
            : (
              null
            )
        }
      </OpcaoMenu>
    );
  }
}

export default Card;

const OpcaoMenu = styled.div`
  text-align: left;
  padding-left: 3em;
  padding-top: 0.7em;

  > a {
    color: white !important;
  }

  .menu {
    background-color: #000;
    display: flex;
  }

  .menu a {
    color: white !important;
    padding: 0.7em;
  }
`
