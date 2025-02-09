
import { useState } from "react";

function App() {
  // State variables for text input, voice selection, response format, model, speed, etc.
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [responseFormat, setResponseFormat] = useState("mp3");
  const [model, setModel] = useState("tts-1");
  const [speed, setSpeed] = useState(1.0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // List of available options (you can extend these if needed)
  const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
  const formats = ["mp3", "opus", "aac", "flac", "wav", "pcm"];
  const models = ["tts-1", "tts-1-hd"];

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAudioUrl(null);

    // Build the request payload – note that the API supports up to 4096 characters
    const payload = {
      input: text,
      voice: voice,
      response_format: responseFormat,
      model: model,
      speed: speed,
    };

    try {
      // Replace the URL with your API endpoint if different
      const res = await fetch("http://localhost:5050/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // The API does not enforce a real API key so you can use any string.
          "Authorization": "Bearer your_api_key_here"
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error generating audio");
      }
      // Get the binary data (audio file) as a Blob
      const blob = await res.blob();
      // Create a blob URL so we can play the audio
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate audio");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Text-to-Speech Demo</h1>
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
            <strong>Voice:</strong>
          </label>
          <br />
          <select value={voice} onChange={(e) => setVoice(e.target.value)}>
            {voices.map((v) => (
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
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Audio"}
        </button>
      </form>
      {audioUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Audio Output:</h3>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}

export default App;

