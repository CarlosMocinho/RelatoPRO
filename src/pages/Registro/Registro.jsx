import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import styled from "styled-components";

const Registro = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate(); // Hook para redirecionamento

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert("Conta criada com sucesso! Seja Bem vindo");
      navigate("/"); // Redireciona para a página inicial
    } catch (error) {
      console.error("Erro ao criar conta:", error.message);
      alert("Erro ao criar conta Dados Ja cadastrados ");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Login com Google realizado com sucesso! Seja bem vindo");
      navigate("/"); // Redireciona para a página inicial
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
            <label>Password</label>
            <input
              type="password"
              placeholder="Insira Sua Senha"
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
          Ja possui registro? <Link to="/login">Faça Login!</Link>
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

  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;

    h1 {
      font-size: 2rem;
      margin-bottom: -1rem;
    }

    .subtitulo {
      font-size: 1rem;
      margin-bottom: 3rem;
    }

    form {
      width: 100%;
      max-width: 400px;

      .input-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;

        label {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
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
        background-color: black;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
      }

      .register-btn:hover {
        background-color: #333;
      }
    }

    p {
      font-size: 0.9rem;
      margin-top: 1rem;

      a {
        color: #007bff;
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
      max-width: 400px;
      padding: 0.8rem;
      background-color: white;
      color: black;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .google-btn:hover {
      background-color: #f5f5f5;
    }
  }
`;