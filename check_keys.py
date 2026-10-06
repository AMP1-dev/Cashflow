import os

keys = [k for k in os.environ if any(w in k.upper() for w in ['ELEVEN', 'TTS', 'API', 'VOICE', 'OPENAI', 'AZURE'])]
print("Found keys in env:", keys)
