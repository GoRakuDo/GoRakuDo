"""Gemini interactions-API image generation (supports multiple reference images).

Usage (from repo root, with GEMINI_API_KEY in .env.local):
  export $(grep -v '^#' .env.local | xargs)
  python scripts/generate-quest-image.py <prompt_file> <out_jpg> <aspect_ratio> <image_size> [ref1 ref2 ...]

Example:
  python scripts/generate-quest-image.py prompt.txt out.jpg 16:9 2K ref.png

Reads GEMINI_API_KEY from the environment.
"""
import base64
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.request

API = "https://generativelanguage.googleapis.com/v1beta/interactions"
MODEL = "gemini-3.1-flash-image"


def main() -> int:
    prompt_file, out_path, aspect, size = sys.argv[1:5]
    refs = sys.argv[5:]

    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY not set")
        return 1

    prompt = open(prompt_file, encoding="utf-8").read()
    parts = [{"type": "text", "text": prompt}]
    for ref in refs:
        mime = mimetypes.guess_type(ref)[0] or "image/png"
        with open(ref, "rb") as fh:
            parts.append(
                {
                    "type": "image",
                    "mime_type": mime,
                    "data": base64.b64encode(fh.read()).decode(),
                }
            )

    body = {
        "model": MODEL,
        "input": parts,
        "response_format": {
            "type": "image",
            "mime_type": "image/jpeg",
            "aspect_ratio": aspect,
            "image_size": size,
        },
    }
    req = urllib.request.Request(
        API,
        data=json.dumps(body).encode(),
        headers={"x-goog-api-key": key, "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=600) as resp:
            payload = json.load(resp)
    except urllib.error.HTTPError as exc:
        print("HTTP", exc.code, exc.read().decode()[:800])
        return 1

    images = [
        part
        for step in payload.get("steps", [])
        if step.get("type") == "model_output"
        for part in step.get("content", [])
        if part.get("type") == "image"
    ]
    if not images:
        print("No image. Steps:", [s.get("type") for s in payload.get("steps", [])])
        print(json.dumps(payload)[:600])
        return 1

    raw = base64.b64decode(images[-1]["data"])
    with open(out_path, "wb") as fh:
        fh.write(raw)
    print(f"OK {out_path} ({len(raw)} bytes) aspect={aspect} size={size} refs={len(refs)}")
    print("tokens:", payload.get("usage", {}).get("total_tokens"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
