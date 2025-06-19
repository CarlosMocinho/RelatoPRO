import React, { useState } from "react";
import styled from 'styled-components';
import { db, auth } from "../../../firebaseConfig";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { shareReport } from "../RelatoriosGerais/ShareReport";



function Dashboard() {
  const [formData, setFormData] = useState({
    dia: "",
    local: "",
    problema: "",
    solucao: ""
  });

  const [user] = useAuthState(auth); // Obter o usuário autenticado

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Você precisa estar logado para salvar um relatório.");
      return;
    }

    try {
      const userRef = collection(db, "Users", user.uid, "Relatorios");
      const docRef = await addDoc(userRef, formData);

      // Busca o liderId do usuário
      const userDocRef = doc(db, "Users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const liderId = userDocSnap.exists() ? userDocSnap.data().liderId : null;

      // Compartilha automaticamente com o líder, se houver
      if (liderId) {
        await shareReport(docRef.id, liderId);
      }

      alert("Relatório salvo com sucesso!");
      setFormData({
        dia: "",
        local: "",
        problema: "",
        solucao: ""
      });
    } catch (error) {
      console.error("Erro ao salvar relatório:", error.message);
      alert("Erro ao salvar relatório: " + error.message);
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <h1>Registrar Serviço</h1>
        <form onSubmit={handleSubmit}>
          <input type="date" name="dia" value={formData.dia} onChange={handleChange} required />
          <input type="text" name="local" placeholder="Local" value={formData.local} onChange={handleChange} required />
          <textarea name="problema" placeholder="Problema" value={formData.problema} onChange={handleChange} required />
          <textarea name="solucao" placeholder="Solução" value={formData.solucao} onChange={handleChange} required />
          <button type="submit">Salvar</button>
        </form>
        <a href="/relatorios">Ver Relatórios</a>
      </div>
    </StyledWrapper>
  );
}

export default Dashboard;

const StyledWrapper = styled.div`
  background-color: #f6f7f9;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 30rem;
    text-align: center;
  }

  h1 {
    font-size: 1.8rem;
    color: #0d47a1;
    margin-bottom: 1.5rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 1rem;
  }

  input,
  textarea {
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: none;
  }

  button {
    background-color: #0d47a1;
    color: white;
    padding: 0.7rem 1.2rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0b3c91;
  }

  a {
    display: block;
    margin-top: 1rem;
    color: #0d47a1;
    text-decoration: none;
    font-size: 0.95rem;
  }

  a:hover {
    text-decoration: underline;
  }
`;
