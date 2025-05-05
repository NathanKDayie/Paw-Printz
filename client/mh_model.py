import os
import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Define training data
X_train = [
    "I'm feeling sad",
    "I'm so tired and don't want to get up",
    "I feel like nothing matters",
    "I don't want to talk to anyone",
    "I'm okay today",
    "I'm doing fine",
    "I'm feeling good",
    "I had a nice day",
    "I feel anxious",
    "I'm stressed out about work",
    "I can't sleep at night",
    "My chest feels tight",
    "I'm feeling overwhelmed"
]

# Corresponding labels
y_train = [
    "depressed",
    "depressed",
    "depressed",
    "depressed",
    "neutral",
    "neutral",
    "happy",
    "happy",
    "anxious",
    "anxious",
    "anxious",
    "anxious",
    "anxious"
]

# Load or train model
if os.path.exists("mental_health_model.pkl") and os.path.exists("vectorizer.pkl"):
    model = joblib.load("mental_health_model.pkl")
    vectorizer = joblib.load("vectorizer.pkl")
    print("✅ Model loaded from disk.")
else:
    vectorizer = CountVectorizer()
    X_vec = vectorizer.fit_transform(X_train)

    model = MultinomialNB()
    model.fit(X_vec, y_train)

    # Save model and vectorizer
    joblib.dump(model, "mental_health_model.pkl")
    joblib.dump(vectorizer, "vectorizer.pkl")
    print("✅ Model trained and saved.")

# Ask user input
print("\n🧠 Mental Health Bot Ready. Type 'exit' to quit.")
while True:
    user_input = input("How are you feeling today? ")
    if user_input.lower() == "exit":
        print("🫂 Take care. Talk again soon.")
        break

    input_vec = vectorizer.transform([user_input])
    prediction = model.predict(input_vec)[0]

    print(f"🤖 It sounds like you're feeling: **{prediction}**\n")