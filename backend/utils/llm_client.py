import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL_NAME = "llama-3.1-8b-instant"


def call_llm(prompt: str, temperature: float = 0.6) -> str:
    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=800
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f"LLM Error: {str(e)}"
