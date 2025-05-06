import { Route, Routes } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Nav from './Nav';
import Logs from './pages/Logs';
import Store from './pages/Store';
import ResourcePage from './pages/ResourcePage';
import About from './pages/About';
import neutral from './assets/chip-neutral.png';
import happy from './assets/chip-happy.png';
import sad from './assets/chip-sad.png';
import goldCoin from './assets/goldcoin.png';
import background from './assets/mdflagbg.jpg';
import './App.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import { database } from "./firebaseConfig";
import { getAIResponse } from './api/localai';
import forestbg from './assets/forestbg.png';
import umbcbg from './assets/umbcbg.png';

const backgroundImages = {
  'forestbg.png': forestbg,
  'umbcbg.png': umbcbg
};

function App() {
  return (
    <div className="app-container" style={{ backgroundImage: `url(${background})` }}>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/store" element={<Store />} />
          <Route path="/resourcepage" element={<ResourcePage />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

function Home() {
  const [userInput, setUserInput] = useState('');
  const [petMood, setPetMood] = useState(neutral);
  const [challenge, setChallenge] = useState('');
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [resource, setResource] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [conversationState, setConversationState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([{ sender: 'bot', text: 'How are you feeling today?' }]);

  const [user, setUser] = useState(null);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [backgroundName, setBackgroundName] = useState(null);

  const messageEndRef = useRef(null);

  const level = Math.floor(xp / 100);
  const xpToNextLevel = 100;
  const xpProgress = xp % xpToNextLevel;

  const challenges = [
    "How do you think technology can help improve mental health?",
    "What are some ways to promote emotional well-being in our communities?",
    "How can we better support each other during tough times?",
    "What are some self-care practices you find helpful?",
    "How do you define happiness?",
    "What are some things that make you feel grateful?",
    "How do you cope with stress?",
    "What are some activities that bring you joy?",
    "How do you practice mindfulness in your daily life?",
    "What are some ways to build resilience in the face of challenges?"
  ];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      if (currUser) {
        const uid = currUser.uid;
        const dbRef = ref(database);
        const xpSnap = await get(child(dbRef, `users/${uid}/xp`));
        const coinSnap = await get(child(dbRef, `users/${uid}/coins`));
        const bgSnap = await get(child(dbRef, `users/${uid}/background`));
        setXp(xpSnap.exists() ? xpSnap.val() : 0);
        setCoins(coinSnap.exists() ? coinSnap.val() : 0);
        setBackgroundName(bgSnap.exists() ? bgSnap.val() : null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const detectMood = (input) => {
    if (input.toLowerCase().startsWith('not')) return 'sad';
    const happy = ['happy', 'joyful', 'excited', 'glad', 'awesome', 'good', 'great', 'fantastic', 'amazing', 'wonderful', 'elated', 'cheerful', 'content', 'pleased'];
    const neutral = ['okay', 'fine', 'meh', 'neutral', 'alright', 'normal', 'indifferent', 'average', 'so-so', 'okay'];
    const sad = ['sad', 'upset', 'down', 'bad', 'angry', 'depressed', 'frustrated', 'disappointed', 'unhappy', 'miserable', 'gloomy', 'blue', 'dismal', 'sorrowful', 'distressed'];
    const words = input.toLowerCase().split(' ');

    if (words.some(w => happy.includes(w))) return 'happy';
    if (words.some(w => neutral.includes(w))) return 'neutral';
    if (words.some(w => sad.includes(w))) return 'sad';
    return 'neutral';
  };

  const moodToPetImage = { happy, neutral, sad };

  const gainXp = (earnedXp) => {
    const newXp = xp + earnedXp;
    setXp(newXp);

    if (user) {
      set(ref(database, `users/${user.uid}/xp`), newXp);
    }

    if (newXp >= level * 100 + 100) {
      const newCoins = coins + 50;
      const newLevel = level + 1;
      setCoins(newCoins);
      alert(`Congratulations! You've reached level ${newLevel}!`);

      if (user) {
        set(ref(database, `users/${user.uid}/coins`), newCoins);
        set(ref(database, `users/${user.uid}/level`), newLevel);
      }
    }
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user', text: userInput }];
    setChatHistory(newHistory);
    setUserInput('');
    setLoading(true);

    const aiResult = await getAIResponse(userInput, conversationState);
    setChatHistory([
      ...newHistory,
      { sender: 'bot', text: aiResult.text },
      aiResult.followUp && { sender: 'bot', text: aiResult.followUp },
      aiResult.resource && { sender: 'bot', text: `${aiResult.resource.title} - ${aiResult.resource.url}` }
    ].filter(Boolean));

    setConversationState(aiResult.nextStep);
    setFollowUp(aiResult.followUp || '');
    setResource(aiResult.resource || '');
    setLoading(false);

    const mood = detectMood(userInput);
    setPetMood(moodToPetImage[mood]);
    setTimeout(() => setPetMood(neutral), 3000);

    gainXp(10);

    // Trigger new challenge
    setChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
  };

  const handleChallengeSubmit = async () => {
    if (challengeAnswer.trim()) {
      gainXp(50);
      const newCoins = coins + 5;
      setCoins(newCoins);
      setChallengeAnswer('');
      alert('Challenge completed! You earned 50 XP!');
      setPetMood(happy);
      setTimeout(() => 
        setPetMood(neutral),
        setChallenge(''),
        setChallengeAnswer('')
      , 3000);

      if (user) {
        await set(ref(database, `users/${user.uid}/coins`), newCoins);
      }
    } else {
      alert('Please enter your challenge answer.');
    }
  };

  return (
    <div className="home-container">
      <div className="user-info">
        <div className="user-level">
          <span className="level-circle">{level}</span>
          <div className="progress-bar">
            <span style={{ width: `${(xpProgress / xpToNextLevel) * 100}%` }}></span>
          </div>
          <p>XP: {xp} / {level * 100 + 100}</p>
        </div>
        <div className="coins-container">
          <img src={goldCoin} alt="coins" style={{ maxWidth: '40px' }} />
          <p>{coins}</p>
        </div>
      </div>

      <div className="home-content">
        <div className="challenges-box">
          <h2>Challenges</h2>
          <p>{challenge}</p>
          {challenge ?
          <>
            <input
            type="text"
            value={challengeAnswer}
            onChange={(e) => setChallengeAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
          <button onClick={handleChallengeSubmit}>Submit Answer</button>
          </>
          : <p>Talk to your pet to unlock a challenge!</p>
          }
        </div>

        <div
          className="pet-container"
          style={{
            backgroundImage: backgroundName ? `url(${backgroundImages[backgroundName]})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <img src={petMood} alt="Pet Mood" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>

        <div className="text-box">
          {user ? <h2>Hi {user.displayName}, Welcome to PawPrintz!</h2> : <h2>Welcome to PawPrintz!</h2>}
          <div className="chat-window" style={{
            maxHeight: '400px', overflowY: 'auto', display: 'flex',
            flexDirection: 'column', gap: '10px', padding: '10px',
            border: '1px solid #ccc', borderRadius: '8px', marginBottom: '10px'
          }}>
            {chatHistory.map((msg, index) => (
              <div key={index} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? '#DCF8C6' : '#F1F0F0',
                padding: '10px 14px', borderRadius: '16px',
                maxWidth: '70%', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
              }}>
                {msg.text}
              </div>
            ))}
            {loading && <div style={{ fontStyle: 'italic' }}>Typing...</div>}
            <div ref={messageEndRef} />
          </div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Type your feelings here..."
          />
          <button onClick={handleSubmit}>Send</button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="footer">
      <ul>
        <p><a href="https://my.umbc.edu" target="_blank" rel="noreferrer">myUMBC</a></p>
        <p><a href="https://health.umbc.edu" target="_blank" rel="noreferrer">RIH</a></p>
      </ul>
    </div>
  );
}

export default App;
