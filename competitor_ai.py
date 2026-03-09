from groq import Groq

client = Groq(api_key="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")

def analyze_competitor(company):

    prompt = f"""
    Analyze the competitor {company}.

    Provide:
    1. Strengths
    2. Weaknesses
    3. Marketing strategy
    4. Target audience
    5. Suggestions to compete
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role":"user","content":prompt}]
    )

    return response.choices[0].message.content