import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState(""); // Estado para armazenar a URL digitada
  const [result, setResult] = useState(""); // Estado para armazenar o resultado do fetch
  const [loading, setLoading] = useState(false); // Estado para controlar o loading

  // Função que será chamada quando o botão for clicado
  const handleScrape = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    setLoading(true); // Seta o estado de loading para true enquanto faz o fetch

    try {
      const response = await fetch("http://localhost:3000/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2)); // Armazena o resultado no estado
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to scrape data");
    } finally {
      setLoading(false); // Remove o estado de loading quando a requisição termina
    }
  };

  return (
    <div>
      <header>
        <h1>Web Scraper</h1>
      </header>
      <main>
        <input
          type="text"
          value={url} // O valor do input é controlado pelo estado
          onChange={(e) => setUrl(e.target.value)} // Atualiza o estado quando o usuário digita algo
          placeholder="Enter URL"
        />
        <button onClick={handleScrape} disabled={loading}>
          {" "}
          {/* Desabilita o botão enquanto está carregando */}
          {loading ? "Scraping..." : "Scrape"}
        </button>
        <pre id="result">{result}</pre> {/* Exibe o resultado do scrape */}
      </main>
    </div>
  );
}

export default App;
