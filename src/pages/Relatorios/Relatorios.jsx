import React, { useState } from 'react';
import TabelaRelatorios from './TabelaRelatorios';
import TabelaRelatoriosCompartilhados from './TabelaRelatoriosCompartilhados'; // Crie este componente se ainda não existir
import styled from 'styled-components';
import Navbar  from "../../components/Navbar";

const Relatorios = () => {
  const [mostrarCompartilhados, setMostrarCompartilhados] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    
    <Wrapper>
      <Navbar/>
      <div>
      <div className="content">
        <h1 className="titulo">Relatórios de Serviços</h1>
        <BarraAcoes>
          <BotaoAzul
            onClick={() => setMostrarCompartilhados((prev) => !prev)}
          >
            {mostrarCompartilhados ? "Mostrar meus relatórios" : "Trocar Para Relatorios compartilhados"}
          </BotaoAzul>
        </BarraAcoes>
        {mostrarCompartilhados ? (
        <TabelaRelatoriosCompartilhados />
      ) : (
        <TabelaRelatorios />
      )}
        <div className="botoes">
          <a href="/novo-relatorio">
          <button>Adicionar Relatorio</button>
          </a>
        </div>
      </div>
      </div>
    </Wrapper>
  );
};

export default Relatorios;

const Wrapper = styled.div`
  background-color: #f6f7f9;
  justify-content: center;
  display: block;

  .content {
    background: white;
    padding: 2rem;
    min-height: 100vh;
    border-radius: 12px;
    box-shadow: 2 5px 20px rgba(0, 0, 0, 0.1);
  }

  .titulo {
    text-align: center;
    color: #0d47a1;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .botoes {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;

    button {
      background-color: #0d47a1;
      color: white;
      padding: 0.7rem 1.2rem;
      font-size: 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color:rgb(1, 31, 82);
    }

    a {
      text-decoration: none;
    }
  }
`;

const BarraAcoes = styled.div`
  width: 90%;
  margin: 0 auto 0.5rem auto;
  display: flex;
  align-items: center;
`;

const BotaoAzul = styled.button`
  background: #165bbd;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 0.3rem 1.1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(22,91,189,0.08);
  transition: background 0.2s;
  margin-bottom: 0.5rem;
  &:hover {
    background: #0d47a1;
  }
`;
