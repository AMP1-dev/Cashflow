import asyncio
import edge_tts
import os

OUTPUT_DIR = r"C:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\public\audio_demos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

ITEMS = [
    {
        "file": "carimbo_suave.mp3",
        "voice": "pt-BR-FranciscaNeural",
        "rate": "-4%",
        "pitch": "-2Hz",
        "text": "Amplificadora... Mais música, menos conversa. A sua melhor companhia."
    },
    {
        "file": "carimbo_explosiva.mp3",
        "voice": "pt-BR-AntonioNeural",
        "rate": "+10%",
        "pitch": "+3Hz",
        "text": "AMPLIFICADORA! A sua rádio, a sua vibe, no ar 24 horas!"
    },
    {
        "file": "carimbo_festiva.mp3",
        "voice": "pt-BR-ThalitaNeural",
        "rate": "+8%",
        "pitch": "+4Hz",
        "text": "Am-pli-fi-ca-do-ra! Conectada no seu ritmo. Sente a pressão!"
    },
    {
        "file": "carimbo_aovivo.mp3",
        "voice": "pt-BR-AntonioNeural",
        "rate": "+0%",
        "pitch": "-4Hz",
        "text": "Amplificadora FM. Ao vivo dos nossos estúdios para todo o Brasil. Você está ouvindo o que há de melhor."
    },
    {
        "file": "boletim_noticias_demo.mp3",
        "voice": "pt-BR-AntonioNeural",
        "rate": "+4%",
        "pitch": "-1Hz",
        "text": "Giro de Notícias Amplificadora. Topo da hora. "
                "Em Brasília, o Congresso avança na votação das novas diretrizes para o setor produtivo e incentivo à inovação sustentável. "
                "Na economia, o mercado financeiro opera em estabilidade com expectativa positiva para o comércio e serviços neste trimestre. "
                "No mundo da música, os maiores festivais internacionais anunciam novas datas e novidades exclusivas para a temporada de shows. "
                "E na previsão do tempo, o dia segue com sol e temperaturas agradáveis na maior parte do interior paulista e na capital. "
                "Giro de Notícias Amplificadora. Informação e a melhor trilha sonora no seu dia. A música continua agora!"
    },
    {
        "file": "spot_governo_utilidade_demo.mp3",
        "voice": "pt-BR-FranciscaNeural",
        "rate": "+2%",
        "pitch": "+0Hz",
        "text": "Atenção motorista: no trânsito, o cuidado salva vidas. Reduza a velocidade, use sempre o cinto de segurança e nunca use o celular ao volante. "
                "Chegue bem, chegue em paz. Campanha Nacional de Segurança no Trânsito. Amplificadora: apoiando a cidadania e a vida."
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
