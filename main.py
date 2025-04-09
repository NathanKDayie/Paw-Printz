import random
from datetime import datetime, timedelta
import os

points = 0
counter = 0

start_time_file = "start_time.txt"


def detect_mood(user_input):
    if user_input.lower().startswith("not"):
        return "sad"
    happy_keywords = {
        "happy": [
            "happy",
            "joyful",
            "excited",
            "content",
            "glad",
            "cheerful",
            "thrilled",
            "delighted",
            "ecstatic",
            "elated",
            "satisfied",
            "grateful",
            "hopeful",
            "optimistic",
            "overjoyed",
            "great",
            "good",
            "nice",
            "awesome",
            "fantastic",
            "wonderful",
            "amazing",
            "fabulous",
            "incredible",
            "superb",
            "excellent",
            "positive",
            "uplifting",
            "energetic",
            "enthusiastic",
            "motivated",
            "inspired",
            "playful",
            "fun",
            "jovial",
            "lighthearted",
            "bubbly",
            "radiant",
            "sparkling",
            "sunny",
            "bright",
            "cheery",
            "smiling",
            "laughing",
            "joking",
            "silly",
            "playful",
        ],
        "neutral":
        ["okay", "fine", "alright", "meh", "so-so", "neutral", "cool", "ok"],
        "sad": [
            "sad",
            "upset",
            "down",
            "depressed",
            "unhappy",
            "miserable",
            "gloomy",
            "heartbroken",
            "not feeling well",
            "bad",
            "terrible",
            "awful",
            "angry",
            "frustrated",
            "disappointed",
            "stressed",
            "anxious",
            "worried",
            "nervous",
            "fearful",
            "hopeless",
            "lonely",
            "isolated",
            "lost",
            "confused",
            "helpless",
            "overwhelmed",
            "exhausted",
            "fatigued",
            "drained",
            "weary",
        ]
    }

    words = set(user_input.lower().split())
    for mood, keywords in happy_keywords.items():
        if words.intersection(keywords):
            return mood
    return None


def get_response(mood):
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

    response = random.choice(responses[mood])
    resource = random.choice(resources[mood])
    follow_up = random.choice(follow_up_questions[mood])
    return response, follow_up, resource


def chatbot():
    global points
    global counter
    conversation_history = []
    pet_name = input("What is your pet's name? ")
    print(f"\nNice to meet you! I'm {pet_name}, your mood companion! 🐾\n")
    print(
        "\nType 'challenges' to get a challenge, 'check points' to see your points, and 'complete' to claim your reward!\n"
    )

    while True:
        user_input = input(
            f"\nHow are you feeling today? Tell {pet_name} what's on your mind (or type 'exit' to end): "
        )
        if user_input.lower() == 'exit':
            print(
                f"\nTake care! {pet_name} will be here when you need to talk again! 👋"
            )
            break
        if user_input.lower() == 'complete':
            print(
                f"\nGreat job completing the challenge! {pet_name} is proud of you! 🎉"
            )
            points += 100
            continue
        if user_input.lower() == 'check points':
            print(f"\nYou have {points} points! Keep up the good work! 🌟")
            continue
        if user_input.lower() == 'challenges':
            get_challenge()
            continue
        # Check if the start time file exists
        if os.path.exists(start_time_file):
            with open(start_time_file, "r") as file:
                start_time_str = file.read().strip()
                start_time = datetime.strptime(start_time_str,
                                               "%Y-%m-%d %H:%M:%S")
                # Check if 24 hours have passed
                if datetime.now() - start_time >= timedelta(hours=24):
                    points += 50
                    print(
                        f"\nYou have earned 50 points for logging in today! You now have {points} points! 🌟"
                    )

                    # Update the start time to the current time
                    with open(start_time_file, "w") as file:
                        file.write(
                            datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

        else:
            # Create the start time file with the current time
            with open(start_time_file, "w") as file:
                file.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

        mood = detect_mood(user_input)
        if mood:
            response, follow_up, resource = get_response(mood)
            print(f"\n{response}\n{follow_up}\n{resource}")

            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            conversation_history.append({
                "timestamp": timestamp,
                "mood": mood,
                "response": user_input
            })
        else:
            print(
                "\nI'm not quite sure how to interpret that, but I'm here to listen! 💭"
            )
        if points % 1000 == 0 and points != 0:
            print(f"\nCongratulations! You have recieved {points} points and have reached level {points / 1000} .")


def challenges():
    challenges = [
        "How do you think technology can help improve mental health?",
        "What are some ways to promote emotional well-being in our communities?",
        "How can we better support each other during tough times?"
    ]
    return random.choice(challenges)


def get_challenge():
    challenge = challenges()
    print(f"\nHere's a challenge for you: {challenge}")
    response = input("\nWould you like to accept this challenge? (yes/no) ")
    if response.lower() == 'yes':
        print("Great! Let's work on this together! Type your anser below:")
        answer = input()
        print(f"Your answer: {answer}")
        print(
            "\nThat's a thoughtful response! 😊 Type complete to claim your reward!"
        )
    else:
        print("No worries! You can always come back to it later. 😊")


def get_points():
    return points


if __name__ == "__main__":
    chatbot()

