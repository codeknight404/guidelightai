"use client";

import React from "react";
import { useState } from "react";

export default function Home() {
  const [deviceStatus, setDeviceStatus] = useState("Connected");
  const [lastAlert, setLastAlert] = useState("No recent alerts");
  const [log, setLog] = useState<string[]>([
    "System initialized",
    "Pi module connected",
    "Listening for voice commands...",
  ]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [mood, setMood] = useState("neutral");

  // Set your Google Drive video file ID here
  const videoFileId = "1A2B3C4D5E6F-example-file-id"; // Replace with real file id

  function pushLog(line: string) {
    setLog((l) => [line, ...l].slice(0, 50));
  }

  async function fakeSendCommand(cmd: string) {
    pushLog(`> ${cmd}`);
    setTimeout(() => {
      pushLog(`Assistant: Executed '${cmd}'`);
      setLastAlert(`${cmd} — completed`);
    }, 800);
  }

  function toggleStream() {
    setIsStreaming((s) => !s);
    pushLog(isStreaming ? "Stopped video stream" : "Started video stream");
  }

  function playTestAlert() {
    setLastAlert("Obstacle: chair 1.2m ahead");
    pushLog("Alert: chair 1.2m ahead");
  }

  function reshufflePlaylist() {
    const moods = ["happy", "sad", "energetic", "calm", "neutral"];
    const pick = moods[Math.floor(Math.random() * moods.length)];
    setMood(pick);
    pushLog(`Playlist reshuffled -> mood: ${pick}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Guidelight AI - Control Panel</h1>
            <p className="text-sm text-gray-500">Empowering vision through Intelligence.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2px text-gray-600">Device</div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${deviceStatus === 'Connected' ? 'bg-green-300 text-green-900' : 'bg-red-100 text-red-800'}`}>
              {deviceStatus}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Live feed + controls */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium">Live Camera & Video</h2>
                <div className="flex items-center gap-3">
                  <button onClick={toggleStream} className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-indigo-600 text-white text-sm">{isStreaming ? 'Stop Stream' : 'Start Stream'}</button>
                  <button onClick={() => fakeSendCommand('Capture Frame')} className="px-3 py-1.5 rounded border text-sm">Capture</button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left frame: Camera preview */}
                <div className="aspect-video bg-gray-900 rounded overflow-hidden flex items-center justify-center">
                  {isStreaming ? (
                    <div className="w-full h-full relative">
                      <video autoPlay loop muted playsInline className="object-cover w-full h-full opacity-90">
                        <source src="/videos/livefeed.mp4" type="video/mp4" />
                      </video>
                      <div className="absolute top-3 left-3 bg-black/40 text-white px-2 py-1 text-xs rounded">Stereo Cameras (Pi)</div>
                    </div>
                  ) : (
                    <div className="text-gray-300">Stream stopped</div>
                  )}
                </div>

                {/* Right frame: Google Drive video */}
                <div className="aspect-video bg-gray-900 rounded overflow-hidden">
                  <iframe
                    title="drive-video"
                    src={`https://drive.google.com/file/d/${videoFileId}/preview`}
                    className="w-full h-full"
                    allow="autoplay"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button onClick={() => { playTestAlert(); pushLog('Played test alert'); }} className="px-4 py-2 bg-amber-500 rounded text-white">Play Test Alert</button>
                <button onClick={() => reshufflePlaylist()} className="px-4 py-2 bg-emerald-600 rounded text-white">Reshuffle Playlist</button>
                <button onClick={() => fakeSendCommand('Send continuous frames')} className="px-4 py-2 border rounded">Start Continuous Frames</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-md font-medium">Last Alert</h3>
              <p className="mt-2 text-sm text-gray-700">{lastAlert}</p>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600">System Logs</h4>
                <div className="mt-2 max-h-40 overflow-auto bg-gray-900 text-white p-3 rounded text-xs font-mono">
                  {log.map((l, idx) => (
                    <div key={idx} className="py-0.5">{l}</div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Right column: Controls, status, playlists */}
          <aside className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-sm font-medium">Device Status</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li><strong>Pi:</strong> {deviceStatus}</li>
                <li><strong>Stereo:</strong> Active</li>
                <li><strong>Object Detection:</strong> YOLOv5s (local)</li>
                <li><strong>Backend:</strong> FastAPI + Polly</li>
                <li><strong>Spotify:</strong> Connected</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-sm font-medium">Quick Commands</h4>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <button onClick={() => fakeSendCommand('Read text')} className="w-full px-3 py-2 border rounded text-sm">Read Text (OCR)</button>
                <button onClick={() => fakeSendCommand('What is in front of me?')} className="w-full px-3 py-2 border rounded text-sm">Describe Scene</button>
                <button onClick={() => fakeSendCommand('Shuffle upbeat playlist')} className="w-full px-3 py-2 border rounded text-sm">Shuffle Music</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-sm font-medium">Current Mood</h4>
              <div className="mt-2 flex items-center gap-3">
                <div className="px-3 py-2 rounded bg-gray-100 font-medium">{mood}</div>
                <button onClick={() => reshufflePlaylist()} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm">Auto Reshuffle</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 text-sm">
              <h4 className="font-medium">Project Info</h4>
              <p className="mt-2 text-gray-600">Gudelight AI — Raspberry Pi + AWS + Gemini + Polly + Spotify.</p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t bg-white items-center justify-center">
        <div className="max-w-7xl py-4 px-4 sm:px-6 lg:px-8 text-xs text-gray-500">2025 © Guidelight AI | Made with ❤️ & ☕ by Team DPS Jodhpur</div>
      </footer>
    </div>
  );
}
