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
        "filename": "spot_amp_vivienne_erotic_1.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "-15%",
        "pitch": "-3Hz",
        "text": "A... M... P... L... I... F... I... C... A... D... O... R... A... Ampliando sua onda musical."
    },
    {
        "filename": "spot_amp_vivienne_sensual_2.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "-12%",
        "pitch": "-2Hz",
        "text": "Ouça... Sinta cada frequência... A... M... P... L... I... F... I... C... A... D... O... R... A... Amplificadora... ampliando a sua onda musical."
    },
    {
        "filename": "spot_amp_emma_intimate_3.mp3",
        "voice": "en-US-EmmaMultilingualNeural",
        "rate": "-14%",
        "pitch": "-3Hz",
        "text": "A... M... P... L... I... F... I... C... A... D... O... R... A... Ampliando sua onda musical."
    },
    {
        "filename": "spot_amp_vivienne_night_4.mp3",
        "voice": "fr-FR-VivienneMultilingualNeural",
        "rate": "-16%",
        "pitch": "-4Hz",
        "text": "A... M... P... L... I... F... I... C... A... D... O... R... A... A música nos acompanha... sinta o som."
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
