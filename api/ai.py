from langgraph.checkpoint.memory import MemorySaver
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import START, MessagesState, StateGraph
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

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

async def sendMessage(message:str, chatId: str):
  config = {"configurable": {
    "thread_id": chatId
    }}
  input_messages = [HumanMessage(message)]
  output = model.invoke({"messages": input_messages}, config)
  
  print("output", output)
  
  outputMessage = output["messages"][-1].content

  print(outputMessage)
  
  return outputMessage