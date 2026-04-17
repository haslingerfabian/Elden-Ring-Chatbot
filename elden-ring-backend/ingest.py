from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma


print("Lade alle PDFs aus Datei")
loader = PyPDFDirectoryLoader("Information")
docs = loader.load()

print(f"Es wurden {len(docs)} Dokumente geladen.")

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=200)
splits = text_splitter.split_documents(docs)

print("Vektor Berechnen")
embeddings = OllamaEmbeddings(model='mxbai-embed-large:latest')

vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings, persist_directory="./chroma_db")

print("Fertig")