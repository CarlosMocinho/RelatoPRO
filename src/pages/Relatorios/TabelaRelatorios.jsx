import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db, auth } from "../../../firebaseConfig";
import { collection, query, getDocs, deleteDoc, doc, orderBy, where, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { shareReport } from "../RelatoriosGerais/ShareReport";
import { FaTrash, FaShareAlt, FaPlus } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const TabelaRelatorios = () => {
  const [registros, setRegistros] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [exportMeus, setExportMeus] = useState(true);
  const [exportCompartilhados, setExportCompartilhados] = useState(false);
  const [registrosCompartilhados, setRegistrosCompartilhados] = useState([]);
  const [user] = useAuthState(auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const fetchRegistros = async () => {
      if (!user) return;
      try {
        const userRef = collection(db, "Users", user.uid, "Relatorios");
        const q = query(userRef, orderBy("dia", "desc"));
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

  useEffect(() => {
    if (!showExportModal || !user) return;
    async function fetchCompartilhados() {
      const q = query(
        collection(db, "SharedReports"),
        where("sharedWith", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const lista = [];
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
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
          ...dadosRelatorio,
        });
      }
      setRegistrosCompartilhados(lista);
    }
    fetchCompartilhados();
  }, [showExportModal, user]);

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

  const handleShare = async (reportId) => {
    const sharedWithId = prompt("Digite o ID do usuário com quem deseja compartilhar:");
    if (!sharedWithId) {
      alert("ID do usuário é obrigatório.");
      return;
    }
    await shareReport(reportId, sharedWithId);
  };

  const handleShowModal = (item) => {
    setModalContent(item);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  const safeText = (value) => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return "";
  };

  // Função para exportar para XLSX
  const exportarExcel = () => {
    let linhas = [];

    // Filtrar e adicionar "Meus Relatórios"
    if (exportMeus) {
      const filtrados = registros.filter((r) => {
        if (!dataInicio || !dataFim) return true;
        return r.dia >= dataInicio && r.dia <= dataFim;
      });
      linhas = linhas.concat(
        filtrados.map((r) => ({
          Tipo: "Meus Relatórios",
          Data: safeText(r.dia),
          Local: safeText(r.local),
          Defeito: safeText(r.problema),
          Solução: safeText(r.solucao),
        }))
      );
    }

    // Filtrar e adicionar "Relatórios Compartilhados"
    if (exportCompartilhados) {
      const filtrados = registrosCompartilhados.filter((r) => {
        if (!dataInicio || !dataFim) return true;
        return r.dia >= dataInicio && r.dia <= dataFim;
      });
      linhas = linhas.concat(
        filtrados.map((r) => ({
          Tipo: "Relatórios Compartilhados",
          Data: safeText(r.dia),
          Local: safeText(r.local),
          Defeito: safeText(r.problema),
          Solução: safeText(r.solucao),
        }))
      );
    }

    // Verificar se há dados para exportar
    if (linhas.length === 0) {
      alert("Nenhum relatório encontrado no intervalo de datas selecionado.");
      return;
    }

    // Criar uma planilha (worksheet) a partir dos dados
    const ws = XLSX.utils.json_to_sheet(linhas, {
      header: ["Tipo", "Data", "Local", "Defeito", "Solução"],
    });

    // Criar um novo workbook e anexar a planilha
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatorios");

    // Gerar o arquivo XLSX em formato array
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Criar um blob e fazer o download usando file-saver
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "relatorios.xlsx");

    // Fechar o modal após exportar
    setShowExportModal(false);
  };

  return (
    <Wrapper>
      <BarraAcoes>
        <BotaoAzul onClick={() => setShowExportModal(true)}>
          Exportar Excel
        </BotaoAzul>
      </BarraAcoes>

      {showExportModal && (
        <ExportModal>
          <div className="modal-content">
            <h2>Inserir relatórios:</h2>
            <div className="date-fields">
              <label>
                Início:
                <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
              </label>
              <label>
                Fim:
                <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
              </label>
            </div>
            <div className="checkboxes">
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={exportMeus}
                    onChange={e => setExportMeus(e.target.checked)}
                  />
                  <span>Meus Relatórios</span>
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={exportCompartilhados}
                    onChange={e => setExportCompartilhados(e.target.checked)}
                  />
                  <span>Relatórios Compartilhados</span>
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <BotaoAzul onClick={exportarExcel}>Exportar</BotaoAzul>
              <BotaoCancelar onClick={() => setShowExportModal(false)}>Cancelar</BotaoCancelar>
            </div>
          </div>
        </ExportModal>
      )}

      <StyledTable>
        <thead>
          <tr>
            <th>Ações</th>
            <th>Data</th>
            <th>Local</th>
            <th>Defeito</th>
            <th>Solução</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {registros.map((item) => (
            <tr key={item.id}>
              <td>
                <IconButton title="Compartilhar" onClick={() => handleShare(item.id)}>
                  <FaShareAlt />
                </IconButton>
                <IconButton title="Excluir" onClick={() => handleDelete(item.id)}>
                  <FaTrash />
                </IconButton>
              </td>
              <td>{item.dia}</td>
              <td>{item.local}</td>
              <td>
                {item.problema.length > 25 ? (
                  <>
                    {item.problema.substring(0, 25)}...
                  </>
                ) : (
                  item.problema
                )}
              </td>
              <td>
                {item.solucao.length > 25 ? (
                  <>
                    {item.solucao.substring(0, 25)}...
                  </>
                ) : (
                  item.solucao
                )}
              </td>
              <td>
                <IconButton title="Ver mais" onClick={() => handleShowModal(item)}>
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
};

export default TabelaRelatorios;

// Estilos

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
  }
  tbody tr:hover {
    background: #e3eaf6;
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
    max-width: 90vw; /* Garante que não passe da tela */
    min-width: 80vw; /* Opcional: define uma largura mínima */
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

const BotaoCancelar = styled.button`
  background: #ccc;
  color: #222;
  border: none;
  border-radius: 16px;
  padding: 0.3rem 1.1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 1rem;
  &:hover {
    background: #aaa;
  }
`;

const ExportModal = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    min-width: 350px;
    max-width: 95vw;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);

    h2 {
      margin-bottom: 1.2rem;
      color: #165bbd;
    }
    .date-fields {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 1.2rem;
      label {
        display: flex;
        flex-direction: column;
        font-weight: 500;
        color: #222;
        input[type="date"] {
          margin-top: 0.3rem;
          padding: 0.3rem;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
      }
    }
    .checkboxes {
      display: flex;
      gap: 2rem;
      justify-content: center;
      margin-bottom: 1.2rem;
      label {
        font-size: 1.1rem;
        font-weight: 500;
        color: #165bbd;
        input[type="checkbox"] {
          margin-right: 0.5rem;
        }
      }
    }
    .modal-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.2rem;
    }
  }
`;
