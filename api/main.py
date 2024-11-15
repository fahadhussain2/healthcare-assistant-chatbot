from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import START, MessagesState, StateGraph
from langchain_openai import ChatOpenAI
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
import random
import string

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def initAIApp():
  model = ChatOpenAI(model="gpt-4o-mini")

  prompt = ChatPromptTemplate.from_messages(
      [
          (
              "system",
              "Act like a healthcare that provides preliminary diagnosis for patients. You can ask questions to gather information and provide a diagnosis based on the information you have. Start with a greeting.",
          ),
          MessagesPlaceholder(variable_name="messages"),
      ]
  )

  # Define a new graph
  workflow = StateGraph(state_schema=MessagesState)


  # Define the function that calls the model
  def call_model(state: MessagesState):
      chain = prompt | model
      response = chain.invoke(state)
      return {"messages": response}


  # Define the (single) node in the graph
  workflow.add_edge(START, "model")
  workflow.add_node("model", call_model)

  # Add memory
  memory = MemorySaver()
  app = workflow.compile(checkpointer=memory)
  print("AI App initialized")
  return app

model = initAIApp()

def randomString(stringLength=10):
  letters = string.ascii_lowercase
  return ''.join(random.choice(letters) for i in range(stringLength))

class Item(BaseModel):
    message: str

@app.post("/health-professional")
async def chatHealthProfessional(item: Item):
  config = {"configurable": {
    "thread_id": randomString(10)
    }}
  message = item.message
  input_messages = [HumanMessage(message)]
  output = model.invoke({"messages": input_messages}, config)
  
  print("output", output)
  
  outputMessage = output["messages"][-1].content

  print(outputMessage)

  return {
    "success": True,
    "message": outputMessage,
    "thread_id": config["configurable"]["thread_id"]
  }

@app.post("/health-professional/{chat_id}")
async def chatHealthProfessional(item: Item, chat_id: str):
  config = {"configurable": {
    "thread_id": chat_id
    }}
  message = item.message
  input_messages = [HumanMessage(message)]
  output = model.invoke({"messages": input_messages}, config)

  outputMessage = output["messages"][-1].content

  print(outputMessage)

  return {
    "success": True,
    "message": outputMessage,
    "thread_id": config["configurable"]["thread_id"]
  }