MarketMind AI – Generative AI Marketing Intelligence Platform
Overview

MarketMind AI is a Generative AI–powered Sales and Marketing Intelligence Platform that helps businesses make smarter marketing decisions using AI-driven insights.

The platform combines AI marketing campaign generation, sentiment analysis, market trend analysis, competitor intelligence, and sales forecasting into a single interactive dashboard.

This project demonstrates how Generative AI and Machine Learning can assist businesses in marketing strategy, decision-making, and predictive analytics.

Key Features
AI Marketing Campaign Generator

Generate complete marketing campaigns using Generative AI.

Input:

Product / Service

Target Audience

Output:

Campaign strategy

Tagline

Marketing channels

Promotional ideas

Customer Sentiment Analyzer

Analyze customer reviews to determine sentiment.

Input:

Customer review text

Output:

Positive / Negative sentiment

Visual sentiment chart

Market Trend Analyzer

Analyze trending topics using market trend data.

Input:

Keyword

Output:

Trend visualization

Market popularity insights

Sales Forecast

Predict product demand based on historical sales data.

Input:

Month number

Output:

Predicted sales value

Forecast chart

Competitor Intelligence

Analyze competitor strategies using AI.

Input:

Competitor name or website

Output:

Strengths

Weaknesses

Marketing strategy

Target audience

Strategic recommendations

Tech Stack
Frontend

HTML

CSS

JavaScript

Chart.js (for visual analytics)

Backend

Python

FastAPI

Uvicorn

AI / Machine Learning

Groq API (LLM)

HuggingFace Transformers

Scikit-learn

Data Analysis

Pandas

PyTrends

Project Structure
MarketMind/
│
├── backend/
│   ├── app.py
│   ├── campaign.py
│   ├── sentiment.py
│   ├── trends.py
│   ├── competitor_ai.py
│   ├── sales_predictor.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── dashboard.js
│
├── data/
│   └── sales_data.csv
│
├── requirements.txt
└── README.md
Installation
Clone the Repository
git clone https://github.com/yourusername/MarketMind-AI.git
cd MarketMind-AI
Install Dependencies
pip install -r requirements.txt

or manually:

pip install fastapi uvicorn pandas scikit-learn transformers groq pytrends python-multipart
Run Backend Server
uvicorn app:app --reload

Backend will start at:

http://127.0.0.1:8000
Run Frontend

Open:

frontend/index.html

or run using Live Server.

API Endpoints
Generate Campaign
GET /campaign

Example:

/campaign?product=sneakers&target=college students
Sentiment Analysis
GET /sentiment

Example:

/sentiment?text=This product is amazing
Market Trends
GET /trends

Example:

/trends?keyword=AI tools
Sales Prediction
GET /predict

Example:

/predict?month=8
Competitor Intelligence
GET /competitor

Example:

/competitor?company=nike
Example Use Case

A marketing team can use MarketMind AI to:

Generate marketing campaigns

Analyze customer feedback sentiment

Track market trends

Predict product demand

Study competitor strategies

This helps businesses make data-driven marketing decisions.

Future Improvements

Possible enhancements include:

Real-time social media data integration

Advanced sales forecasting models

Automated marketing report generation

AI-powered marketing recommendations

User authentication and dashboard analytics
