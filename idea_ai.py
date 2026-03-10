from groq import Groq

client = Groq(api_key="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")

def generate_ideas(product):

    prompt = f"""
    Generate creative marketing ideas for {product}.
    
    Provide at least 5 ideas.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role":"user","content":prompt}]
    )

    return response.choices[0].message.content