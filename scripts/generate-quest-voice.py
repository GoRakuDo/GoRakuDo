#!/usr/bin/env python3
"""
Generate TTS audio assets for GoRakuDo Quest dialogues using OpenRouter Fish Audio.
Supports voice cloning via reference audio WAV and Fish Audio emotion/style tags.

Usage:
    python scripts/generate-quest-voice.py [--voice-sample PATH] [--force] [--input src/data/quest/prologue.json]
"""

import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

OPENROUTER_SPEECH_URL = "https://openrouter.ai/api/v1/audio/speech"
OPENROUTER_KEYS_URL = "https://openrouter.ai/api/v1/keys"
OPENROUTER_KEY_CHECK_URL = "https://openrouter.ai/api/v1/auth/key"
DEFAULT_MODEL = "fish-audio/s2.1-pro-free:free"
DEFAULT_VOICE_SAMPLE = Path("A:/kasou_yoshia_kantou_accent_bright_natural_japanese_female.wav")

# Transcript of the reference audio sample (required for Fish Audio S2.1 voice cloning)
DEFAULT_SAMPLE_TRANSCRIPT = (
    "私はあかりと申します。彼は山田さんです。山田さんと話してます。"
    "先生、1つ聞いていいですか？YouTube Musicを聴いてます。"
    "チョコが好き？日本語は難しいんですか？"
    "ElevenLabsは、ディープラーニングを用いた自然な音声合成ソフトウェアの開発を専門とするソフトウェア会社である。"
    "2022年に、ポーランド人の起業家であるピョートル・ドンブコフスキとマテウシュ・スタニシェフスキによって創業された。"
)


def load_raw_api_key():
    """Load OPENROUTER_API_KEY from os.environ, .env.local, or .env."""
    if "OPENROUTER_API_KEY" in os.environ:
        return os.environ["OPENROUTER_API_KEY"]

    root = Path(__file__).resolve().parent.parent
    for fname in [".env.local", ".env"]:
        env_file = root / fname
        if env_file.exists():
            with open(env_file, encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        if k.strip() == "OPENROUTER_API_KEY":
                            return v.strip().strip("\"'")
    return None


def ensure_inference_key(raw_key: str) -> str:
    """If raw_key is an OpenRouter Management Key, provision a runtime inference key automatically."""
    req = urllib.request.Request(
        OPENROUTER_KEY_CHECK_URL,
        headers={"Authorization": f"Bearer {raw_key}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8")).get("data", {})
            if data.get("is_management_key"):
                # Provision a standard inference key
                create_req = urllib.request.Request(
                    OPENROUTER_KEYS_URL,
                    data=json.dumps({"name": "gorakudo-quest-tts"}).encode("utf-8"),
                    headers={
                        "Authorization": f"Bearer {raw_key}",
                        "Content-Type": "application/json",
                    },
                )
                with urllib.request.urlopen(create_req, timeout=15) as c_resp:
                    c_data = json.loads(c_resp.read().decode("utf-8"))
                    new_key = c_data.get("key")
                    if new_key:
                        print("[info] Provisioned standard inference key from management key.")
                        return new_key
    except Exception:
        pass
    return raw_key


def generate_audio(
    text: str,
    api_key: str,
    model: str = DEFAULT_MODEL,
    voice_sample_b64: str = None,
    sample_transcript: str = DEFAULT_SAMPLE_TRANSCRIPT,
) -> bytes:
    """Send TTS request to OpenRouter with optional voice cloning reference."""
    payload = {
        "model": model,
        "input": text,
        "response_format": "mp3",
    }
    if voice_sample_b64:
        payload["input_references"] = [
            {
                "type": "input_audio",
                "input_audio": {
                    "data": f"data:audio/wav;base64,{voice_sample_b64}",
                },
            },
            {
                "type": "text",
                "text": sample_transcript,
            },
        ]

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        OPENROUTER_SPEECH_URL,
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://gorakudo.org",
            "X-Title": "GoRakuDo Quest",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def main():
    parser = argparse.ArgumentParser(description="Generate Quest TTS Audio via OpenRouter")
    parser.add_argument("--input", default="src/data/quest/prologue.json", help="Path to scenario JSON")
    parser.add_argument("--outdir", default="public/assets/voice/quest", help="Output directory")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="OpenRouter TTS model")
    parser.add_argument("--voice-sample", default=str(DEFAULT_VOICE_SAMPLE), help="Path to reference wav for cloning")
    parser.add_argument("--single", help="Generate single line text directly (for testing)")
    parser.add_argument("--single-out", default="A:/Temp/test_voice_single.mp3", help="Output for single line test")
    parser.add_argument("--force", action="store_true", help="Overwrite existing audio files")
    args = parser.parse_args()

    raw_key = load_raw_api_key()
    if not raw_key:
        print("[error] OPENROUTER_API_KEY is not set.")
        sys.exit(1)

    api_key = ensure_inference_key(raw_key)

    voice_sample_b64 = None
    sample_path = Path(args.voice_sample)
    if sample_path.exists():
        voice_sample_b64 = base64.b64encode(sample_path.read_bytes()).decode("ascii")
        print(f"[info] Voice cloning enabled using: {sample_path.name}")
    else:
        print(f"[warn] Voice sample not found at {sample_path}. Proceeding with default voice.")

    # Single line mode
    if args.single:
        print(f"[gen] Single line: '{args.single}' ...", end=" ", flush=True)
        audio = generate_audio(args.single, api_key, args.model, voice_sample_b64)
        out_p = Path(args.single_out)
        out_p.parent.mkdir(parents=True, exist_ok=True)
        out_p.write_bytes(audio)
        print(f"OK ({len(audio):,} bytes) -> {out_p}")
        return

    # Scenario JSON mode
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"[error] Input file {input_path} does not exist.")
        sys.exit(1)

    out_dir = Path(args.outdir)
    out_dir.mkdir(parents=True, exist_ok=True)

    with open(input_path, encoding="utf-8") as f:
        data = json.load(f)

    lines = data.get("lines", [])
    print(f"[info] Loaded {len(lines)} lines from {input_path}")

    for idx, item in enumerate(lines):
        line_id = item.get("id", f"line_{idx:02d}")
        jp_text = item.get("jpVoice", "").strip()
        if not jp_text:
            continue

        out_file = out_dir / f"{line_id}.mp3"
        if out_file.exists() and not args.force:
            print(f"[skip] {line_id}: {out_file.name} already exists.")
            continue

        print(f"[gen] ({idx+1}/{len(lines)}) {line_id}: '{jp_text}' ...", end=" ", flush=True)
        try:
            audio = generate_audio(jp_text, api_key, args.model, voice_sample_b64)
            out_file.write_bytes(audio)
            print(f"OK ({len(audio):,} bytes)")
        except Exception as e:
            print(f"FAILED: {e}")

        time.sleep(2.5)


if __name__ == "__main__":
    main()
