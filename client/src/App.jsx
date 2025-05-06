import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

function App() {
  return (
    <div className="app-container" style={{ backgroundImage: `url(${background}` }}>
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
  const [response, setResponse] = useState('');
  const [petMood, setPetMood] = useState(neutral);
  const [challenge, setChallenge] = useState('');
  const [resource, setResource] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem('points')) || 0);
  const [challengeAnswer, setChallengeAnswer] = useState('');

  const challenges = [
    "How do you think technology can help improve mental health?",
    "What are some ways to promote emotional well-being in our communities?",
    "How can we better support each other during tough times?",
  ];

  const resources = {
    happy: [
      "https://www.positivityblog.com",
      "https://www.happify.com",
    ],
    neutral: [
      "https://www.youtube.com/watch?v=orK3Ug_DHOM",
      "https://open.spotify.com/playlist/3eDRY2lvw7zXJg5YqOJoSN",
    ],
    sad: [
      "https://www.youtube.com/watch?v=kj1-rR3udNs",
      "https://www.betterhealth.vic.gov.au/health/healthyliving/its-okay-to-feel-sad",
    ],
  };

  const followUps = {
    happy: [
      "What's the best thing that happened today?",
      "Would you like to share what made you so happy?",
      "That's great! How do you plan to keep this positive energy going?",
    ],
    neutral: [
      "Is there something that could make your day better?",
      "Would you like to talk about anything in particular?",
      "Sometimes taking a short break helps. What do you think?",
    ],
    sad: [
      "Would you like to talk about what's bothering you?",
      "Is there something I can do to help you feel better?",
      "Have you tried doing something you enjoy today?",
    ],
  };

  useEffect(() => {
    localStorage.setItem('points', points);
  }, [points]);

  const detectMood = (input) => {
    if (input.toLowerCase().startsWith('not')) return 'sad';

    const happyKeywords = ['happy', 'joyful', 'glad', 'awesome', 'great', 'excited'];
    const neutralKeywords = ['okay', 'fine', 'meh', 'neutral'];
    const sadKeywords = ['sad', 'upset', 'bad', 'depressed', 'unhappy'];

    const words = input.toLowerCase().split(' ');
    if (words.some(word => happyKeywords.includes(word))) return 'happy';
    if (words.some(word => neutralKeywords.includes(word))) return 'neutral';
    if (words.some(word => sadKeywords.includes(word))) return 'sad';
    return null;
  };

  const handleSubmit = () => {
    const mood = detectMood(userInput);
    if (mood === 'happy') {
      setResponse("That's wonderful! 😊 I'm so happy to hear you're feeling good!");
      setPetMood(happy);
    } else if (mood === 'neutral') {
      setResponse("That's okay! Everyone has those neutral days. 😊");
      setPetMood(neutral);
    } else if (mood === 'sad') {
      setResponse("I'm here for you during this tough time. Things will get better soon.");
      setPetMood(sad);
    } else {
      setResponse("I'm not quite sure how to interpret that, but I'm here to listen! 💭");
      setPetMood(neutral);
    }

    setChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
    setResource(resources[mood]?.[Math.floor(Math.random() * resources[mood].length)] || '');
    setFollowUp(followUps[mood]?.[Math.floor(Math.random() * followUps[mood].length)] || '');
    setUserInput('');
  };

  const handleChallengeSubmit = () => {
    if (challengeAnswer.trim() !== '') {
      setPoints(points + 50);
      setChallengeAnswer('');
      alert('Challenge completed! You earned 50 points!');
    } else {
      alert('Please provide an answer to the challenge.');
    }
  };

  return (
    <div className='home-container'>
      <div className='user-level'>
        <span className="level-circle">1</span>
        <div className='progress-bar'>
          <span style={{ width: `${(points % 100) || 10}%` }}></span>
        </div>
        <p>Points: {points}</p>
      </div>
      <div className='home-content'>
        <div className="challenges-box">
          <h2>Challenges</h2>
          <p>{challenge}</p>
          <input
            type="text"
            value={challengeAnswer}
            onChange={(e) => setChallengeAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
          <button onClick={handleChallengeSubmit}>Submit Answer</button>
        </div>
        <div className="pet-container">
          <img src={petMood} alt="Pet Mood" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
        <div className="text-box">
          <h2>How are you feeling today?</h2>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your feelings here..."
          />
          <button onClick={handleSubmit}>Submit</button>
          <p>{response}</p>
          <p><strong>Follow-up:</strong> {followUp}</p>
          <p><strong>Resource:</strong> <a href={resource} target="_blank" rel="noopener noreferrer">{resource}</a></p>
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
