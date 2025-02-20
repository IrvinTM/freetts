import React, { useState, useEffect } from "react";

function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [voice, setVoice] = useState("");
  const [responseFormat, setResponseFormat] = useState("mp3");
  const [model, setModel] = useState("tts-1");
  const [speed, setSpeed] = useState(1.0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Define voice options for each language.
  const voiceOptions = {
    "en-US": [
      "alloy",
      "echo",
      "fable",
      "onyx",
      "nova",
      "shimmer",
      "en-US-JennyNeural",
      "en-US-GuyNeural"
    ],
    "en-GB": [
      "en-GB-LibbyNeural",
      "en-GB-RyanNeural"
    ],
    "es-ES": [
      "es-ES-AlvaroNeural",
      "es-ES-ElviraNeural"
    ],
    "es-MX": [
      "es-MX-DaliaNeural",
      "es-MX-JorgeNeural",
      "es-MX-SaraNeural"
    ],
  };

  // Define language options with labels.
  const languages = [
    { code: "en-US", label: "English (US)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "es-ES", label: "Spanish (Spain)" },
    { code: "es-MX", label: "Spanish (LatAm)" },
  ];

  const formats = ["mp3", "opus", "aac", "flac", "wav", "pcm"];
  const models = ["tts-1", "tts-1-hd"];

  // When the selected language changes, update the voice to the first option for that language.
  useEffect(() => {
    setVoice(voiceOptions[language][0]);
  }, [language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAudioUrl(null);

    // Build the request payload. Note that the API uses the voice parameter (which must be a valid Edge-TTS voice).
    const payload = {
      input: text,
      voice: voice,
      response_format: responseFormat,
      model: model,
      speed: speed,
    };

    try {
      const res = await fetch("http://localhost:5050/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer your_api_key_here"
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error generating audio");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate audio");
    }
    setLoading(false);
  };

  // Determine available voices for the currently selected language.
  const availableVoices = voiceOptions[language];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "20px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>QUICK TTS </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <strong>Text:</strong>
            </label>
            <br />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              style={{ width: "100%" }}
              placeholder="Enter text to convert to speech"
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <strong>Language:</strong>
            </label>
            <br />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <strong>Voice:</strong>
            </label>
            <br />
            <select value={voice} onChange={(e) => setVoice(e.target.value)}>
              {availableVoices.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <strong>Response Format:</strong>
            </label>
            <br />
            <select
              value={responseFormat}
              onChange={(e) => setResponseFormat(e.target.value)}
            >
              {formats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <strong>Model:</strong>
            </label>
            <br />
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <strong>Speed:</strong> {speed}
            </label>
            <br />
            <input
              type="range"
              min="0.25"
              max="4.0"
              step="0.05"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          >
            {loading ? "Generating..." : "Generate Audio"}
          </button>
        </form>
        {audioUrl && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <h3>Audio Output:</h3>
            <audio controls src={audioUrl}></audio>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
