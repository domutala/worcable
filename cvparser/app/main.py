from fastapi import FastAPI, UploadFile, File, HTTPException
from app.services.extractor import CVExtractor
from app.services.nlp_engine import NLPEngine
from app.models.cv import CVParseResponse

app = FastAPI(title="Open Source CV Parser API")

# Instanciation des services (Singleton simple)
extractor = CVExtractor()
nlp = NLPEngine()


@app.get("/")
def read_root():
    return {"status": "Parser is running"}


@app.post("/parse-cv", response_model=CVParseResponse)
async def parse_cv(file: UploadFile = File(...)):
    # Vérification de l'extension
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400, detail="Seuls les fichiers PDF sont acceptés"
        )

    try:
        # 1. Lecture du binaire
        content = await file.read()

        # 2. Extraction du texte brut
        raw_text = extractor.extract_text_from_pdf(content)

        # 3. Analyse NLP
        data = nlp.extract_entities(raw_text)

        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
