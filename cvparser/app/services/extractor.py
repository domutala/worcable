from io import BytesIO
from pdfminer.high_level import extract_text


class CVExtractor:
    @staticmethod
    def extract_text_from_pdf(pdf_content: bytes) -> str:
        """
        Convertit le contenu binaire d'un PDF en texte brut.
        """
        try:
            # On utilise BytesIO pour traiter le fichier en mémoire sans l'écrire sur le disque
            fp = BytesIO(pdf_content)
            text = extract_text(fp)

            # Nettoyage de base : suppression des espaces multiples et normalisation
            return " ".join(text.split())
        except Exception as e:
            raise ValueError(f"Erreur lors de l'extraction PDF: {str(e)}")
