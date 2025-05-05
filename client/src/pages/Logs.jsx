import React, { useEffect, useState } from 'react';
import '../App.css';
import './Logs.css';

const Logs = () => {
  const [logsByMood, setLogsByMood] = useState({});

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];

    const grouped = storedLogs.reduce((acc, entry) => {
      const mood = entry.mood || 'Unknown';
      if (!acc[mood]) acc[mood] = [];
      acc[mood].push(entry);
      return acc;
    }, {});

    setLogsByMood(grouped);
  }, []);

  return (
    <div className="logs-container">
      <h2>Mood Logs</h2>
      {Object.keys(logsByMood).length === 0 ? (
        <p>No logs yet!</p>
      ) : (
        Object.entries(logsByMood).map(([mood, entries]) => (
          <div key={mood} className="mood-group">
            <h3>{mood.charAt(0).toUpperCase() + mood.slice(1)}</h3>
            <ul>
              {entries.map((entry, index) => (
                <li key={index}>
                  {entry.mood} ({entry.date})
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};


export default Logs;
