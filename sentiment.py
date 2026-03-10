from dotenv import load_dotenv
import os
from groq import Groq
from transformers import pipeline

# load environment variables
load_dotenv()

# Groq client
client = Groq(api_key=os.getenv("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"))

# sentiment model
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

def analyze_customer_feedback(text):

    # sentiment prediction
    results = sentiment_pipeline(text)

    positive = 0
    negative = 0

    for r in results:
        if r["label"] == "POSITIVE":
            positive += 1
        else:
            negative += 1

    prompt = f"""
Analyze this customer feedback and provide insights.

Feedback:
{text}

Provide:
• Key customer opinions
• Problems customers mention
• Marketing recommendation
"""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}]
    )

    insights = response.choices[0].message.content

    return {
        "positive": positive,
        "negative": negative,
        "insights": insights
    }
