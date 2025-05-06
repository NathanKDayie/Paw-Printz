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
import background from './assets/mdflagbg.jpg';
import './App.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAIResponse } from './api/localai';

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
      </div>
      <Footer />
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
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'How are you feeling today?' }
  ]);
  const [user, setUser] = useState(null);

  const messageEndRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });
    return () => unsubscribe();
  }, []);

  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('xp')) || 0);
  const level = Math.floor(xp / 100);
  const xpToNextLevel = 100;
  const xpProgress = xp % xpToNextLevel;

  const challenges = [
    "How do you think technology can help improve mental health?",
    "What are some ways to promote emotional well-being in our communities?",
    "How can we better support each other during tough times?",
  ];

  useEffect(() => {
    localStorage.setItem('xp', xp);
  }, [xp]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  // --- Mood detection keywords ---
  const happyKeywords = [
    "happy", "joyful", "excited", "ecstatic", "thrilled", "elated", "cheerful", "delighted",
    "awesome", "fantastic", "great", "wonderful", "amazing", "glad", "celebrating", "grateful",
    "overjoyed", "giddy", "playful", "fun", "smiling", "laughing", "bubbly", "feeling great"
  ];

  const contentKeywords = [
    "content", "relaxed", "chill", "calm", "satisfied", "peaceful", "easygoing", "fine", "balanced",
    "zen", "laid back", "unbothered", "steady", "quiet", "neutral", "stable"
  ];

  const stressedKeywords = [
    "stressed", "anxious", "overwhelmed", "tense", "nervous", "pressured", "panicked", "frantic",
    "worried", "burned out", "exhausted", "restless", "irritable", "jittery", "snappy", "tight"
  ];

  const sadKeywords = [
    "sad", "down", "depressed", "lonely", "blue", "miserable", "hopeless", "heartbroken", "melancholy",
    "low", "crying", "despair", "helpless", "lost", "gloomy", "defeated", "numb", "isolated"
  ];

  const angryKeywords = [
    "angry", "mad", "furious", "frustrated", "irritated", "annoyed", "enraged", "upset", "pissed",
    "resentful", "offended", "bitter", "snappy", "hostile", "agitated", "outraged"
  ];

  const confusedKeywords = [
    "confused", "lost", "uncertain", "unsure", "doubtful", "mixed up", "puzzled", "disoriented",
    "conflicted", "perplexed", "torn", "blurred", "muddled"
  ];

  const neutralKeywords = [
    "okay", "fine", "meh", "neutral", "alright", "so-so", "average", "decent", "typical", "standard",
    "nothing special", "normal", "indifferent"
  ];

  const detectMood = (input) => {
    const words = input.toLowerCase().split(/\s+/);

    if (words.some(word => happyKeywords.includes(word))) return 'happy';
    if (words.some(word => contentKeywords.includes(word))) return 'content';
    if (words.some(word => stressedKeywords.includes(word))) return 'stressed';
    if (words.some(word => sadKeywords.includes(word))) return 'sad';
    if (words.some(word => angryKeywords.includes(word))) return 'angry';
    if (words.some(word => confusedKeywords.includes(word))) return 'confused';
    if (words.some(word => neutralKeywords.includes(word))) return 'neutral';

    return 'neutral'; // fallback
  };

  const moodToPetImage = {
    happy: happy,
    content: happy,
    neutral: neutral,
    confused: neutral,
    sad: sad,
    stressed: sad,
    angry: sad
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
      aiResult.followUp && { sender: 'bot', text: `Follow-up: ${aiResult.followUp}` },
      aiResult.resource && { sender: 'bot', text: `Resource: ${aiResult.resource.title} - ${aiResult.resource.url}` }
    ].filter(Boolean));

    setFollowUp(aiResult.followUp);
    setResource(aiResult.resource ? `${aiResult.resource.title} - ${aiResult.resource.url}` : '');
    setConversationState(aiResult.nextStep);
    setLoading(false);

    // Detect mood and log it
    const mood = detectMood(userInput);
    setPetMood(moodToPetImage[mood] || neutral);
    const today = new Date().toISOString().split('T')[0];
    const existingLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    const updatedLogs = [...existingLogs, { mood, date: today }];
    localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));

    // Reward XP
    setChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
    setXp(prev => prev + 10);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleChallengeSubmit = () => {
    if (challengeAnswer.trim()) {
      setXp(prev => prev + 50);
      setChallengeAnswer('');
      alert('Challenge completed! You earned 50 XP!');
    } else {
      alert('Please enter your challenge answer.');
    }
  };

  const handleChallengeKeyDown = (e) => {
    if (e.key === 'Enter') handleChallengeSubmit();
  };

  return (
    <div className='home-container'>
      <div className='user-level'>
        <span className="level-circle">{level}</span>
        <div className='progress-bar'>
          <span style={{ width: `${(xpProgress / xpToNextLevel) * 100}%` }}></span>
        </div>
        <p>XP: {xp} / {level * 100 + 100}</p>
      </div>

      <div className='home-content'>
        <div className="challenges-box">
          <h2>Challenges</h2>
          <p>{challenge}</p>
          <input
            type="text"
            value={challengeAnswer}
            onChange={(e) => setChallengeAnswer(e.target.value)}
            onKeyDown={handleChallengeKeyDown}
            placeholder="Type your answer here..."
          />
          <button onClick={handleChallengeSubmit}>Submit Answer</button>
        </div>

        <div className="pet-container">
          <img src={petMood} alt="Pet Mood" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>

        <div className="text-box">
          {user ? <h2>Hi {user.displayName}, Welcome to PawPrintz!</h2> : <h2>Welcome to PawPrintz!</h2>}
          <div
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'user' ? '#DCF8C6' : '#F1F0F0',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  maxWidth: '70%',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
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
            onKeyDown={handleKeyDown}
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
        <p><a href="https://my.umbc.edu" target="_blank">myUMBC</a></p>
        <p><a href="https://health.umbc.edu" target="_blank">RIH</a></p>
      </ul>
    </div>
  );
}

export default App;
