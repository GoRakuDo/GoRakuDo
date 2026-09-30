#!/usr/bin/env python3
"""
Generate TTS audio assets for GoRakuDo Quest dialogues using OpenRouter Fish Audio.

Usage:
    python scripts/generate-quest-voice.py [--force] [--input src/data/quest/prologue.json]

Environment:
    OPENROUTER_API_KEY in .env, .env.local, or environment variable.
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/audio/speech"
DEFAULT_MODEL = "fish-audio/s2.1-pro-free:free"


def load_env():
    """Load OPENROUTER_API_KEY from .env.local or .env if not in os.environ."""
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
                        k = k.strip()
                        v = v.strip().strip("\"'")
                        if k == "OPENROUTER_API_KEY":
                            return v
    return None


def generate_audio(text: str, api_key: str, model: str = DEFAULT_MODEL) -> bytes:
    """Send TTS request to OpenRouter and return raw mp3 bytes."""
    payload = {
        "model": model,
        "input": text,
        "response_format": "mp3",
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        OPENROUTER_API_URL,
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
    parser.add_argument("--force", action="store_true", help="Overwrite existing audio files")
    args = parser.parse_args()

    api_key = load_env()
    if not api_key:
        print("[error] OPENROUTER_API_KEY is not set.")
        print("        Please add OPENROUTER_API_KEY=your_key to .env.local or export it.")
        sys.exit(1)

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

    success_count = 0
    skipped_count = 0

    for idx, item in enumerate(lines):
        line_id = item.get("id", f"line_{idx:02d}")
        jp_text = item.get("jpVoice", "").strip()
        if not jp_text:
            continue

        out_file = out_dir / f"{line_id}.mp3"
        if out_file.exists() and not args.force:
            print(f"[skip] {line_id}: {out_file.name} already exists.")
            skipped_count += 1
            continue

        print(f"[gen] ({idx+1}/{len(lines)}) {line_id}: '{jp_text}' ...", end=" ", flush=True)
        try:
            audio_bytes = generate_audio(jp_text, api_key, args.model)
            with open(out_file, "wb") as f:
                f.write(audio_bytes)
            print(f"OK ({len(audio_bytes):,} bytes)")
            success_count += 1
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            print(f"FAILED (HTTP {e.code}): {err_body}")
        except Exception as e:
            print(f"FAILED: {e}")

        # Rate limit safety delay (20 req/min = 3 sec delay)
        time.sleep(2.5)

    print(f"\n[done] Finished: {success_count} generated, {skipped_count} skipped. Output: {out_dir}")


if __name__ == "__main__":
    main()
