import spacy
from spacy.matcher import Matcher
from spacy.pipeline import EntityRuler
from app.services.normalizer import SkillNormalizer
import re


class NLPEngine:
    def __init__(self):
        self.nlp = spacy.load("fr_core_news_sm")

        # self.matcher = Matcher(self.nlp.vocab)
        self.normalizer = SkillNormalizer()

        # On ajoute le 'entity_ruler' pour les compétences
        if "entity_ruler" not in self.nlp.pipe_names:
            ruler = self.nlp.add_pipe("entity_ruler", before="ner")
            self._load_skills_patterns(ruler)

    def _load_skills_patterns(self, ruler):
        # On définit des patterns pour détecter les technos
        # "LOWER" permet de matcher "python", "Python" ou "PYTHON"
        patterns = [
            {"label": "SKILL", "pattern": [{"LOWER": "vue"}, {"LOWER": "js"}]},
            {"label": "SKILL", "pattern": [{"LOWER": "vue.js"}]},
            {"label": "SKILL", "pattern": [{"LOWER": "nuxt"}]},
            {"label": "SKILL", "pattern": [{"LOWER": "nest"}, {"LOWER": "js"}]},
            {"label": "SKILL", "pattern": [{"LOWER": "python"}]},
            {"label": "SKILL", "pattern": [{"LOWER": "typescript"}]},
            {"label": "SKILL", "pattern": [{"LOWER": "postgresql"}]},
            {"label": "SKILL", "pattern": [{"LOWER": "docker"}]},
        ]
        ruler.add_patterns(patterns)

    def extract_entities(self, text: str):
        doc = self.nlp(text)
        results = {
            "name": None,
            "phone": self._extract_phone(text),
            "email": self._extract_email(text),
            "skills": set(),  # Utilisation d'un set pour éviter les doublons
        }

        # 1. Extraction par entités (NER + Ruler)
        for ent in doc.ents:
            if ent.label_ == "PER" and not results["name"]:
                results["name"] = ent.text
            elif ent.label_ == "SKILL":
                results["skills"].add(ent.text)

        # 2. Fallback pour le Nom (Heuristique)
        # Si le NER échoue, on prend souvent les premiers mots du CV
        # (souvent le nom est en haut)
        if not results["name"]:
            first_words = text.split()[:3]
            results["name"] = " ".join(first_words)

        results["skills"] = list(results["skills"])
        return results

    def _extract_email(self, text: str):
        email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        match = re.search(email_pattern, text)
        return match.group(0) if match else None

    def _extract_phone(self, text: str):
        # Cette regex cherche :
        # 1. Un début optionnel avec + ou 00 (indicatif international)
        # 2. Une suite de 10 à 15 chiffres
        # 3. Autorise les séparateurs communs : espace, point, tiret, parenthèses
        phone_pattern = (
            r"((?:\+|00)[1-9]\d{1,3}[\s.-]*)?(?:\(\d{1,4}\)[\s.-]*)?[\d\s.-]{7,15}"
        )

        matches = re.finditer(phone_pattern, text)

        for match in matches:
            phone = match.group(0).strip()
            # Validation post-extraction :
            # Un numéro de téléphone doit contenir au moins 8 chiffres pour être crédible
            digits_only = "".join(filter(str.isdigit, phone))
            if 8 <= len(digits_only) <= 15:
                return phone

        return None
