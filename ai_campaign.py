from groq import Groq

client = Groq(
    api_key="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"
)

def generate_campaign(product, target):

    prompt = f"""
    Create a marketing campaign for {product}.
    Target audience: {target}.
    Include:
    - Tagline
    - Social media campaign idea
    - Hashtags
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content