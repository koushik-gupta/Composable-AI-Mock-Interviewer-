from datetime import datetime
from utils.llm_client import call_llm
from config.prompts import FINAL_REPORT_PROMPT


def generate_final_report(
    role,
    topic,
    confidence,
    estimated_competence,
    qa_history,
    candidate_name
):
    history = ""
    for i, qa in enumerate(qa_history, 1):
        history += (
            f"Q{i}: {qa['question']}\n"
            f"Candidate Answer:\n{qa['answer']}\n\n"
        )

    prompt = FINAL_REPORT_PROMPT.format(
        candidate_name=candidate_name,
        date=datetime.now().strftime("%d %b %Y"),
        role=role,
        topic=topic,
        confidence=confidence,
        estimated_competence=estimated_competence,
        history=history
    )

    return call_llm(prompt)
