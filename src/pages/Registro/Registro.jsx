import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import styled from "styled-components";

const Registro = () => {
  const [nome, setNome] = useState(""); // Novo estado para o nome
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate(); // Hook para redirecionamento

  const handleRegister = async () => {
    if (nome.trim().length < 5 || nome.trim().length > 20) {
      alert("O nome deve ter entre 5 e 20 caracteres.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Atualizar o perfil do usuário com o nome fornecido
      await updateProfile(user, {
        displayName: nome,
      });

      // Adicionar dados do usuário ao Firestore
      await setDoc(doc(db, "Users", user.uid), {
        nome: nome,
        email: email,
      });

      alert("Conta criada com sucesso! Seja Bem vindo");
      navigate("/"); // Redireciona para a página inicial
    } catch (error) {
      console.error("Erro ao criar conta:", error.message);
      alert("Erro ao criar conta: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Salva o nome no Firestore se não existir
      await setDoc(doc(db, "Users", user.uid), {
        nome: user.displayName || "Usuário",
        email: user.email,
      }, { merge: true });
      alert("Login com Google realizado com sucesso! Seja bem vindo");
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error.message);
      alert("Erro ao fazer login com Google Por favor tente novamente");
    }
  };

  return (
    <RegistroWrapper>
      <div className="right-panel">
        <h1>Crie sua conta!</h1>
        <p className="subtitulo">Por favor insira seus dados</p>
        <form>
          <div className="input-group">
            <label>Nome</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Exemplo Junvenal.almeida@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Insira sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleRegister} className="register-btn">
            Efetuar Registro
          </button>
        </form>
        <p>
          Já possui registro? <Link to="/login">Faça Login!</Link>
        </p>
        <div className="divider">or</div>
        <button type="button" onClick={handleGoogleLogin} className="google-btn">
          Registre com sua conta Google
        </button>
      </div>
    </RegistroWrapper>
  );
};

export default Registro;

const RegistroWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(90deg, #165bbd 60%, #ffe066 100%);

  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: white;
    border-radius: 18px;
    max-width: 400px;
    margin: auto;

    h1 {
      font-size: 2rem;
      margin-bottom: -1rem;
      color: #165bbd;
      font-weight: bold;
    }

    .subtitulo {
      font-size: 1rem;
      margin-bottom: 3rem;
      color: #165bbd;
    }

    form {
      width: 100%;
      max-width: 340px;

      .input-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;

        label {
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
          color: #165bbd;
        }

        input {
          padding: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1rem;
        }
      }

      .register-btn {
        width: 100%;
        padding: 0.8rem;
        background-color: #165bbd;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
        font-weight: bold;
        margin-bottom: 1rem;
        transition: background 0.2s;
      }

      .register-btn:hover {
        background-color: #0d47a1;
      }
    }

    p {
      font-size: 0.9rem;
      margin-top: 1rem;

      a {
        color: #165bbd;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    }

    .divider {
      margin: 1.5rem 0;
      font-size: 0.9rem;
      color: #aaa;
    }

    .google-btn {
      width: 100%;
      max-width: 340px;
      padding: 0.8rem;
      background-color: #ffe066;
      color: #165bbd;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      margin-bottom: 1rem;
      transition: background 0.2s;
    }

    .google-btn:hover {
      background-color: #ffd700;
    }
  }
`;