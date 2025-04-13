import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import styled from "styled-components";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate(); // Hook para redirecionamento

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("Login realizado com sucesso! Seja bem vindo");
      navigate("/"); // Redireciona para a página inicial
    } catch (error) {
      console.error("Erro de login:", error.message);
      alert("Erro ao fazer login por Favor verifique o email e a senha");
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
      alert("Erro ao fazer login com Google! Por favor tente novamente");
    }
  };

  return (
    <LoginWrapper>
      
      <div className="right-panel">
        <h1>Bem Vindo de Volta!</h1>
        <p className="subtitulo">Por favor Insira o seu email e senha</p>
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
              placeholder="insira sua Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <div className="options">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Guardar Dados?</label>
            </div>
            <Link to="/reset-password">Esqueceu a senha?</Link>
          </div>
          <button type="button" onClick={handleLogin} className="sign-in-btn">
            Entrar
          </button>
        </form>
        <p>
          Ainda não possui conta? <Link to="/registro">Cadastre-se Agora</Link>
        </p>
        <div className="divider">Ou se preferir</div>
        <button type="button" onClick={handleGoogleLogin} className="google-btn">
          Entre com sua conta Google
        </button>
      </div>
    </LoginWrapper>
  );
};

export default Login;

const LoginWrapper = styled.div`
  display: flex;
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

      .options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        label {
          font-size: 0.9rem;
        }

        a {
          font-size: 0.9rem;
          color: #007bff;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      }

      .sign-in-btn {
        width: 100%;
        padding: 0.8rem;
        background-color: black;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
      }

      .sign-in-btn:hover {
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