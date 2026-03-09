import pandas as pd
from sklearn.linear_model import LinearRegression

# sample dataset
data = {
    "month":[1,2,3,4,5,6],
    "sales":[200,220,250,270,300,330]
}

df = pd.DataFrame(data)

X = df[["month"]]
y = df["sales"]

model = LinearRegression()
model.fit(X,y)

def predict_sales(month):

    prediction = model.predict([[month]])

    return float(prediction[0])