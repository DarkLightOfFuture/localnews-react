import { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('all');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/cities', { method: "GET" })
      .then(response => response.json())
      .then(data => { console.log(data); setCities(data) })
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      setLoading(true);
      fetch(`/api/news?city=${selectedCity}`)
        .then(response => response.json())
        .then(data => setNews(data))
        .finally(() => setLoading(false));
    }
  }, [selectedCity, cities]);

  return (
    <div className="app">
      <h1>Local News</h1>
      <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
        <option value="all">All Cities</option>
        {cities.map(city => (
          <option key={city.name} value={city.name}>{city.name}</option>
        ))}
      </select>
      
      {loading ? <p>Loading...</p> : (
        <div className="news-list">
          {news.map(item => (
            <div key={item.id} className="news-item">
              <h3>{item.title}</h3>
              <p>{item.content}</p>
              {item.city ? <small style={{ color: "gray", textDecoration: "underline" }}>{item.city.name}</small>
                : <small style={{ color: "red", fontWeight: "bold" }}>Global news</small>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;