import asyncio
import edge_tts
import os

OUTPUT_DIR = r"C:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\public\audio_demos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

ITEMS = [
    {
        "file": "carimbo_vivienne_suave.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "-12%",
        "pitch": "-2Hz",
        "text": "Am... pli... fi... ca... do... ra... Sinta a música. Sua melhor companhia."
    },
    {
        "file": "carimbo_emma_chic.mp3",
        "voice": "en-US-EmmaMultilingualNeural",
        "rate": "-12%",
        "pitch": "-2Hz",
        "text": "Am... pli... fi... ca... do... ra... Ampliando sua onda musical."
    },
    {
        "file": "carimbo_vivienne_onda.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "-14%",
        "pitch": "-3Hz",
        "text": "A música nos acompanha. Amplificadora... sinta cada nota."
    },
    {
        "file": "boletim_vivienne_demo.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "-6%",
        "pitch": "-2Hz",
        "text": "Giro de Notícias Amplificadora. Topo da hora. "
                "Em Brasília, o Congresso aprova incentivos para a transição energética e inovação sustentável. "
                "No mercado financeiro, a semana começa com estabilidade e confiança nos setores de comércio e turismo. "
                "No circuito da música, lendas do jazz e da bossa nova anunciam datas históricas nos palcos brasileiros. "
                "E pelo país, o clima segue ameno e convidativo para uma boa xícara de café. "
                "Giro de Notícias Amplificadora. A música volta a tocar... agora."
    },
    {
        "file": "spot_governo_vivienne.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "-8%",
        "pitch": "-2Hz",
        "text": "No trânsito, a vida vem sempre em primeiro lugar. Reduza a velocidade e cuide de quem caminha com você. "
                "Um trânsito mais humano depende de cada um. Campanha Nacional de Respeito à Vida. Amplificadora... cidadania e som."
    }
]

async def generate():
    for item in ITEMS:
        out_path = os.path.join(OUTPUT_DIR, item["file"])
        print(f"Gerando {item['file']} com {item['voice']}...")
        communicate = edge_tts.Communicate(item["text"], item["voice"], rate=item["rate"], pitch=item["pitch"])
        await communicate.save(out_path)
        print(f"Salvo: {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    asyncio.run(generate())
