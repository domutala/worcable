# Environnement

```shell
pip install uv
uv venv
source .venv/bin/activate
```

## Dépendances
installer les dépendances Sans `sentence-transformers` pour économiser les données

```shell
uv pip install fastapi uvicorn python-multipart pdfminer.six spacy pydantic
python -m spacy download fr_core_news_sm  # Version 'sm' au lieu de 'md' pour tester (12Mo)
```


## vérifier 
```shell
python -c "import spacy; nlp = spacy.load('fr_core_news_sm'); print('Succes : Modele charge')"
```

## démarer le server
```shell
uvicorn app.main:app --reload
```

FastAPI
pdfminer
spaCy 3
sentence-transformers

je choisie d'utiliser:
 FastAPI
pdfminer
spaCy 3
sentence-transformers

explique moi le role de chacun de ces outils de façon claire simple et le moins court possible. L'objectif est moi je puisse l'expliquer à d'autre personne sans la moindre difficulté. Puis tu m'écris un prompre claire est exaustif du début jusqu'à la fin pour qu'un IA me guide pas à pas à développer cette outils. Je suis un développeur Node.js mais j'ai de solide notion Python, je l'ai pratiqué des années avant d'adopter javascript. Il faut aussi en compte que cela fait bien de années que je ne l'ai pas utilisé. J'ai perdu quelques notions

