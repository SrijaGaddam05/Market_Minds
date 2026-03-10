from groq import Groq

client = Groq(api_key="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")

def marketing_strategy(product, audience):

    prompt = f"""
    Create a marketing strategy for {product}
    targeting {audience}.
    
    Include:
    - Target audience analysis
    - Marketing channels
    - Campaign strategy
    - Tagline
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role":"user","content":prompt}]
    )

    return response.choices[0].message.content