import asyncio
import edge_tts
import os
import shutil

PUB_DIR = r"c:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\public\spots"
DIST_DIR = r"c:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\dist\spots"
os.makedirs(PUB_DIR, exist_ok=True)
os.makedirs(DIST_DIR, exist_ok=True)

spots = [
    {
        "filename": "spot_amp_br_thalita_letras_1.mp3",
        "voice": "pt-BR-ThalitaMultilingualNeural",
        "rate": "-14%",
        "pitch": "-2Hz",
        "text": "A... M... P... L... I... F... I... C... A... D... O... R... A... Amplificadora... ampliando a sua onda musical."
    },
    {
        "filename": "spot_amp_br_francisca_letras_2.mp3",
        "voice": "pt-BR-FranciscaNeural",
        "rate": "-12%",
        "pitch": "-2Hz",
        "text": "A... M... P... L... I... F... I... C... A... D... O... R... A... Amplificadora... ampliando a sua onda musical."
    },
    {
        "filename": "spot_amp_br_thalita_sensual_3.mp3",
        "voice": "pt-BR-ThalitaMultilingualNeural",
        "rate": "-12%",
        "pitch": "-2Hz",
        "text": "Ouça... Sinta o som... A... M... P... L... I... F... I... C... A... D... O... R... A... Amplificadora... ampliando a sua onda musical."
    },
    {
        "filename": "spot_amp_br_francisca_silabas_4.mp3",
        "voice": "pt-BR-FranciscaNeural",
        "rate": "-14%",
        "pitch": "-2Hz",
        "text": "Am... pli... fi... ca... do... ra... Amplificadora... ampliando a sua onda musical."
    },
    {
        "filename": "spot_amp_br_thalita_onda_5.mp3",
        "voice": "pt-BR-ThalitaMultilingualNeural",
        "rate": "-10%",
        "pitch": "-1Hz",
        "text": "A M P L I F I C A D O R A... Amplificadora... A música nos acompanha... ampliando a sua onda musical."
    }
]

async def main():
    for s in spots:
        p_out = os.path.join(PUB_DIR, s["filename"])
        d_out = os.path.join(DIST_DIR, s["filename"])
        print(f"Generating {s['filename']} with {s['voice']}...")
        comm = edge_tts.Communicate(s["text"], s["voice"], rate=s["rate"], pitch=s["pitch"])
        await comm.save(p_out)
        shutil.copyfile(p_out, d_out)
        print(f"Saved: {p_out} ({os.path.getsize(p_out)} bytes)")

if __name__ == "__main__":
    asyncio.run(main())
