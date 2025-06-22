import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../../firebaseConfig";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa";

export default function TabelaRelatoriosCompartilhados() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalContent, setModalContent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    async function fetchRelatoriosCompartilhados() {
      setLoading(true);
      if (!auth.currentUser) {
        setRelatorios([]);
        setLoading(false);
        return;
      }
      const q = query(
        collection(db, "SharedReports"),
        where("sharedWith", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const lista = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        // Buscar nome do dono do relatório
        let nomeDono = "Desconhecido";
        if (data.ownerId) {
          const userDoc = await getDoc(doc(db, "Users", data.ownerId));
          if (userDoc.exists() && userDoc.data().nome) {
            nomeDono = userDoc.data().nome;
          }
        }
        // Buscar dados do relatório para pegar a data e detalhes
        let dadosRelatorio = {};
        if (data.ownerId && data.reportId) {
          const relatorioDoc = await getDoc(doc(db, "Users", data.ownerId, "Relatorios", data.reportId));
          if (relatorioDoc.exists()) {
            dadosRelatorio = relatorioDoc.data();
          }
        }
        lista.push({
          id: docSnap.id,
          ...data,
          nomeDono,
          ...dadosRelatorio,
        });
      }
      // Ordena por data decrescente (mais recente primeiro)
      lista.sort((a, b) => (b.dia || "").localeCompare(a.dia || ""));
      setRelatorios(lista);
      setLoading(false);
    }
    fetchRelatoriosCompartilhados();
  }, []);

  const handleShowModal = (item) => {
    setModalContent(item);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  if (loading) return <p>Carregando relatórios compartilhados...</p>;
  if (relatorios.length === 0) return <p>Nenhum relatório compartilhado com você.</p>;

  return (
    <Wrapper>
      <StyledTable>
        <thead>
          <tr>
            <th>Compartilhado por</th>
            <th>Data</th>
            <th>Local</th>
            <th>Defeito</th>
            <th>Solução</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {relatorios.map((relatorio) => (
            <tr key={relatorio.id}>
              <td>{relatorio.nomeDono}</td>
              <td>{relatorio.dia}</td>
              <td>{relatorio.local}</td>
              <td>
                {relatorio.problema?.length > 25
                  ? `${relatorio.problema.substring(0, 25)}...`
                  : relatorio.problema}
              </td>
              <td>
                {relatorio.solucao?.length > 25
                  ? `${relatorio.solucao.substring(0, 25)}...`
                  : relatorio.solucao}
              </td>
              <td>
                <IconButton title="Ver mais" onClick={() => handleShowModal(relatorio)}>
                  <FaPlus />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      {isModalVisible && modalContent && (
        <Modal>
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">
                <strong>DATA: {modalContent.dia}</strong>
              </div>
              <div className="modal-location">
                <strong>Local:</strong> {modalContent.local}
              </div>
            </div>
            <div className="modal-section">
              <strong>Defeito:</strong>
              <div className="modal-text">{modalContent.problema}</div>
            </div>
            <div className="modal-section">
              <strong>Solução:</strong>
              <div className="modal-text">{modalContent.solucao}</div>
            </div>
            <button onClick={handleCloseModal}>Fechar</button>
          </div>
        </Modal>
      )}
    </Wrapper>
  );
}

// Os mesmos estilos usados em TabelaRelatorios.jsx:
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTable = styled.table`
  width: 90%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
  background: white;
  border-radius: 16px 16px 16px 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);

  thead tr {
    background: #165bbd;
    color: #fff;
    border-radius: 16px 16px 0 0;
  }

  th, td {
    padding: 0.8rem 1rem;
    text-align: left;
    font-size: 1rem;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th:first-child, td:first-child {
    border-radius: 16px 0 0 0;
  }
  th:last-child, td:last-child {
    border-radius: 0 16px 0 0;
  }

  tbody tr {
    background: #f8f9fa;
    transition: background 0.2s;
    position: relative;
    border-bottom: 2px solid #165bbd;
  }
  tbody tr:hover {
    background: #e3eaf6;
  }

  /* Responsividade: mostra só ações, data e local em telas pequenas */
  @media (max-width: 700px) {
    th, td {
      font-size: 0.95rem;
      padding: 0.6rem 0.3rem;
    }
    th:not(:nth-child(2)):not(:nth-child(3)),
    td:not(:nth-child(2)):not(:nth-child(3)) {
      display: none;
    }
    width: 100vw;
    min-width: 0;
  }
`;

const IconButton = styled.button`
  background: #165bbd;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.5rem;
  margin-right: 0.3rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #0d47a1;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;

  .modal-content {
    background: white;
    padding: 0;
    border-radius: 8px;
    width: 90vw; /* Mesma largura da tabela */
    max-width: 90vw;
    min-width: 80vw;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    overflow: hidden;
    font-family: Arial, sans-serif;
  }
  .modal-header {
    background: #165bbd;
    color: #fff;
    padding: 0.7rem 1rem;
    font-size: 1.1rem;
    border-radius: 8px 8px 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .modal-section {
    padding: 0.7rem 1rem 0.2rem 1rem;
    border-bottom: 1px solid #e0e0e0;
    font-size: 1rem;
    background: #f9f9f9;
  }
  .modal-section:last-child {
    border-bottom: none;
    padding-bottom: 1rem;
  }
  .modal-text {
    margin-top: 0.3rem;
    background: #fff;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 1rem;
    white-space: pre-wrap;
    word-break: break-word;
  }
  button {
    margin: 1rem;
    background: #165bbd;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
    font-size: 1rem;
    float: right;
    &:hover {
      background: #0d47a1;
    }
  }
`;