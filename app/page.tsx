"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [deviceStatus, setDeviceStatus] = useState("Online");
  const [networkStatus, setNetworkStatus] = useState("Connected");
  const [battery, setBattery] = useState(97);
  const [cpuLoad, setCpuLoad] = useState(21);
  const [gpuLoad, setGpuLoad] = useState(14);
  const [temp, setTemp] = useState(36.2);
  const [lastAlert, setLastAlert] = useState("No active alerts");
  const [log, setLog] = useState<string[]>([
    "System boot complete.",
    "Raspberry Pi connected.",
    "Stereo cameras calibrated.",
    "Ready for voice commands.",
  ]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [mood, setMood] = useState("neutral");

  const videoFileId = "1A2B3C4D5E6F-example-file-id"; // Google Drive Video ID placeholder

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

  // Simulate dynamic system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setTemp((t) => 35 + Math.random() * 3);
      setCpuLoad(Math.floor(15 + Math.random() * 25));
      setGpuLoad(Math.floor(10 + Math.random() * 30));
      setBattery((b) => (b > 5 ? b - Math.random() * 0.1 : 100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-60 bg-gray-800 p-4 flex flex-col">
        <h1 className="text-xl font-bold text-teal-400 mb-8">Guidelight AI</h1>
        <nav className="flex-1 space-y-4">
          <a href="#" className="block px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">Dashboard</a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-700">AI Vision</a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-700">Logs</a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-700">Settings</a>
        </nav>

        <div className="mt-auto text-sm space-y-1">
          <div><strong>Status:</strong> {deviceStatus}</div>
          <div><strong>Network:</strong> {networkStatus}</div>
          <div><strong>Battery:</strong> {battery.toFixed(0)}%</div>
          <div><strong>CPU:</strong> {cpuLoad}%</div>
          <div><strong>GPU:</strong> {gpuLoad}%</div>
          <div><strong>Temp:</strong> {temp.toFixed(1)}°C</div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VIDEO FEEDS + CONTROLS */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Live Camera & AI Feed</h2>
              <div className="flex gap-2">
                <button onClick={toggleStream} className="px-3 py-1.5 bg-teal-500 rounded text-gray-900 text-sm">{isStreaming ? 'Stop Stream' : 'Start Stream'}</button>
                <button onClick={() => fakeSendCommand("Capture Frame")} className="px-3 py-1.5 border rounded text-sm">Capture</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Camera Feed */}
              <div className="aspect-video bg-gray-900 rounded overflow-hidden relative">
                {isStreaming ? (
                  <video autoPlay loop muted playsInline className="object-cover w-full h-full opacity-90">
                    <source src="/videos/livefeed.mp4" type="video/mp4"/>
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">Stream paused</div>
                )}
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">Stereo Cameras</div>
              </div>

              {/* Google Drive Video */}
              <div className="aspect-video bg-gray-900 rounded overflow-hidden">
                <iframe
                  title="drive-video"
                  src={`https://drive.google.com/file/d/${videoFileId}/preview`}
                  className="w-full h-full"
                  allow="autoplay"
                />
              </div>
            </div>

            {/* CONTROL BUTTONS */}
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={playTestAlert} className="px-4 py-2 bg-amber-500 rounded text-gray-900 text-sm">Test Obstacle Alert</button>
              <button onClick={reshufflePlaylist} className="px-4 py-2 bg-teal-500 rounded text-gray-900 text-sm">Reshuffle Playlist</button>
              <button onClick={() => fakeSendCommand("Send continuous frames")} className="px-4 py-2 border rounded text-sm">Start Continuous Frames</button>
            </div>
          </div>

          {/* ALERTS & LOGS */}
          <div className="bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-semibold text-sm mb-2">Current Alert</h3>
            <p className="text-gray-300">{lastAlert}</p>

            <h4 className="font-semibold text-sm mt-4 mb-1">System Logs</h4>
            <div className="max-h-48 overflow-auto bg-gray-900 p-3 rounded font-mono text-xs text-green-300">
              {log.map((l, idx) => <div key={idx}>{l}</div>)}
            </div>
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          {/* QUICK COMMANDS */}
          <div className="bg-gray-800 rounded-lg shadow p-4 text-sm">
            <h4 className="font-semibold mb-2">Quick Commands</h4>
            <div className="grid gap-2">
              <button onClick={() => fakeSendCommand("Read text from image")} className="w-full px-3 py-2 border rounded">OCR Read</button>
              <button onClick={() => fakeSendCommand("Describe scene")} className="w-full px-3 py-2 border rounded">Describe Scene</button>
              <button onClick={() => fakeSendCommand("Shuffle upbeat playlist")} className="w-full px-3 py-2 border rounded">Shuffle Music</button>
            </div>
          </div>

          {/* MOOD & PLAYLIST */}
          <div className="bg-gray-800 rounded-lg shadow p-4 text-sm">
            <h4 className="font-semibold mb-2">Current Mood</h4>
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 bg-gray-900 rounded font-medium">{mood}</div>
              <button onClick={reshufflePlaylist} className="px-3 py-1.5 bg-teal-500 text-gray-900 rounded text-sm">Auto Reshuffle</button>
            </div>
          </div>

          {/* PROJECT INFO */}
          <div className="bg-gray-800 rounded-lg shadow p-4 text-sm">
            <h4 className="font-semibold mb-2">Project Info</h4>
            <p className="text-gray-300 text-xs leading-relaxed">
              <strong>Guidelight AI</strong> integrates Raspberry Pi, AWS Polly, Gemini APIs, and object detection to assist visually impaired users with real-time scene understanding, voice guidance, and music control.
            </p>
          </div>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 w-full border-t border-gray-700 bg-gray-900 py-2 text-xs text-gray-500 text-center">
        2025 © Guidelight AI | Built with ❤️ by Team DPS Jodhpur
      </footer>
    </div>
  );
}
