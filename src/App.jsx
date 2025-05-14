import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = 'https://api.waifu.im/search';
  const params = {
    included_tags: ['waifu', 'oppai'],
    height: '>=2000',
  };

  function buildRequestUrl() {
    const queryParams = new URLSearchParams();

    for (const key in params) {
      if (Array.isArray(params[key])) {
        params[key].forEach(value => {
          queryParams.append(key, value);
        });
      } else {
        queryParams.set(key, params[key]);
      }
    }

    return `${apiUrl}?${queryParams.toString()}`;
  }

  function loadImage() {
    setLoading(true);
    setError('');
    const requestUrl = buildRequestUrl();

    fetch(requestUrl)
      .then(response => {
        if (response.ok) return response.json();
        else throw new Error('Erro na requisição: ' + response.status);
      })
      .then(data => {
        const image = data.images?.[0]?.url;
        if (image) {
          setImageUrl(image);
        } else {
          setError('Nenhuma imagem encontrada.');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Erro ao carregar imagem.');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Carrega uma imagem ao montar o componente
  useEffect(() => {
    loadImage();
  }, []);

  return (
    <div className="container">
      <h1>Waifu Viewer</h1>
      <button onClick={loadImage}>Carregar nova imagem</button>
      <div className="card">
        <div className={`fade-container ${loading ? 'fade-out' : 'fade-in'}`}>
          {loading && <div className="spinner" />}
          {!loading && error && <p>{error}</p>}
          {!loading && imageUrl && (
            <img
              src={imageUrl}
              alt="Imagem da API"
              style={{ maxWidth: '100%', borderRadius: '10px' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
