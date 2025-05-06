// client/src/api/offlineBot.js

const moodCategories = {
    happy: ['happy', 'joyful', 'excited', 'great', 'amazing', 'awesome', 'grateful', 'motivated'],
    content: ['fine', 'okay', 'alright', 'good', 'neutral', 'chill'],
    uncertain: ['meh', 'not sure', 'mixed', 'confused', 'okay-ish'],
    stressed: ['stressed', 'overwhelmed', 'busy', 'tired', 'exhausted', 'burned out'],
    sad: ['sad', 'depressed', 'down', 'lonely', 'anxious', 'worried', 'bad', 'miserable'],
  };
  
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', "can't go on", 'want to die',
    'hurt myself', 'cut myself', 'hopeless', 'nothing matters'
  ];
  
  const successKeywords = [
    'i did it', 'i finished', 'i completed', 'i managed to', 'i got it done', "it's done", 'i made it', 'i turned it in'
  ];
  
  // Store possible follow-up stages
  const followUps = {
    happy: [
      {
        question: "What's something you're looking forward to today?",
        nextStep: "future_positive"
      }
    ],
    content: [
      {
        question: "Is there a goal or task you're planning to tackle today?",
        nextStep: "future_goal"
      }
    ],
    uncertain: [
      {
        question: "Would reflecting on what's bugging you help? Or would distraction be better?",
        nextStep: "coping_style"
      }
    ],
    stressed: [
      {
        question: "What's one thing you can pause or simplify right now?",
        nextStep: "stress_relief"
      }
    ],
    sad: [
      {
        question: "Would it help to talk to someone today — even a friend?",
        nextStep: "support_network"
      }
    ],
    future_positive: [
      {
        question: "That sounds awesome! What's one step you can take to make that happen today?",
        nextStep: "encouragement"
      }
    ],
    future_goal: [
      {
        question: "You've got this 💪 What's your first step toward that goal?",
        nextStep: "encouragement"
      }
    ],
    encouragement: [
      {
        question: "Even small steps count. Want to try it and check back in later?",
        nextStep: null
      }
    ],
    coping_style: [
      {
        question: "If distraction sounds good, maybe music, a walk, or a favorite show could help?",
        nextStep: null
      }
    ],
    stress_relief: [
      {
        question: "Breathing, journaling, or just a 5-minute break can reset your day.",
        nextStep: null
      }
    ],
    support_network: [
      {
        question: "If it feels too heavy, UMBC's Counseling Center is just a call away: 410-455-2472 💛",
        nextStep: null,
        resource: {
          title: "UMBC Counseling Center",
          url: "https://health.umbc.edu/counseling"
        }
      }
    ]
  };
  
  export async function getAIResponse(userInput, state = null) {
    const input = userInput.toLowerCase();
  
    if (crisisKeywords.some(keyword => input.includes(keyword))) {
      return formatResponse({
        text: "I'm really concerned about how you're feeling. You're not alone — help is available 💛",
        followUp: "Please consider calling 410-455-2472 or visiting UMBC Counseling.",
        nextStep: null,
        resource: {
          title: "UMBC Counseling Center",
          url: "https://health.umbc.edu/counseling"
        }
      });
    }
    // 2. SUCCESS CHECK
    if (successKeywords.some(phrase => input.includes(phrase))) {
        return formatResponse({
        text: "👏 That's amazing! You should be proud of yourself.",
        followUp: "What helped you push through and get it done?",
        nextStep: null
        });
    }
    // Stage 1: Mood detection
    if (!state) {
      const mood = detectMood(input);
      const baseText = moodResponses[mood];
      const followUp = pickRandom(followUps[mood]);
      return formatResponse({
        text: baseText,
        followUp: followUp.question,
        nextStep: followUp.nextStep,
        resource: followUp.resource || null
      });
    }
  
    // Stage 2+: Follow-up response handling
    const branch = followUps[state];
    if (branch) {
      const next = pickRandom(branch);
      return formatResponse({
        text: "Thanks for sharing that. 💬",
        followUp: next.question,
        nextStep: next.nextStep,
        resource: next.resource || null
      });
    }
  
    return formatResponse({
      text: "I'm really glad you're opening up. Keep taking it one moment at a time 💛",
      followUp: null,
      nextStep: null
    });
  }
  
  const moodResponses = {
    happy: "That's amazing to hear! 😊 I'm glad you're feeling good.",
    content: "Glad to hear you're steady today. It's okay to have calm days!",
    uncertain: "Uncertainty is okay — it means you're thinking deeply.",
    stressed: "Sounds like you've got a lot going on. Let's slow it down.",
    sad: "I'm really sorry you're feeling this way. You're not alone 💛"
  };
  
  function detectMood(input) {
    const words = input.split(/\s+/);
    for (const [category, keywords] of Object.entries(moodCategories)) {
      if (words.some(word => keywords.includes(word))) return category;
    }
    return 'uncertain';
  }
  
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  function formatResponse({ text, followUp, nextStep, resource }) {
    return {
      text,
      followUp,
      nextStep,
      resource: resource || null
    };
  }
  