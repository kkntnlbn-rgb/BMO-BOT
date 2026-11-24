#!/usr/bin/env python3
import sys, json

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 extract_timestamps.py <audio_path> <output_json>")
        sys.exit(1)

    audio_path, output_json = sys.argv[1], sys.argv[2]
    fps = 30
    words_out = []

    try:
        from faster_whisper import WhisperModel
        model = WhisperModel("large-v3", device="auto", compute_type="int8")
        segments, _ = model.transcribe(audio_path, language="ar", word_timestamps=True)
        for seg in segments:
            for w in seg.words:
                words_out.append({
                    "word": w.word.strip(),
                    "startSec": round(w.start, 3),
                    "endSec": round(w.end, 3),
                    "startFrame": round(w.start * fps),
                    "endFrame": round(w.end * fps),
                })
    except ImportError:
        import whisper
        model = whisper.load_model("medium")
        result = model.transcribe(audio_path, language="ar", word_timestamps=True)
        for seg in result["segments"]:
            for w in seg.get("words", []):
                words_out.append({
                    "word": w["word"].strip(),
                    "startSec": round(w["start"], 3),
                    "endSec": round(w["end"], 3),
                    "startFrame": round(w["start"] * fps),
                    "endFrame": round(w["end"] * fps),
                })

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump({"fps": fps, "words": words_out}, f, ensure_ascii=False, indent=2)
    print(f"✅ Extracted {len(words_out)} Arabic word timestamps to {output_json}")

if __name__ == "__main__":
    main()
