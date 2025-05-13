import React, { useEffect, useState } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database } from '../firebaseConfig'; // Adjust path if needed
import { getAuth } from 'firebase/auth'; // <-- To get current user
import '../App.css';
import './Logs.css';

const Logs = () => {
  const [logsByMood, setLogsByMood] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn('User not logged in.');
      setLoading(false);
      return;
    }

    const logsRef = ref(database, `users/${user.uid}/moodLogs`);

    const unsubscribe = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.values(data);
        const grouped = entries.reduce((acc, entry) => {
          const mood = entry.mood || 'Unknown';
          if (!acc[mood]) acc[mood] = [];
          acc[mood].push(entry);
          return acc;
        }, {});
        setLogsByMood(grouped);
      } else {
        setLogsByMood({});
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  return (
    <div className="logs-container" data-group="mood">
      <h2>Mood Logs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : Object.keys(logsByMood).length === 0 ? (
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
