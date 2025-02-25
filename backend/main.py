import os
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# ✅ Fix: Enable CORS for Frontend Communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace "*" with ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "fraud_detection_model.pkl")

# Check if model file exists
if not os.path.exists(MODEL_PATH):
    raise RuntimeError(f"❌ Model file not found at {MODEL_PATH}!")

try:
    with open(MODEL_PATH, "rb") as model_file:
        model = pickle.load(model_file)
    print("✅ Model loaded successfully!")
except Exception as e:
    raise RuntimeError(f"❌ Error loading model: {e}")

class Transaction(BaseModel):
    age: int
    account_balance: float
    transaction_amount: float
    transaction_type: str
    merchant_category: str
    device_type: str

def preprocess_data(transaction: Transaction):
    mapping = {
        "transaction_type": {"Online Purchase": 0, "ATM Withdrawal": 1, "Bank Transfer": 2},
        "merchant_category": {"Electronics": 0, "Groceries": 1, "Restaurants": 2},
        "device_type": {"Mobile": 0, "Laptop": 1, "ATM": 2}
    }

    return np.array([
        transaction.age,
        transaction.account_balance,
        transaction.transaction_amount,
        mapping["transaction_type"].get(transaction.transaction_type, -1),
        mapping["merchant_category"].get(transaction.merchant_category, -1),
        mapping["device_type"].get(transaction.device_type, -1)
    ]).reshape(1, -1)

@app.post("/predict_fraud")
async def predict_fraud(transaction: Transaction):
    try:
        input_data = preprocess_data(transaction)
        prediction = model.predict(input_data)[0]  # Ensure model exists
        alert_message = ["✅ No suspicious activity detected."] if prediction == 0 else [
            f"⚠ Fraud Alert: Suspicious transaction of Rs. {transaction.transaction_amount}/- in '{transaction.merchant_category}'.",
            "⚠ Review your transactions!"
        ]
        return {"alerts": alert_message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@app.get("/")
async def home():
    return {"message": "🚀 Fraud Detection API is running!"}
