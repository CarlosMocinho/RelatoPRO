import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db, auth } from "../../../firebaseConfig";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const TabelaRelatorios = () => {
  const [registros, setRegistros] = useState([]);
  const [user] = useAuthState(auth); // Obter o usuário autenticado
  const [modalContent, setModalContent] = useState(null); // Conteúdo do modal
  const [isModalVisible, setIsModalVisible] = useState(false); // Controle do modal

  useEffect(() => {
    const fetchRegistros = async () => {
      if (!user) return;

      try {
        const userRef = collection(db, "Users", user.uid, "Relatorios");
        const q = query(userRef);
        const querySnapshot = await getDocs(q);

        const dados = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRegistros(dados);
      } catch (error) {
        console.error("Erro ao buscar registros:", error.message);
      }
    };

    fetchRegistros();
  }, [user]);

  const handleDelete = async (id) => {
    if (!user) return;

    try {
      const docRef = doc(db, "Users", user.uid, "Relatorios", id);
      await deleteDoc(docRef);
      setRegistros((prev) => prev.filter((registro) => registro.id !== id));
      alert("Relatório excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir relatório:", error.message);
      alert("Erro ao excluir relatório: " + error.message);
    }
  };

  const handleShowModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  return (
    <TabelaWrapper>
      <table>
        <thead>
          <tr>
            <th>Ações</th>
            <th>Dia</th>
            <th>Local</th>
            <th>Secretaria</th>
            <th>Problema</th>
            <th>Solução</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((item) => (
            <tr key={item.id}>
              <td>
                <button className="Excluir"  onClick={() => handleDelete(item.id)}>Excluir</button>
              </td>
              <td className="Dia">{item.dia}</td>
              <td className="Local">{item.local}</td>
              <td className="Secretaria">{item.secretaria}</td>
              <td className="Problema">
                {item.problema.length > 50 ? (
                  <>
                    {item.problema.substring(0, 50)}...
                    <button onClick={() => handleShowModal(item.problema)}>
                      Ver mais
                    </button>
                  </>
                ) : (
                  item.problema
                )}
              </td>
              <td className="Solucao">
                {item.solucao.length > 50 ? (
                  <>
                    {item.solucao.substring(0, 50)}...
                    <button onClick={() => handleShowModal(item.solucao)}>
                      Ver mais
                    </button>
                  </>
                ) : (
                  item.solucao
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalVisible && (
        <Modal>
          <div className="modal-content">
            <p>{modalContent}</p>
            <button onClick={handleCloseModal}>Fechar</button>
          </div>
        </Modal>
      )}
    </TabelaWrapper>
  );
};

export default TabelaRelatorios;

const TabelaWrapper = styled.div`
  overflow-x: auto;

  table {
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 2 2 10px rgba(0, 0, 0, 0.05);
    table-layout: fixed; /* Ajusta as proporções das colunas */
  }

  thead {
    background-color: #0d47a1;
    color: white;
    text-align: left;
  }

  th {
    padding: 1rem;
  }

  td {
    padding: 1rem;
    border-bottom: 2px solid #0d47a1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: normal; /* Permite quebra de linha */
    word-wrap: break-word; /* Quebra o texto longo */
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 4%; /* Ações */
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 15%; /* Dia */
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 15%; /* Local */
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 15%; /* Secretaria */
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 25%; /* Problema */
  }

  th:nth-child(6),
  td:nth-child(6) {
    width: 25%; /* Solução */
  }

  tbody tr:hover {
    background-color: rgba(13, 72, 161, 0.27);
  }

  button {
    background-color: #0d47a1;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.3rem 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    margin-top: 0.5rem; /* Adicionado para evitar sobreposição */
  }

  button:hover {
    background-color: rgb(1, 31, 82);
  }

  /* Estilos responsivos */
  @media (max-width: 768px) {
    table {
      font-size: 0.8rem; /* Reduz o tamanho da fonte */
    }

    th,
    td {
      padding: 0.5rem; /* Reduz o espaçamento */
    }

    th:nth-child(1),
    td:nth-child(1) {
      width: 10%; /* Ajusta a largura da coluna de ações */
    }

    th:nth-child(2),
    td:nth-child(2) {
      width: 20%; /* Ajusta a largura da coluna de data */
    }

    th:nth-child(5),
    td:nth-child(5),
    th:nth-child(6),
    td:nth-child(6) {
      width: 30%; /* Ajusta a largura das colunas de problema e solução */
    }

    button {
      font-size: 0.7rem; /* Reduz o tamanho do botão */
      padding: 0.2rem 0.4rem; /* Ajusta o espaçamento do botão */
    }
  }

  @media (max-width: 480px) {
    table {
      display: block; /* Exibe a tabela como bloco */
      overflow-x: auto; /* Adiciona rolagem horizontal */
    }

    thead {
      display: none; /* Esconde o cabeçalho da tabela */
    }

    tr {
      display: block; /* Exibe cada linha como um bloco */
      margin-bottom: 1rem; /* Adiciona espaçamento entre as linhas */
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      border-bottom: 1px solid #ddd;
    }

    td::before {
      content: attr(data-label); /* Adiciona o rótulo da coluna */
      font-weight: bold;
      color: #0d47a1;
      flex: 1;
      text-align: left;
    }

    td:last-child {
      border-bottom: none;
    }

    button {
      font-size: 0.6rem; /* Reduz ainda mais o tamanho do botão */
      padding: 0.2rem 0.3rem;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    max-width: 800px; /* Aumenta a largura máxima */
    width: 90%; /* Ajusta a largura para telas menores */
    word-wrap: break-word; /* Quebra o texto longo no modal */
    overflow-y: auto; /* Adiciona rolagem vertical se o conteúdo for muito grande */
    max-height: 80%; /* Limita a altura máxima do modal */
  }

  button {
    margin-top: 1rem;
    background-color: #0d47a1;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  button:hover {
    background-color: rgb(1, 31, 82);
  }

  /* Estilos responsivos */
  @media (max-width: 768px) {
    .modal-content {
      max-width: 600px; /* Reduz a largura máxima */
      padding: 1.5rem; /* Reduz o espaçamento interno */
    }

    button {
      font-size: 0.8rem; /* Reduz o tamanho do botão */
      padding: 0.4rem 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .modal-content {
      max-width: 90%; /* Ocupa quase toda a largura da tela */
      padding: 1rem; /* Reduz ainda mais o espaçamento interno */
    }

    button {
      font-size: 0.7rem; /* Reduz ainda mais o tamanho do botão */
      padding: 0.3rem 0.6rem;
    }
  }
`;
