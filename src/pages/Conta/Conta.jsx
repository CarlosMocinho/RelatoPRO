import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import styled from "styled-components";
import { auth } from "../../../firebaseConfig";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const Conta = () => {
  const [user] = useAuthState(auth); // Obter o usuário autenticado
  const [nome, setNome] = useState(user?.displayName || "");
  const [foto, setFoto] = useState(user?.photoURL || "");
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false); // Estado para indicar upload
  const [liderId, setLiderId] = useState(""); // Novo estado para o ID do líder
  const [loadingLider, setLoadingLider] = useState(true);
  const storage = getStorage(); // Instância do Firebase Storage

  useEffect(() => {
    async function fetchLiderId() {
      if (!user) return;
      const userDocRef = doc(db, "Users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists() && userDocSnap.data().liderId) {
        setLiderId(userDocSnap.data().liderId);
      }
      setLoadingLider(false);
    }
    fetchLiderId();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (nome.trim().length < 5 || nome.trim().length > 20) {
      alert("O nome deve ter entre 5 e 20 caracteres.");
      return;
    }

    if (!foto) {
      alert("Por favor, insira uma URL válida para a foto.");
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: nome,
        photoURL: foto,
      });
      await setDoc(doc(db, "Users", user.uid), {
        nome: nome,
      }, { merge: true });
      alert("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error.message);
      alert("Erro ao atualizar perfil: " + error.message);
    }
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true); // Indicar que o upload está em andamento
    const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);

    try {
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      setFoto(photoURL); // Atualizar a URL da foto no estado
      alert("Foto enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar foto:", error.message);
      alert("Erro ao enviar foto: " + error.message);
    } finally {
      setUploading(false); // Finalizar o estado de upload
    }
  };

  const handleSaveLiderId = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "Users", user.uid);
      await setDoc(userDocRef, { liderId }, { merge: true });
      alert("ID do líder salvo com sucesso!");
    } catch (error) {
      alert("Erro ao salvar ID do líder: " + error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Atualiza apenas os campos preenchidos
    const updates = {};
    if (nome && nome.trim() !== "") updates.displayName = nome;
    if (foto && typeof foto === "string" && foto.trim() !== "") updates.photoURL = foto;

    let photoURL = null;
    if (foto) {
      const storageRef = ref(storage, `usuarios/${auth.currentUser.uid}/fotoPerfil.jpg`);
      await uploadBytes(storageRef, foto);
      photoURL = await getDownloadURL(storageRef);
    }
    // Só adiciona photoURL se existir
    if (photoURL) updates.photoURL = photoURL;

    try {
      if (Object.keys(updates).length > 0) {
        await updateProfile(auth.currentUser, updates);
      }
      // Atualize outros campos no Firestore se necessário
      alert("Conta atualizada com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar conta: " + error.message);
    }
  };

  return (
    <ContaWrapper>
      <Navbar />
      <div className="container">
        <h1>Minha Conta</h1>
        {user ? (
          <div className="profile">
            <img
              src={foto || "/Usuariopadrao.png"}
              alt="Foto do Usuário"
              className="profile-pic"
            />
            <div className="info">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>ID do Usuário:</strong> {user.uid}
              </p>
              {!isEditing ? (
                <>
                  <p>
                    <strong>Nome:</strong> {user.displayName || "Usuário"}
                  </p>
                  <button onClick={() => setIsEditing(true)}>Editar Nome</button>
                </>
              ) : (
                <form className="edit-form" onSubmit={handleUpdate}>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                  <button type="submit">Salvar alterações</button>
                </form>
              )}
              <div style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
                <label>
                  <strong>ID do Líder:</strong>
                  <input
                    type="text"
                    value={liderId}
                    onChange={(e) => setLiderId(e.target.value)}
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0.3rem",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "5px",
                      background: "#0d47a1",
                      color: "white",
                      border: "none",
                    }}
                    onClick={handleSaveLiderId}
                    disabled={loadingLider}
                  >
                    Salvar
                  </button>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <p>Por favor, faça login para acessar sua conta.</p>
        )}
      </div>
    </ContaWrapper>
  );
};

export default Conta;

const ContaWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(90deg, #165bbd 60%, #ffe066 100%);

  .container {
    max-width: 600px;
    margin: 2rem auto;
    background: white;
    padding: 2rem;
    border-radius: 18px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  h1 {
    font-size: 2rem;
    color: #165bbd;
    margin-bottom: 1.5rem;
    font-weight: bold;
  }

  .profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .profile-pic {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px solid #ffe066;
      object-fit: cover;
      background: #f6f7f9;
    }

    .info {
      text-align: left;
      width: 100%;

      p {
        font-size: 1rem;
        margin: 0.5rem 0;
        color: #165bbd;
      }

      button {
        background-color: #165bbd;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 1rem;
        font-weight: bold;
        transition: background 0.2s;
      }

      button:hover {
        background-color: #0d47a1;
      }
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-size: 0.9rem;
        text-align: left;
        color: #165bbd;
      }

      input[type="text"] {
        padding: 0.8rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 1rem;
      }

      button {
        background-color: #165bbd;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 1rem;
        font-weight: bold;
        transition: background 0.2s;
      }

      button:hover {
        background-color: #0d47a1;
      }

      button:last-child {
        background-color: #ffe066;
        color: #165bbd;
      }

      button:last-child:hover {
        background-color: #ffd700;
      }
    }
  }
`;