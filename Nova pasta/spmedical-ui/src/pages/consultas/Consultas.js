import { Component } from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/img/logo.png';

import Rodape from '../../components/rodape/rodape';
import Titulo from '../../components/titulo/titulo';
import PerfilFoto from '../../components/perfilfoto/perfilfoto';

export default class TiposEventos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listaTiposEventos: [],
      titulo: '',
      idTipoEventoAlterado: 0,
      titulosecao: 'Lista Consultas',
    };
  }

  buscarTipoEventos = () => {
    console.log('agora vamos fazer a chamada para a api.');
    
    fetch('http://localhost:5000/api/Consultas', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
      },
    })
   

      .then((resposta) => resposta.json())

      .then((dados) => this.setState({ listaConsultas: dados }))

      .catch((erro) => console.log(erro));
  };

  atualizaEstadoTitulo = async (event) => {

    await this.setState({
     
      titulo: event.target.value,
    });
    console.log(this.state.titulo);
  };

  manipularTipoEvento = (submit_formulario) => {
    submit_formulario.preventDefault();

    console.log(JSON.stringify({ tituloTipoEvento: this.state.titulo }));


    if (this.state.idConsultasAlterado !== 0) {
     
      fetch(
        'http://localhost:5000/api/Consultas/' +
          this.state.idConsultasAlterado,
        {
        
         

          
          body: JSON.stringify({ tituloConsultas: this.state.titulo }),

          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
          },
        },
      )
        .then((resposta) => {
        
          if (resposta.status === 204) {
            console.log(
         
              'A Consulta ' +
                this.state.idTipoEventoAlterado +
                ' foi atualizado!',
           
              'Seu novo título agora é: ' + this.state.titulo,
            );
          }
        })

        .catch((erro) => console.log(erro))

       
        .then(this.buscarTipoEventos)

        .then(this.limparCampos);
    } else {
      fetch('http://localhost:5000/api/Consultas', {
        method: 'POST',

        body: JSON.stringify({ tituloConsultas: this.state.consultas }),

        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
        },
      })
    
        .then(console.log('Consulta cadastrado.'))

       
        .catch((erro) => console.log(erro))

        .then(this.buscarConsultas)

        .then(this.limparCampos);
    }
  };

  componentDidMount() {
    this.buscarConsultas();
  }


  buscarConsultasPorId = (Consultas) => {
    this.setState(
      {
        idConsultasAlterado: Consultas.idConsultas,

        titulo: Consultas.tituloConsultas,
      },
      () => {
        console.log(
          'A Consulta ' + Consultas.idConsultas + ' foi selecionado,',
          'agora o valor do state idConsultasAlterado é: ' +
            this.state.idConsultasAlterado,
          'e o valor do state título é: ' + this.state.titulo,
        );
      },
    );
  };

  
  excluirTipoEvento = (Consultas) => {
    console.log(
      'A Consulta ' + Consultas.idConsultas + ' foi selecionado!',
    );

    fetch('http://localhost:5000/api/Consultas/' + Consultas.idConsultas, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
      },
    })
      .then((resposta) => {
        if (resposta.status === 204) {
          console.log(
            'Consultas ' + Consultas.idConsultas + ' foi excluído!',
          );
        }
      })

      .catch((erro) => console.log(erro))

      .then(this.buscarConsultas);
  };

  limparCampos = () => {
    this.setState({
      titulo: '',
      idConsultasAlterado: 0,
    });
    console.log('Os states foram resetados!');
  };

  render() {
    return (
      <div>
        <header className="cabecalhoPrincipal">
          <div className="container">
            <Link to="/">
              <img src={logo} alt="Logo da sp" />{' '}
            </Link>

            <nav className="cabecalhoPrincipal-nav">Administrador
              <PerfilFoto />
            </nav>
          </div>
        </header>
        <main className="conteudoPrincipal">
      
          <section className="conteudoPrincipal-cadastro">
            <Titulo titulosecao={this.state.titulosecao} />


            <div className="container" id="conteudoPrincipal-lista">
              <table id="tabela-lista">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Título</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody id="tabela-lista-corpo">
                  {this.state.listaConsultas.map((Consultas) => {
                   
                    return (
                      <tr key={Consultas.idConsultas}>
                        <td>{Consultas.idConsultas}</td>
                        <td>{Consultas.tituloConsultas}</td>

                        <td>
                          <button
                            onClick={() =>
                              this.buscarConsultasPorId(Consultas)
                            }
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => this.excluirConsultas(Consultas)}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Cadastro por tipo de evento */}
          <section className="container" id="conteudoPrincipal-cadastro">
            <Titulo titulosecao="Cadastro de Tipo de Evento" />

            {/* <h2 className="conteudoPrincipal-cadastro-titulo">Cadastro de tipo de evento</h2> */}
            <form onSubmit={this.manipularTipoEvento}>
              <div className="container">
                {/* valor do state é o input */}
                <input
                  type="text"
                  value={this.state.titulo}
                  placeholder="Título do Tipo de Evento"
                  //cada vez que tiver uma mudanca, (por tecla)
                  onChange={this.atualizaEstadoTitulo}
                />

                {
                  <button
                    type="submit"
                    className="conteudoPrincipal-btn conteudoPrincipal-btn-cadastro"
                    disabled={this.state.titulo === '' ? 'none' : ''}
                  >
                    {this.state.idTipoEventoAlterado === 0
                      ? 'Cadastrar'
                      : 'Atualizar'}
                  </button>
                }

                
                <button
                  type="button"
                  className="conteudoPrincipal-btn conteudoPrincipal-btn-cadastro"
                  onClick={this.limparCampos}
                  style={{ display: '' }}
                >
                  Cancelar
                </button>

                
                {this.state.idConsultasAlterado !== 0 && (
                  <div>
                    <p>
                      A Consulta {this.state.idConsultaAlterado} está
                      sendo editado.
                    </p>
                    <p>
                      Clique em Cancelar caso queira cancelar a operação antes
                      de cadastrar uma nova consulta.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </section>
        </main>
        <Rodape />
      </div>
    );
  }
}