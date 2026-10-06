import asyncio
import edge_tts
import os

OUTPUT_DIR = r"C:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\public\audio_demos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

TEXT = "Ampliando sua onda musical, a música nos acompanha."

VARIATIONS = [
    {
        "file": "onda_vivienne_natural.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "-8%",
        "pitch": "-1Hz",
        "label": "Vivienne (Fluida & Suave)"
    },
    {
        "file": "onda_emma_natural.mp3",
        "voice": "en-US-EmmaMultilingualNeural",
        "rate": "-8%",
        "pitch": "-2Hz",
        "label": "Emma (Íntima & Sofisticada)"
    },
    {
        "file": "onda_thalita_br.mp3",
        "voice": "pt-BR-ThalitaMultilingualNeural",
        "rate": "-10%",
        "pitch": "-2Hz",
        "label": "Thalita (Brasileira Nativa Multilingual • Aveludada)"
    },
    {
        "file": "onda_francisca_suave.mp3",
        "voice": "pt-BR-FranciscaNeural",
        "rate": "-12%",
        "pitch": "-2Hz",
        "label": "Francisca (Brasileira Nativa • Cadência Calma)"
    }
]

async def main():
    for item in VARIATIONS:
        out_path = os.path.join(OUTPUT_DIR, item["file"])
        print(f"Gerando {item['file']} ({item['label']})...")
        communicate = edge_tts.Communicate(TEXT, item["voice"], rate=item["rate"], pitch=item["pitch"])
        await communicate.save(out_path)
        print(f"Salvo: {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    asyncio.run(main())
