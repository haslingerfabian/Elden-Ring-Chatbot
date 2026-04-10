from fastapi import FastAPI
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import PromptTemplate
from langchain_ollama import OllamaLLM, OllamaEmbeddings
from pydantic import BaseModel

app = FastAPI(title='Elden Ring Basic API')

embeddings = OllamaEmbeddings(model='mxbai-embed-large:latest')
vectorstore = Chroma(persistent_directory='./chroma_db', embedding_function=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 6})

llm = OllamaLLM(model='qwen3.5:4b')

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    question = request.message
    print(f'Frage empfangen: {question}')
    
    gefundene_texte = retriever.invoke(question)
    kontext = "\n\n".join([text.page_content for text in gefundene_texte])

    # Der Prompt
    prompt_template = PromptTemplate.from_template( """Elden Ring ist Game-Of-The-Year 2022. Du bist der Chatbot dafür...
    
    Kontext: {kontext}

    Frage: {question}

    Antwort:
    """)

    fertiger_prompt = prompt_template.format(kontext=kontext, question=question)

    response = llm.invoke(fertiger_prompt)
    return {
        "question": question,
        "response": response
    }