from sentence_transformers import SentenceTransformer, util
import torch


class SkillNormalizer:
    def __init__(self):
        # Modèle multilingue léger (~420 Mo) performant pour le Français et l'Anglais
        # Il sera téléchargé au premier lancement
        self.model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

        # Ton référentiel "propre" (ex: pour ta base de données)
        self.official_skills = [
            "Vue.js",
            "React",
            "Node.js",
            "Python",
            "TypeScript",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "Java",
            "AWS",
            "NoSQL",
            "DevOps",
        ]
        # On pré-calcule les vecteurs du référentiel pour gagner du temps
        self.official_embeddings = self.model.encode(
            self.official_skills, convert_to_tensor=True
        )

    def normalize_skill(self, raw_skill: str, threshold: float = 0.7):
        """
        Trouve la compétence officielle la plus proche d'une chaîne brute.
        """
        # 1. Encoder la compétence extraite du CV
        query_embedding = self.model.encode(raw_skill, convert_to_tensor=True)

        # 2. Calculer la similarité cosinus avec tout le référentiel
        cosine_scores = util.cos_sim(query_embedding, self.official_embeddings)[0]

        # 3. Trouver le meilleur score
        best_score_idx = torch.argmax(cosine_scores).item()
        best_score = cosine_scores[best_score_idx].item()

        if best_score >= threshold:
            return self.official_skills[best_score_idx]

        return raw_skill  # Si pas assez proche, on garde le texte original
