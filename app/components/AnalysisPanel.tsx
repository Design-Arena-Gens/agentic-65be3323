'use client'

import { motion } from 'framer-motion'

interface AnalysisPanelProps {
  trajectory: any
}

export default function AnalysisPanel({ trajectory }: AnalysisPanelProps) {
  const stats = [
    { label: 'Speed', value: `${trajectory.speed.toFixed(1)} km/h`, color: 'text-red-400' },
    { label: 'Spin Rate', value: `${trajectory.spin.toFixed(0)} rpm`, color: 'text-purple-400' },
    { label: 'Swing', value: `${Math.abs(trajectory.swing).toFixed(2)}m`, color: 'text-blue-400' },
    { label: 'Bounce Angle', value: `${trajectory.bounceAngle.toFixed(1)}°`, color: 'text-green-400' },
    { label: 'Release Angle', value: `${trajectory.releaseAngle.toFixed(1)}°`, color: 'text-yellow-400' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden shadow-xl"
    >
      <div className="border-b border-gray-800 px-6 py-3 bg-black/40">
        <h2 className="text-lg font-semibold">Analysis Results</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Length</p>
            <p className="text-lg font-bold text-blue-300">{trajectory.length}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Line</p>
            <p className="text-lg font-bold text-green-300">{trajectory.line}</p>
          </div>
        </div>

        <div className="space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center bg-gray-800/30 rounded-lg p-3"
            >
              <span className="text-sm text-gray-400">{stat.label}</span>
              <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Seam Position</p>
          <p className="text-sm font-semibold text-purple-300">{trajectory.seam}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center">
            <div className="text-2xl mb-1">📍</div>
            <p className="text-xs text-gray-400">Pitch Map</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-gray-400">Stats</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">💾</div>
            <p className="text-xs text-gray-400">Export</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
