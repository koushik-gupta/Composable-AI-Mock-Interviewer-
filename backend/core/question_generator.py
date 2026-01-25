from utils.llm_client import call_llm
from config.prompts import (
    QUESTION_GENERATION_PROMPT,
    RESUME_QUESTION_PROMPT,
    PROJECT_INTERVIEW_PROMPT
)


def sanitize_question(text: str) -> str:
    """
    Final safety net to ensure exactly ONE interviewer-style question.
    """
    if not text:
        return "Can you explain a key technical decision you made in this project?"

    lines = [l.strip() for l in text.split("\n") if l.strip()]

    # Prefer first clean question line
    for line in lines:
        if "?" in line and len(line) < 300:
            return line.strip()

    # Fallback
    return lines[0][:300]


def generate_next_question(
    role: str,
    topic: str,
    confidence: int,
    competence_summary: str,
    qa_history: list,
    is_fresher: bool,
    interview_mode: str = "normal",
    project_readme: str = "",
    project_name: str = "",
    resume_text: str = ""
) -> str:

    question_number = len(qa_history) + 1

    # ---------------- PHASE ----------------
    if question_number <= 2:
        phase = "basic warm-up"
    elif question_number <= 4:
        phase = "intermediate"
    else:
        phase = "advanced probing"

    # ---------------- HISTORY ----------------
    history = "No previous questions."
    if qa_history:
        history = ""
        for i, qa in enumerate(qa_history, start=1):
            history += f"Q{i}: {qa['question']}\nA{i}: {qa['answer']}\n\n"

    # ==================================================
    # PROJECT INTERVIEW (TOP PRIORITY)
    # ==================================================
    if interview_mode == "project" and project_readme:
        prompt = PROJECT_INTERVIEW_PROMPT.format(
            project_name=project_name,
            readme=project_readme
        )
        raw = call_llm(prompt)
        return sanitize_question(raw)

    # ==================================================
    # RESUME-BASED QUESTION
    # ==================================================
    if resume_text and question_number in (1, 3):
        prompt = RESUME_QUESTION_PROMPT.format(
            resume_text=resume_text,
            history=history
        )
        raw = call_llm(prompt)
        return sanitize_question(raw)

    # ==================================================
    # NORMAL TOPIC QUESTION
    # ==================================================
    prompt = QUESTION_GENERATION_PROMPT.format(
        role=role,
        topic=topic,
        candidate_type="fresher" if is_fresher else "experienced",
        phase=phase,
        confidence=confidence,
        competence_summary=competence_summary,
        history=history
    )

    raw = call_llm(prompt)
    return sanitize_question(raw)
