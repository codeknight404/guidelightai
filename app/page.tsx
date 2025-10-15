"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [deviceStatus, setDeviceStatus] = useState("Connected");
  const [lastAlert, setLastAlert] = useState("No active alerts");
  const [log, setLog] = useState<string[]>([
    "System boot complete.",
    "Raspberry Pi connected.",
    "Stereo cameras calibrated.",
    "Ready for voice commands.",
  ]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [mood, setMood] = useState("neutral");
  const [temp, setTemp] = useState(36.2);
  const [cpuLoad, setCpuLoad] = useState(21);
  const [battery, setBattery] = useState(97);

  // Replace this with a real Google Drive video file ID
  const videoFileId = "1A2B3C4D5E6F-example-file-id";

  function pushLog(line: string) {
    const time = new Date().toLocaleTimeString();
    setLog((l) => [`[${time}] ${line}`, ...l].slice(0, 60));
  }

  async function fakeSendCommand(cmd: string) {
    pushLog(`> ${cmd}`);
    setTimeout(() => {
      pushLog(`System: Executed '${cmd}' successfully.`);
      setLastAlert(`${cmd} — completed`);
    }, 800);
  }

  function toggleStream() {
    setIsStreaming((s) => !s);
    pushLog(isStreaming ? "Video stream stopped." : "Video stream resumed.");
  }

  function playTestAlert() {
    setLastAlert("Obstacle detected: chair 1.3m ahead.");
    pushLog("ALERT: Obstacle detected (chair 1.3m).");
  }

  function reshufflePlaylist() {
    const moods = ["happy", "focused", "energetic", "calm", "neutral"];
    const pick = moods[Math.floor(Math.random() * moods.length)];
    setMood(pick);
    pushLog(`Playlist updated — mood: ${pick}`);
  }

  // Simulate changing metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setTemp((t) => 35 + Math.random() * 3);
      setCpuLoad(Math.floor(15 + Math.random() * 25));
      setBattery((b) => (b > 5 ? b - Math.random() * 0.1 : 100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-5 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Guidelight AI – Control Panel</h1>
            <p className="text-sm text-gray-500">
              Empowering vision through intelligence.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Device</span>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                deviceStatus === "Connected"
                  ? "bg-green-200 text-green-900"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {deviceStatus}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Camera & Logs */}
        <section className="lg:col-span-2 space-y-6">
          {/* Live Video Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-medium">Live Camera & Video Feed</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleStream}
                  className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm"
                >
                  {isStreaming ? "Stop Stream" : "Start Stream"}
                </button>
                <button
                  onClick={() => fakeSendCommand("Capture Frame")}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Capture
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Local camera feed */}
              <div className="aspect-video bg-gray-900 rounded overflow-hidden relative">
                {isStreaming ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full opacity-90"
                  >
                    <source src="/videos/livefeed.mp4" type="video/mp4" />
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    Stream paused
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/40 text-white px-2 py-1 text-xs rounded">
                  Stereo Cameras (Raspberry Pi)
                </div>
              </div>

              {/* Google Drive Feed */}
              <div className="aspect-video bg-gray-900 rounded overflow-hidden">
                <iframe
                  title="drive-video"
                  src={`https://drive.google.com/file/d/${videoFileId}/preview`}
                  className="w-full h-full"
                  allow="autoplay"
                />
              </div>
            </div>

            {/* Control buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  playTestAlert();
                  pushLog("Triggered test obstacle alert.");
                }}
                className="px-4 py-2 bg-amber-500 rounded text-white text-sm"
              >
                Test Obstacle Alert
              </button>
              <button
                onClick={() => reshufflePlaylist()}
                className="px-4 py-2 bg-emerald-600 rounded text-white text-sm"
              >
                Reshuffle Playlist
              </button>
              <button
                onClick={() => fakeSendCommand("Send continuous frames")}
                className="px-4 py-2 border rounded text-sm"
              >
                Start Continuous Frames
              </button>
            </div>
          </div>

          {/* Alerts and Logs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-md font-medium">Current Alert</h3>
            <p className="mt-2 text-sm text-gray-700">{lastAlert}</p>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                System Logs
              </h4>
              <div className="max-h-48 overflow-auto bg-gray-900 text-white p-3 rounded text-xs font-mono leading-relaxed">
                {log.map((l, idx) => (
                  <div key={idx} className="py-0.5">
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Sidebar */}
        <aside className="space-y-6">
          {/* Device Info */}
          <div className="bg-white rounded-lg shadow p-4 text-sm">
            <h4 className="font-medium mb-2">Device Status</h4>
            <ul className="space-y-1 text-gray-700">
              <li><strong>Pi:</strong> {deviceStatus}</li>
              <li><strong>Object Detection:</strong> YOLOv5s (local)</li>
              <li><strong>Backend:</strong> FastAPI + AWS Polly</li>
              <li><strong>Voice Engine:</strong> Gemini API</li>
              <li><strong>Spotify:</strong> Linked</li>
              <li><strong>CPU Load:</strong> {cpuLoad}%</li>
              <li><strong>Temperature:</strong> {temp.toFixed(1)}°C</li>
              <li><strong>Battery:</strong> {battery.toFixed(0)}%</li>
            </ul>
          </div>

          {/* Commands */}
          <div className="bg-white rounded-lg shadow p-4 text-sm">
            <h4 className="font-medium mb-2">Quick Commands</h4>
            <div className="grid gap-2">
              <button
                onClick={() => fakeSendCommand("Read text from image")}
                className="w-full px-3 py-2 border rounded"
              >
                Read Text (OCR)
              </button>
              <button
                onClick={() => fakeSendCommand("Describe scene")}
                className="w-full px-3 py-2 border rounded"
              >
                Describe Scene
              </button>
              <button
                onClick={() => fakeSendCommand("Shuffle upbeat playlist")}
                className="w-full px-3 py-2 border rounded"
              >
                Shuffle Music
              </button>
            </div>
          </div>

          {/* Mood */}
          <div className="bg-white rounded-lg shadow p-4 text-sm">
            <h4 className="font-medium mb-2">Current Mood</h4>
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded bg-gray-100 font-medium">
                {mood}
              </div>
              <button
                onClick={() => reshufflePlaylist()}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm"
              >
                Auto Reshuffle
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white rounded-lg shadow p-4 text-sm">
            <h4 className="font-medium">Project Info</h4>
            <p className="mt-2 text-gray-600 leading-relaxed">
              <strong>Guidelight AI</strong> integrates Raspberry Pi, AWS Polly,
              and Gemini APIs to assist visually impaired users by providing
              real-time object detection, scene description, and music control.
            </p>
          </div>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl py-4 px-6 text-xs text-gray-500 text-center">
          2025 © Guidelight AI | Built with ❤️ by Team DPS Jodhpur
        </div>
      </footer>
    </div>
  );
}
