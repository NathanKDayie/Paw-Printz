from client.flaskapp import Flask, request, jsonify
import openai
from textblob import TextBlob

# Set up OpenAI API key
openai.api_key = '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'

app = Flask(__name__)

# Route to handle user input and get the response
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    user_input = data['input']  # Input from the frontend

    # Call GPT-3 API to generate a response (can be expanded to contextualize responses)
    prompt = f"User says: '{user_input}'. Ask follow-up questions, connect feelings to thoughts, and offer resources."
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150
    )
    prediction = response.choices[0].text.strip()

    # Sentiment analysis to detect if the user is positive or negative
    sentiment = analyze_sentiment(user_input)

    return jsonify({'prediction': prediction, 'sentiment': sentiment})

def analyze_sentiment(text):
    # Basic sentiment analysis using TextBlob
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity  # Ranges from -1 (negative) to 1 (positive)
    if sentiment > 0:
        return 'positive'
    elif sentiment < 0:
        return 'negative'
    else:
        return 'neutral'

if __name__ == '__main__':
    app.run(debug=True)