import React from "react";
import Header from "../Header/Header";
import "./AboutUs.css";

const AboutUs: React.FC = () => {
  return (
    <>
      <Header variant="aboutus" />
      <div className="aboutus-container">
        <div className="aboutus-div">
          <p>
            Nossa plataforma de chat interativo permite a{" "}
            <strong>exploração de documentações técnicas</strong> de maneira
            eficiente, integrando scraping automatizado, processamento semântico
            e inteligência artificial. Ela funciona da seguinte maneira:
          </p>
          <ul>
            <li>
              Os usuários podem <strong>submeter URLs de documentações</strong>,
              que são processadas pelo sistema para a extração de dados,{" "}
              <strong>transformados em vetores</strong> e{" "}
              <strong>armazendos em um banco de dados vetorial</strong>.
            </li>
            <li>
              Após esse processo, o usuário pode fazer uma{" "}
              <strong>pergunta ao chat</strong>, que realizará uma{" "}
              <strong>busca por similaridade</strong> no banco de dados vetorial
              e conseguirá oferecer{" "}
              <strong>respostas relacionadas às URLs submetidas de maneira precisa</strong>.
            </li>
          </ul>
          <p>
            Essa combinação de <strong>scraping</strong>,{" "}
            <strong>processamento semântico</strong> e <strong>IA</strong> torna
            nossa plataforma uma solução prática para profissionais que precisam
            acessar e explorar documentações técnicas de forma rápida e
            personalizada.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
