import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import styled from "styled-components";
import { auth } from "../../../firebaseConfig";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Conta = () => {
  const [user] = useAuthState(auth); // Obter o usuário autenticado
  const [nome, setNome] = useState(user?.displayName || "");
  const [foto, setFoto] = useState(user?.photoURL || "");
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false); // Estado para indicar upload
  const storage = getStorage(); // Instância do Firebase Storage

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: nome,
        photoURL: foto,
      });
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
              {!isEditing ? (
                <>
                  <p>
                    <strong>Nome:</strong> {user.displayName || "Usuário"}
                  </p>
                  <button onClick={() => setIsEditing(true)}>Editar Perfil</button>
                </>
              ) : (
                <div className="edit-form">
                  <label>Nome:</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                  <label>Foto (Upload):</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPhoto}
                  />
                  {uploading && <p>Enviando foto...</p>}
                  <div className="buttons">
                    <button onClick={handleUpdateProfile}>Salvar</button>
                    <button onClick={() => setIsEditing(false)}>Cancelar</button>
                  </div>
                </div>
              )}
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
  background-color: #f6f7f9;
  min-height: 100vh;

  .container {
    max-width: 600px;
    margin: 2rem auto;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  h1 {
    font-size: 1.8rem;
    color: #0d47a1;
    margin-bottom: 1.5rem;
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
      border: 2px solid #0d47a1;
      object-fit: cover;
    }

    .info {
      text-align: left;
      width: 100%;

      p {
        font-size: 1rem;
        margin: 0.5rem 0;
      }

      button {
        background-color: #0d47a1;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 1rem;
      }

      button:hover {
        background-color: rgb(1, 31, 82);
      }
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-size: 0.9rem;
        text-align: left;
      }

      input[type="text"] {
        padding: 0.8rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 1rem;
      }

      input[type="file"] {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 1rem;
      }

      .buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1rem;

        button {
          background-color: #0d47a1;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        button:hover {
          background-color: rgb(1, 31, 82);
        }

        button:last-child {
          background-color: #ccc;
          color: black;
        }

        button:last-child:hover {
          background-color: #aaa;
        }
      }
    }
  }
`;