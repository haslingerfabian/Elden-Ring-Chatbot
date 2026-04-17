import httpx
from fastapi import FastAPI
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import PromptTemplate
from langchain_ollama import OllamaLLM, OllamaEmbeddings
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# ollama pull mxbai-embed-large
app = FastAPI(title="Elden Ring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embeddings = OllamaEmbeddings(model="mxbai-embed-large:latest")
vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = vectorstore.as_retriever()

llm = OllamaLLM(model="llama3.1:8b")

chat_history = []

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    question = request.message
    print(f"Frage empfangen: {question}")

    gefundene_texte = retriever.invoke(question)
    context = "\n\n".join([text.page_content for text in gefundene_texte])

    verlauf_text = ""
    for chat_message in chat_history[-10:]:
        verlauf_text += f"User: {chat_message['question']}\n"
        verlauf_text += f"Bot: {chat_message['response']}\n"

    prompt_template = PromptTemplate.from_template("""
    Du bist ein Chatbot für das Spiel Elden Ring. Antworte ausschließlich auf Basis der vorliegenden Textauszüge.
    
    Bisheriger Gesprächsverlauf:
    {verlauf}
    
    Kontext aus den Werken:
    {context}
    
    Stil:
    - Schreibe verständlich
    - Nutze nicht nur die Fachbegriffe, sondern erkläre auch danach in einfacher und verständlicher sprache
    
    Frage: {question}
    
    Antworte knapp und präzise. Keine Aufzählungen, keine langen Erklärungen.
    Antwort:""")

    fertiger_prompt = prompt_template.format(
        verlauf=verlauf_text,
        context=context,
        question=question
    )

    response = llm.invoke(fertiger_prompt)

    print("RAW RESPONSE:", repr(response))
    print("TYPE:", type(response))
    print("PROMPT LÄNGE:", len(fertiger_prompt))
    print("KONTEXT LÄNGE:", len(context))

    sources = [
        {
            "datei": doc.metadata.get("source", "Unbekannt").split("\\")[-1].split("/")[-1],
            "seite": doc.metadata.get("page", 0) + 1,
            "auszug": doc.page_content[:100] + "..."
        }
        for doc in gefundene_texte
    ]

    chat_history.append({"question": question, "response": response})

    return {
        "question": question,
        "response": response,
        "sources": sources
    }

@app.post("/reset")
def reset():
    chat_history.clear()
    return {"message": "Chat history reset."}

@app.get("/status")
def status():
    result = {
        "api": "ok",
        "vectorstore": "unknown",
        "ollama_embed": "unknown",
        "ollama_llm": "unknown",
        "chunks_in_db": 0,
    }

    # Vectorstore prüfen
    try:
        count = vectorstore._collection.count()
        result["vectorstore"] = "ok"
        result["chunks_in_db"] = count
    except Exception as e:
        result["vectorstore"] = f"error: {str(e)}"

    # Ollama Verbindung + Modelle prüfen
    try:
        response = httpx.get("http://localhost:11434/api/tags", timeout=3)
        modelle = [m["name"] for m in response.json().get("models", [])]

        result["ollama_embed"] = "ok" if "mxbai-embed-large:latest" in modelle else "model nicht gefunden"
        result["ollama_llm"] = "ok" if "llama3.1:8b" in modelle else "model nicht gefunden"
    except Exception as e:
        result["ollama_embed"] = f"error: {str(e)}"
        result["ollama_llm"] = f"error: {str(e)}"

    return result