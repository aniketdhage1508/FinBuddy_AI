import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn

# Load API key
load_dotenv()
# API_KEY = os.getenv("GEMINI_API_KEY")
API_KEY="AIzaSyBB_cSEI3KBdEgu0y8qQMkeyr0bo-1Qi3Y"

if not API_KEY:
    raise RuntimeError("❌ Gemini API key not found! Please add it to your .env file.")

# Configure Gemini API
genai.configure(api_key=API_KEY)

# FastAPI app setup
app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# System Prompt
SYSTEM_PROMPT = """You are an AI financial assistant. Provide expert yet **concise** financial advice on investments, banking, loans, and market trends. Keep responses **natural and to the point** without unnecessary details."""

# Request model
class Query(BaseModel):
    question: str

@app.post("/chat")
async def chat(query: Query):
    """Handles user queries and returns Gemini's response."""
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(SYSTEM_PROMPT + "\nUser: " + query.question)
        return {"response": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@app.get("/")
async def home():
    return {"message": "🚀 Financial Chatbot API is running!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)