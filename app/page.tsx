'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HawkEyeVisualization from './components/HawkEyeVisualization'
import VideoUploader from './components/VideoUploader'
import AnalysisPanel from './components/AnalysisPanel'

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [ballTrajectory, setBallTrajectory] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoUpload = (file: File) => {
    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    setAnalysisComplete(false)
  }

  const analyzeVideo = () => {
    setIsAnalyzing(true)

    // Simulate video analysis with realistic cricket bowling data
    setTimeout(() => {
      const trajectory = generateBallTrajectory()
      setBallTrajectory(trajectory)
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 3000)
  }

  const generateBallTrajectory = () => {
    // Generate realistic cricket ball trajectory
    const releasePoint = { x: 0, y: 2.5, z: 0 }
    const pitchPoint = { x: 0, y: 0.1, z: -12 }
    const bounceHeight = 1.8
    const finalPoint = { x: -0.3, y: 0.8, z: -18 }

    const points = []
    const numPoints = 100

    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1)

      if (t < 0.6) {
        // Before bounce
        const segmentT = t / 0.6
        const x = releasePoint.x + (pitchPoint.x - releasePoint.x) * segmentT
        const z = releasePoint.z + (pitchPoint.z - releasePoint.z) * segmentT
        const y = releasePoint.y + (pitchPoint.y - releasePoint.y) * segmentT - 9.8 * segmentT * segmentT * 0.5
        points.push([x, Math.max(y, 0.05), z])
      } else {
        // After bounce
        const segmentT = (t - 0.6) / 0.4
        const x = pitchPoint.x + (finalPoint.x - pitchPoint.x) * segmentT
        const z = pitchPoint.z + (finalPoint.z - pitchPoint.z) * segmentT
        const bounceY = bounceHeight * Math.sin(segmentT * Math.PI)
        const y = pitchPoint.y + bounceY + (finalPoint.y - pitchPoint.y) * segmentT
        points.push([x, y, z])
      }
    }

    return {
      points,
      speed: 135 + Math.random() * 15, // km/h
      swing: Math.random() * 0.8 - 0.4,
      spin: Math.random() * 500 + 200, // rpm
      length: 'Good Length',
      line: 'Off Stump',
      bounceAngle: 12 + Math.random() * 8,
      pitchingPoint: pitchPoint,
      releasePoint: releasePoint,
      releaseAngle: 8 + Math.random() * 4,
      seam: Math.random() > 0.5 ? 'Upright' : 'Scrambled'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Cricket Bowler Analysis</h1>
              <p className="text-gray-400 text-sm mt-1">DRS Hawk-Eye Ball Trajectory System</p>
            </div>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-xs text-gray-400">LIVE ANALYSIS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Video Upload & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <VideoUploader
              onVideoUpload={handleVideoUpload}
              videoUrl={videoUrl}
              videoRef={videoRef}
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeVideo}
              disabled={!videoFile || isAnalyzing}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                !videoFile || isAnalyzing
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Bowling'
              )}
            </motion.button>

            {analysisComplete && ballTrajectory && (
              <AnalysisPanel trajectory={ballTrajectory} />
            )}
          </div>

          {/* Right Panel - 3D Hawk-Eye Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
              <div className="border-b border-gray-800 px-6 py-3 bg-black/40">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Hawk-Eye Ball Tracking</h2>
                  <div className="flex gap-4 text-xs">
                    <span className="text-gray-400">3D View</span>
                    <span className="text-blue-400">● Side Camera</span>
                    <span className="text-green-400">● Top Camera</span>
                  </div>
                </div>
              </div>

              <div className="aspect-video bg-gradient-to-b from-gray-900 to-black relative">
                <HawkEyeVisualization
                  trajectory={ballTrajectory}
                  isPlaying={analysisComplete}
                />

                {!analysisComplete && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏏</div>
                      <p className="text-gray-400">Upload a bowling video to begin analysis</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
