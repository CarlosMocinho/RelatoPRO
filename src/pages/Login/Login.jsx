import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import styled from "styled-components";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Importe o db se ainda não estiver feito

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
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Sempre salva/atualiza o nome do Google no Firestore
      await setDoc(
        doc(db, "Users", user.uid),
        {
          nome: user.displayName || "Usuário",
          email: user.email,
        },
        { merge: true }
      );
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

      .options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        label {
          font-size: 0.9rem;
          color: #165bbd;
        }

        a {
          font-size: 0.9rem;
          color: #165bbd;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      }

      .sign-in-btn {
        width: 100%;
        padding: 0.8rem;
        background-color: #165bbd;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
        margin-bottom: 1rem;
        font-weight: bold;
        transition: background 0.2s;
      }

      .sign-in-btn:hover {
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