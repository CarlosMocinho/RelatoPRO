import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { FaFileAlt, FaPlus } from "react-icons/fa";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate(); // Hook para redirecionamento

  const handleLogout = async () => {
    if (!user) {
      alert("Erro: usuário não está logado");
      return;
    }

    try {
      await signOut(auth);
      alert("Você saiu da conta com sucesso!");
      navigate("/"); // Redireciona para a página inicial
    } catch (error) {
      console.error("Erro ao sair da conta:", error.message);
      alert("Erro ao sair da conta: " + error.message);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  return (
    <StyledNavbar>
      <div className="logo">
        <Link to="/">
          <img src="/src/assets/RelatoPRO.png" alt="RelatoPRO Logo" />
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/relatorios">
          <FaFileAlt /> Relatórios
        </Link>
        <Link to="/novo-relatorio">
          <FaPlus /> Novo Relatório
        </Link>
      </div>
      <div className="profile-menu">
        <div className="avatar" onClick={toggleDropdown}>
          <img
            src={
              user?.photoURL ||
              "https://via.placeholder.com/40" // Imagem padrão para usuários logados por email/senha
            }
            alt="User Avatar"
          />
        </div>
        {isDropdownVisible && (
          <div className="dropdown" onClick={(e) => e.stopPropagation()}>
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/registro">Registre</Link>
              </li>
              <li>
                <Link to="/Conta">Conta</Link>
              </li>
              <li className="logout" onClick={handleLogout}>
                Sair da Conta
              </li>
            </ul>
          </div>
        )}
      </div>
      {/* Fecha o dropdown ao clicar fora */}
      {isDropdownVisible && <div className="overlay" onClick={closeDropdown}></div>}
    </StyledNavbar>
  );
};

export default Navbar;

const StyledNavbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3f6ce0;
  padding: 0.5rem 1rem;
  color: white;
  position: relative;

  .logo img {
    height: 40px;
    cursor: pointer;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;

    a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      text-decoration: none;
      font-size: 1rem;
      font-weight: bold;
    }

    a:hover {
      text-decoration: underline;
    }
  }

  .profile-menu {
    position: relative;

    .avatar {
      cursor: pointer;

      img {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        border: 2px solid white;
      }
    }

    .dropdown {
      position: absolute;
      top: 50px;
      right: 0;
      background-color: white;
      color: black;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      z-index: 10;

      ul {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          padding: 0.5rem 1rem;
          cursor: pointer;

          a {
            color: black;
            text-decoration: none;
          }

          &:hover {
            background-color: #f0f0f0;
          }

          &.logout {
            color: red;
            font-weight: bold;
          }
        }
      }
    }
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 5;
  }
`;