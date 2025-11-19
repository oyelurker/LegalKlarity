"use client"

import { useState } from "react"
import { MeshGradient, DotOrbit } from "@paper-design/shaders-react"

export default function DemoOne() {
  const [intensity, setIntensity] = useState(1.5)
  const [speed, setSpeed] = useState(1.0)
  const [isInteracting, setIsInteracting] = useState(false)
  const [activeEffect, setActiveEffect] = useState("mesh")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("npm install @paper-design/shaders-react")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {activeEffect === "mesh" && (
        <MeshGradient
          className="w-full h-full absolute inset-0"
          colors={["#000000", "#1a1a1a", "#333333", "#ffffff"]}
          speed={speed}
          backgroundColor="#000000"
        />
      )}

      {activeEffect === "dots" && (
        <div className="w-full h-full absolute inset-0 bg-black">
          <DotOrbit
            className="w-full h-full"
            dotColor="#333333"
            orbitColor="#1a1a1a"
            speed={speed}
            intensity={intensity}
          />
        </div>
      )}

      {activeEffect === "combined" && (
        <>
          <MeshGradient
            className="w-full h-full absolute inset-0"
            colors={["#000000", "#1a1a1a", "#333333", "#ffffff"]}
            speed={speed * 0.5}
            wireframe="true"
            backgroundColor="#000000"
          />
          <div className="w-full h-full absolute inset-0 opacity-60">
            <DotOrbit
              className="w-full h-full"
              dotColor="#333333"
              orbitColor="#1a1a1a"
              speed={speed * 1.5}
              intensity={intensity * 0.8}
            />
          </div>
        </>
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="absolute top-8 left-8 pointer-events-auto">
          <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg">
            <h1 className="text-white font-bold">Background Shaders</h1>
          </div>
        </div>

        {/* Effect Controls */}
        <div className="absolute bottom-8 left-8 pointer-events-auto">
          <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg flex gap-2">
            <button
              onClick={() => setActiveEffect("mesh")}
              className={`px-3 py-1 rounded-md text-sm ${activeEffect === "mesh" ? "bg-white/20 text-white" : "text-white/60"}`}
            >
              Mesh
            </button>
            <button
              onClick={() => setActiveEffect("dots")}
              className={`px-3 py-1 rounded-md text-sm ${activeEffect === "dots" ? "bg-white/20 text-white" : "text-white/60"}`}
            >
              Dots
            </button>
            <button
              onClick={() => setActiveEffect("combined")}
              className={`px-3 py-1 rounded-md text-sm ${activeEffect === "combined" ? "bg-white/20 text-white" : "text-white/60"}`}
            >
              Combined
            </button>
          </div>
        </div>

        {/* Parameter Controls */}
        <div className="absolute bottom-8 right-8 pointer-events-auto space-y-4">
          <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg">
            <label className="block text-white text-sm mb-1">Intensity: {intensity.toFixed(1)}</label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg">
            <label className="block text-white text-sm mb-1">Speed: {speed.toFixed(1)}</label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute top-8 right-8 pointer-events-auto">
          <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isInteracting ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-white text-sm">{isInteracting ? 'Active' : 'Idle'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lighting overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-32 h-32 bg-gray-800/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: `${3 / speed}s` }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/2 rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: `${2 / speed}s`, animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-20 h-20 bg-gray-900/3 rounded-full blur-xl animate-pulse"
          style={{ animationDuration: `${4 / speed}s`, animationDelay: "0.5s" }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center font-mono text-xs text-white/40">
          <div>...21st-cli...</div>
          <div className="mt-1 flex items-center gap-2">
            <span>npm install @paper-design/shaders-react</span>
            <button
              onClick={copyToClipboard}
              className="pointer-events-auto opacity-30 hover:opacity-60 transition-opacity text-white/60 hover:text-white/80"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}