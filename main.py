import random
from datetime import datetime

happy_keywords = {
    "happy": [
        "happy", "joyful", "excited", "content", "glad", "cheerful",
        "thrilled", "delighted", "ecstatic", "elated", "satisfied", "grateful",
        "hopeful", "optimistic", "overjoyed", "great", "good", "nice",
        "awesome"
    ],
    "neutral":
    ["okay", "fine", "alright", "meh", "so-so", "neutral", "cool", "ok"],
    "sad": [
        "sad", "upset", "down", "depressed", "unhappy", "miserable", "gloomy",
        "heartbroken", "not feeling well", "not feeling good", "bad",
        "terrible"
    ]
}

responses = {
    "happy": [
        "That's wonderful! 😊 I'm so happy to hear you're feeling good!",
        "Your positive energy is contagious! 🌟 Keep spreading that joy!",
        "Amazing! 🎉 I hope your day continues to be fantastic!"
    ],
    "neutral": [
        "That's okay! Everyone has those neutral days. 😊",
        "Sometimes a neutral day is just what we need. 🌥️",
        "Taking things easy is perfectly fine! 💫"
    ],
    "sad": [
        "I'm here for you during this tough time. ",
        "Things will get better soon. Would you like to talk more about it? ",
        "Remember that it's okay to not be okay sometimes. Want to share what's bothering you? "
    ]
}

resources = {
    "happy": ["Keep up the positive vibes! 😊"],
    "neutral": [
        "Here's a funny video to improve your mood: https://www.youtube.com/watch?v=orK3Ug_DHOM",
        "Try reading your favorite book. 📚",
        "Check out this playlist of random upbeat songs: https://open.spotify.com/playlist/3eDRY2lvw7zXJg5YqOJoSN",
    ],
    "sad": [
        "Here's a video of baby animals to lift your spirits: https://www.youtube.com/watch?v=kj1-rR3udNs",
        "Give RIH a call at 410-455-2542 and seek counseling service if you need it!",
        "Check out this website that could help you deal with negative emotions: https://www.betterhealth.vic.gov.au/health/healthyliving/its-okay-to-feel-sad",
    ]
}

follow_up_questions = {
    "happy": [
        "What's the best thing that happened today?",
        "Would you like to share what made you so happy?",
        "That's great! How do you plan to keep this positive energy going?"
    ],
    "neutral": [
        "Is there something that could make your day better?",
        "Would you like to talk about anything in particular?",
        "Sometimes taking a short break helps. What do you think?"
    ],
    "sad": [
        "Would you like to talk about what's bothering you?",
        "Is there something I can do to help you feel better?",
        "Have you tried doing something you enjoy today?"
    ]
}

conversation_history = []


def save_interaction(pet_name, mood, response):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conversation_history.append({
        "timestamp": timestamp,
        "mood": mood,
        "response": response
    })


ui_pet_name = input("What is your pet's name? ")
print(f"\nNice to meet you! I'm {ui_pet_name}, your mood companion! 🐾\n")
while True:
    ui_mood = input(
        f"\nHow are you feeling today? Tell {ui_pet_name} what's on your mind (or type 'exit' to end): "
    )

    if ui_mood.lower() == 'exit':
        print(
            f"\nTake care! {ui_pet_name} will be here when you need to talk again! 👋"
        )
        break

    words = set(ui_mood.lower().split())
    mood_detected = False

    for mood, keywords in happy_keywords.items():
        if words.intersection(keywords):
            response = random.choice(responses[mood])
            video_response = random.choice(resources[mood])
            follow_up = random.choice(follow_up_questions[mood])
            print(f"\n{response}")
            print(f"\n{follow_up}")
            print(f"\n{video_response}")
            save_interaction(ui_pet_name, mood, ui_mood)
            mood_detected = True
            break

    if not mood_detected:
        print(
            "\nI'm not quite sure how to interpret that, but I'm here to listen! 💭"
        )
