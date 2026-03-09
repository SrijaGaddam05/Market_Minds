from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
import pandas as pd
from sklearn.linear_model import LinearRegression

from ai_campaign import generate_campaign
from sentiment import analyze_sentiment
from trends import get_trends
from sales_predictor import predict_sales
from competitor_ai import analyze_competitor


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/upload-sales")
async def upload_sales(file: UploadFile = File(...)):

    df = pd.read_csv(file.file)

    X = df[["month"]]
    y = df["sales"]

    model = LinearRegression()
    model.fit(X,y)

    prediction = model.predict([[12]])

    return {"predicted_sales_month_12": float(prediction[0])}

@app.get("/")
def home():
    return {"message": "MarketMind AI Platform Running"}

@app.get("/campaign")
def campaign(product: str, target: str):
    result = generate_campaign(product, target)
    return {"campaign": result}

@app.get("/sentiment")
def sentiment(text: str):
    result = analyze_sentiment(text)
    return {"sentiment": result}

@app.get("/trends")
def trends(keyword: str):
    result = get_trends(keyword)
    return {"trends": result}

@app.get("/predict")
def predict(month:int):
    result = predict_sales(month)
    return {"prediction":result}

@app.get("/competitor")
def competitor(company:str):

    result = analyze_competitor(company)

    return {"analysis":result}