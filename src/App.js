import { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('all');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/cities`, { method: "GET" })
      .then(response => response.json())
      .then(data => setCities(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      setLoading(true);
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/news?city=${selectedCity}`)
        .then(response => response.json())
        .then(data => setNews(data))
        .finally(() => setLoading(false));
    }
  }, [selectedCity, cities]);

  return (
    <div className="app">
      <h1>Local News { selectedCity != "all" && <button onClick={() => setSelectedCity("all")}>Reset location</button>}</h1>
      <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
        <option value="all">Choose your location</option>
        {cities.map(city => (
          <option key={city.name} value={city.name}>{city.name}</option>
        ))}
      </select>
      { selectedCity == "all" && <h2>... Or click city under any article</h2> } <br/>

      {loading ? <p>Loading...</p> : (
        <div className="news-list">
          {news.map(item => (
            <div key={item.id} className="news-item">
              <h3>{item.title}</h3>
              <p>{item.content}</p>
              {item.city ? <small style={{ color: "gray", textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setSelectedCity(item.city.name)}>{item.city.name}</small>
                  : <small style={{ color: "red", fontWeight: "bold" }}>Global news</small>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
