from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import string

# Local imports
from ai import initAIApp, sendMessage
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

model = initAIApp()

def randomString(stringLength=10):
  letters = string.ascii_lowercase
  return ''.join(random.choice(letters) for i in range(stringLength))

class Req(BaseModel):
    message: str

@app.post("/health-professional")
async def chatHealthProfessional(req: Req):
  chatId = randomString(10)
  outputMessage = await sendMessage(req.message, chatId)

  return {
    "success": True,
    "message": outputMessage,
    "thread_id": chatId
  }

@app.post("/health-professional/{chatId}")
async def chatHealthProfessional(req: Req, chatId: str):
  outputMessage = await sendMessage(req.message, chatId)

  return {
    "success": True,
    "message": outputMessage,
    "thread_id": chatId
  }