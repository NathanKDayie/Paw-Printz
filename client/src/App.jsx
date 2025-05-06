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
import goldCoin from './assets/goldcoin.png';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, set, get, child, getDatabase } from "firebase/database";
import { database } from "./firebaseConfig.js";
import './App.css';

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
  const [response, setResponse] = useState('');
  const [petMood, setPetMood] = useState(neutral);
  const [challenge, setChallenge] = useState('');
  const [resource, setResource] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      const handleAuth = async () => {
        if (currUser) {
          setUser(currUser);

          const dbRef = ref(database);
          try {
            const snapshot = await get(child(dbRef, `users/${currUser.uid}/xp`));
            if (snapshot.exists()) {
              setXp(snapshot.val());
            }
          } catch (error) {
            console.error("Error loading XP:", error);
          }
        } else {
          setUser(null);
        }
      };
      handleAuth();
    });

      return () => unsubscribe();
  }, []);

  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const level = Math.floor(xp / 100);
  const xpToNextLevel = 100;
  const xpProgress = xp % xpToNextLevel;

  const gainXp = () => {
    const newXp = xp + 50;
    setXp(newXp);
    if (newXp >= level * 100 + 100) {
      const addCoins = coins + 50;
      const addLevel = level + 1;
      alert(`Congratulations! You've leveled up to level ${level + 1}! Here's 50 coins!`);
      const userCoinsRef = ref(database, `users/${user ? user.uid : "Program Tester"}/coins`);
      const userLevelRef = ref(database, `users/${user ? user.uid : "Program Tester"}/level`);
      set(userLevelRef, addLevel).then(() => {
        console.log("Level saved successfully!: ", level + 1);
      }).catch((error) => {
        console.error("Error saving level:", error);
      });
      set(userCoinsRef, addCoins).then(() => {
        console.log("Coins saved successfully!: ", addCoins);
      }).catch((error) => {
        console.error("Error saving coins:", error);
      });
      
      setCoins(addCoins);
    }
    const userXpRef = ref(database, `users/${user ? user.uid : "Program Tester"}/xp`);
    set(userXpRef, xp) .then(() => {
      console.log("XP saved successfully!: ", newXp);
    })
    .catch((error) => {
      console.error("Error saving XP:", error);
    });
    alert('Challenge completed! You earned 50 XP!');
  };
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

  const detectMood = (input) => {
    if (input.toLowerCase().startsWith('not')) return 'sad';

    const happyKeywords = ['happy', 'joyful', 'excited', 'content', 'glad', 'awesome', 'good', 'great'];
    const neutralKeywords = ['okay', 'fine', 'meh', 'neutral', 'alright'];
    const sadKeywords = ['sad', 'upset', 'down', 'bad', 'angry', 'depressed'];

    const words = input.toLowerCase().split(' ');

    if (words.some(word => happyKeywords.includes(word))) return 'happy';
    if (words.some(word => neutralKeywords.includes(word))) return 'neutral';
    if (words.some(word => sadKeywords.includes(word))) return 'sad';

    return null;
  };

  const handleSubmit = () => {
    const mood = detectMood(userInput);
    let moodImage = neutral;

    if (mood === 'happy') {
      setResponse("That's wonderful! 😊 I'm so happy to hear you're feeling good!");
      moodImage = happy;
    } else if (mood === 'neutral') {
      setResponse("That's okay! Everyone has those neutral days. 😊");
      moodImage = neutral;
    } else if (mood === 'sad') {
      setResponse("I'm here for you during this tough time. Things will get better soon.");
      moodImage = sad;
    } else {
      setResponse("I'm not quite sure how to interpret that, but I'm here to listen! 💭");
      moodImage = neutral;
    }

    setPetMood(moodImage);
    setFollowUp(followUps[mood]?.[Math.floor(Math.random() * followUps[mood].length)] || '');
    setResource(resources[mood]?.[Math.floor(Math.random() * resources[mood].length)] || '');
    setChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
    setUserInput('');
    setTimeout(() => {
      setPetMood(neutral);
    }, 3000);
  };

  // const handleChallengeSubmit = () => {
  //   if (challengeAnswer.trim()) {
  //     setXp(prev => prev + 50);
  //     setChallengeAnswer('');
  //     alert('Challenge completed! You earned 50 XP!');
  //     setPetMood(happy);
  //   } else {
  //     alert('Please enter your challenge answer.');
  //   }
  // };

  return (
    <div className='home-container'>
      <div className='user-info'>
        <div className='user-level'>
          <span className="level-circle">{level}</span>
          <div className='progress-bar'>
            <span style={{ width: `${(xpProgress / xpToNextLevel) * 100}%` }}></span>
          </div>
          <p>XP: {xp} / {level * 100 + 100}</p>
        </div>
        <div className="coins-container">
          <img src={goldCoin} style={{maxWidth: '40px'}}/>
          <p>{coins}</p>
        </div>
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
          <button onClick={gainXp}>Submit Answer</button>
        </div>

        <div className="pet-container">
          <img src={petMood} alt="Pet Mood" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>

        <div className="text-box">
        {user ? <h2>Hi {user.displayName}, Welcome to PawPrintz!</h2> : <h2>Welcome to PawPrintz!</h2>}
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
