import React from "react";
import Navbar from "../../components/Navbar";
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const RelatoPROLogo = "/RelatoPRO.png";
const UserDefault = "/Usuariopadrao.png";

const Home = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleComeceAgora = (e) => {
    e.preventDefault();
    if (user) {
      navigate("/relatorios");
    } else {
      navigate("/registro");
    }
  };

  return (
    <LandingWrapper>
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <div>
            <h1>
              Bem-vindo ao <span className="highlight">RelatoPRO</span>
            </h1>
            <p>
              Organize, compartilhe e registre relatórios de serviços de forma simples, rápida e segura.<br />
              Sua rotina profissional mais eficiente e colaborativa!
            </p>
            <button className="cta-btn" onClick={handleComeceAgora}>
              Comece Agora
            </button>
          </div>
          <img src={RelatoPROLogo} alt="Logo RelatoPRO" className="hero-img" />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h2>Gestão de Relatórios</h2>
          <p>
            Salve, edite e acesse seus relatórios de qualquer lugar, com segurança e praticidade.
          </p>
        </div>
        <div className="feature-card">
          <h2>Compartilhamento Fácil</h2>
          <p>
            Compartilhe relatórios com sua equipe ou líderes em poucos cliques, mantendo todos informados.
          </p>
        </div>
        <div className="feature-card">
          <h2>Visual Moderno</h2>
          <p>
            Interface intuitiva, responsiva e agradável, pensada para facilitar seu dia a dia.
          </p>
        </div>
      </section>

      <section className="about">
        <div className="about-content">
          <a
            href="https://github.com/CarlosMocinho"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block" }}
            title="Ver GitHub Do criador"
          >
            <img
              src="https://avatars.githubusercontent.com/u/140860836?v=4"
              alt="Carlos Mocinho"
              className="about-img"
              style={{ cursor: "pointer" }}
            />
          </a>
          <div>
            <h2>Sobre o RelatoPRO</h2>
            <p>
              O RelatoPRO foi criado para profissionais que buscam agilidade e organização no registro de serviços. 
              Com recursos de exportação, filtros e colaboração, você tem tudo o que precisa em um só lugar.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <span>
          &copy; {new Date().getFullYear()} RelatoPRO. Todos os direitos reservados.
        </span>
      </footer>
    </LandingWrapper>
  );
};

export default Home;

const LandingWrapper = styled.div`
  background: #f6f7f9;
  min-height: 100vh;

  .hero {
    background: linear-gradient(90deg, #165bbd 60%, #ffe066 100%);
    color: #fff;
    padding: 3rem 0 2rem 0;
    .hero-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3rem;
      max-width: 1100px;
      margin: 0 auto;
      flex-wrap: wrap;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      .highlight {
        color: #ffe066;
      }
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      color: #fffbe7;
    }
    .cta-btn {
      background: #ffe066;
      color: #165bbd;
      padding: 0.9rem 2.2rem;
      border-radius: 30px;
      font-size: 1.1rem;
      font-weight: bold;
      text-decoration: none;
      box-shadow: 0 2px 8px rgba(22,91,189,0.08);
      transition: background 0.2s, color 0.2s;
      border: none;
      cursor: pointer;
      &:hover {
        background: #ffd700;
        color: #0d47a1;
      }
    }
    .hero-img {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 4px 16px rgba(22,91,189,0.12);
      object-fit: contain;
      border: 4px solid #ffe066;
    }
  }

  .features {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: 3rem 0 2rem 0;
    flex-wrap: wrap;
    .feature-card {
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 2px 10px rgba(22,91,189,0.08);
      padding: 2rem 1.5rem;
      min-width: 260px;
      max-width: 320px;
      text-align: center;
      h2 {
        color: #165bbd;
        margin-bottom: 0.7rem;
        font-size: 1.3rem;
      }
      p {
        color: #222;
        font-size: 1rem;
      }
    }
  }

  .about {
    background: #fffbe7;
    padding: 2.5rem 0;
    .about-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2.5rem;
      max-width: 900px;
      margin: 0 auto;
      flex-wrap: wrap;
    }
    .about-img {
      width: 170px;
      height: 170px;
      border-radius: 30px;
      object-fit: cover;
      border: 4px solid #165bbd;
      background: #fff;
    }
    h2 {
      color: #165bbd;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    p {
      color: #222;
      font-size: 1.1rem;
      max-width: 400px;
    }
  }

  footer {
    background: #165bbd;
    color: #ffe066;
    text-align: center;
    padding: 1.2rem 0 1rem 0;
    font-size: 1rem;
    margin-top: 2rem;
    letter-spacing: 0.5px;
  }

  @media (max-width: 900px) {
    .hero-content, .about-content, .features {
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
    .hero-img, .about-img {
      margin-top: 1.5rem;
    }
  }
`;