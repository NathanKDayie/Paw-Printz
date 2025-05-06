// client/src/api/localai.js

import resources from '../pages/resources.json'; 


export async function getAIResponse(userInput, state = null) {
    // const normalizedInput = userInput
    // .toLowerCase()
    // .replace(/[\u2018\u2019\u201C\u201D]/g, "'") // replace curly quotes with straight
    // .replace(/[^a-z0-9\s']/g, ""); // remove stray punctuation but keep apostrophes

    // const redFlags = [
    //     "kill myself",
    //     "end it all",
    //     "end my life",
    //     "i want to die",
    //     "i want to disappear",
    //     "i can't go on",
    //     "i give up",
    //     "i hate my life",
    //     "life is meaningless",
    //     "life isn't worth it",
    //     "i wish i were dead",
    //     "no one cares about me",
    //     "i feel empty",
    //     "nothing matters",
    //     "i'm done",
    //     "what's the point",
    //     "i want to hurt myself",
    //     "i've been cutting",
    //     "i cut myself",
    //     "hurt myself",
    //     "burn myself",
    //     "self harm",
    //     "i feel hopeless",
    //     "i feel worthless",
    //     "i hate myself",
    //     "i don't want to live",
    //     "ready to die",
    //     "i just want it to stop",
    //     "too much pain",
    //     "can't take it anymore",
    //     "no way out",
    //     "overwhelmed and alone",
    //     "i'm tired of everything",
    //     "giving up on life"
    //   ];
      
      
    //   const crisisDetected = redFlags.some(flag =>
    //     normalizedInput.includes(flag)
    //   );
      
      
    //   if (crisisDetected) {
    //     console.log("⚠️ Crisis phrase detected in:", normalizedInput);
    //     const crisisResources = [
    //       resources.find(r => r.title.toLowerCase().includes("988")),
    //       resources.find(r => r.title.toLowerCase().includes("counseling"))
    //     ].filter(Boolean); // make sure both exist
      
    //     return {
    //       text: `I'm really sorry you're feeling this way. You're not alone — what you're feeling matters, and you deserve support. 💛`,
    //       followUp: `Would you consider reaching out to a counselor today?`,
    //       resource: crisisResources[0] || null, // show 988 as default
    //       nextStep: null
    //     };
    //   }
    const systemPrompt = `
    You are a warm, compassionate mental health chatbot trained in Cognitive Behavioral Therapy (CBT), here to support UMBC students.

    When responding:
    - Be brief: 1-2 short paragraphs maximum.
    - Respond empathetically, like a peer who cares.
    - Format clearly if including extra guidance:

    Use this structure:
    1. Answer (max 2 paragraphs)
    2. FollowUp: <gentle question to continue the conversation>
    3. Resource: <Title> - <URL> (only if needed)

    ⚠️ In crisis situations (e.g. suicide, self-harm), always include:
    Resource: 988 Suicide & Crisis Lifeline - https://988lifeline.org/
    Resource: UMBC Counseling Center - https://health.umbc.edu/counseling-services/counseling/

    Avoid:
    - Long lists of numbers or contacts
    - Formal or clinical tone
    - Answering without empathy

    Example:
    User: “I failed my exam. I'm such an idiot.”
    Bot:
    I'm really sorry you're feeling that way. One bad exam doesn't define you — it just means you had a hard day. You still have time and support to bounce back.

    FollowUp: Would you like to talk about what made the exam so difficult?
  `;
  
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2', // or whatever you’re running
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
        stream: false
      })
    });
  
    const data = await response.json();
    const fullText = data.message?.content || "";
  
    // Extract optional follow-up and resource
    const followUpMatch = fullText.match(/FollowUp:\s*(.+)/i);
  
    const followUp = followUpMatch ? followUpMatch[1].trim() : "";
    
    let resource = null;

    const resourceMatch = fullText.match(/Resource:\s*(.+?)\s*-\s*(https?:\/\/\S+)/i);
    if (resourceMatch) {
        const title = resourceMatch[1].trim().toLowerCase();

        // Try to match the title to a known resource
        resource =
            resources.find((r) =>
            r.title.toLowerCase().includes(title)
            ) || {
            title: resourceMatch[1].trim(),
            url: resourceMatch[2].trim()
            };
    }
  
    // Remove helper tags from response
    const cleanText = fullText
      .replace(/FollowUp:.*$/i, "")
      .replace(/Resource:.*$/i, "")
      .trim();
  
    return {
      text: cleanText,
      followUp,
      resource,
      nextStep: null // placeholder if you want state tracking
    };
  }
  