'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

interface VideoUploaderProps {
  onVideoUpload: (file: File) => void
  videoUrl: string | null
  videoRef: React.RefObject<HTMLVideoElement>
}

export default function VideoUploader({ onVideoUpload, videoUrl, videoRef }: VideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      onVideoUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      onVideoUpload(file)
    }
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
      <div className="border-b border-gray-800 px-6 py-3 bg-black/40">
        <h2 className="text-lg font-semibold">Video Upload</h2>
      </div>

      <div className="p-6">
        {!videoUrl ? (
          <motion.div
            whileHover={{ scale: 1.01 }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <div className="text-5xl mb-4">📹</div>
            <p className="text-gray-300 font-medium mb-2">Click to upload or drag and drop</p>
            <p className="text-gray-500 text-sm">MP4, MOV, AVI (Max 100MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </motion.div>
        ) : (
          <div>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full rounded-lg mb-4"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              Change Video
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
}
