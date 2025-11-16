'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Sphere, Text } from '@react-three/drei'
import * as THREE from 'three'

interface HawkEyeVisualizationProps {
  trajectory: any
  isPlaying: boolean
}

function CricketPitch() {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -9]}>
        <planeGeometry args={[20, 30]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>

      {/* Pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -9]}>
        <planeGeometry args={[1.2, 22]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>

      {/* Stumps at both ends */}
      {[0, -18].map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          {[-0.11, 0, 0.11].map((x, i) => (
            <mesh key={i} position={[x, 0.36, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.71]} />
              <meshStandardMaterial color="#d4af37" />
            </mesh>
          ))}
          {/* Bails */}
          <mesh position={[0, 0.72, 0]}>
            <boxGeometry args={[0.25, 0.02, 0.02]} />
            <meshStandardMaterial color="#d4af37" />
          </mesh>
        </group>
      ))}

      {/* Crease lines */}
      {[0, -18].map((z, idx) => (
        <Line
          key={idx}
          points={[[-0.6, 0.02, z], [0.6, 0.02, z]]}
          color="white"
          lineWidth={2}
        />
      ))}

      {/* Grid lines */}
      {Array.from({ length: 7 }, (_, i) => {
        const z = -3 * i
        return (
          <Line
            key={i}
            points={[[-1, 0.02, z], [1, 0.02, z]]}
            color="#ffffff"
            lineWidth={0.5}
            opacity={0.2}
            transparent
          />
        )
      })}
    </group>
  )
}

function AnimatedBall({ trajectory, isPlaying }: { trajectory: any, isPlaying: boolean }) {
  const ballRef = useRef<THREE.Mesh>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (isPlaying && trajectory) {
      setCurrentIndex(0)
      setAnimating(true)
    }
  }, [isPlaying, trajectory])

  useFrame(() => {
    if (animating && trajectory && ballRef.current) {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= trajectory.points.length) {
          setAnimating(false)
          return 0
        }
        return next
      })

      if (currentIndex < trajectory.points.length) {
        const [x, y, z] = trajectory.points[currentIndex]
        ballRef.current.position.set(x, y, z)
        ballRef.current.rotation.x += 0.3
        ballRef.current.rotation.y += 0.2
      }
    }
  })

  return (
    <Sphere ref={ballRef} args={[0.036, 32, 32]} position={[0, 2.5, 0]}>
      <meshStandardMaterial color="#cc0000" metalness={0.3} roughness={0.4} />
    </Sphere>
  )
}

function TrajectoryLine({ trajectory }: { trajectory: any }) {
  if (!trajectory) return null

  return (
    <>
      {/* Main trajectory line */}
      <Line
        points={trajectory.points}
        color="#00ff00"
        lineWidth={3}
        opacity={0.8}
        transparent
      />

      {/* Pitching point marker */}
      {trajectory.pitchingPoint && (
        <Sphere
          args={[0.08, 16, 16]}
          position={[
            trajectory.pitchingPoint.x,
            trajectory.pitchingPoint.y,
            trajectory.pitchingPoint.z
          ]}
        >
          <meshBasicMaterial color="#ffff00" opacity={0.7} transparent />
        </Sphere>
      )}

      {/* Release point marker */}
      {trajectory.releasePoint && (
        <Sphere
          args={[0.08, 16, 16]}
          position={[
            trajectory.releasePoint.x,
            trajectory.releasePoint.y,
            trajectory.releasePoint.z
          ]}
        >
          <meshBasicMaterial color="#00ffff" opacity={0.7} transparent />
        </Sphere>
      )}
    </>
  )
}

export default function HawkEyeVisualization({ trajectory, isPlaying }: HawkEyeVisualizationProps) {
  return (
    <Canvas
      camera={{ position: [8, 6, 8], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />

      <CricketPitch />

      {trajectory && (
        <>
          <TrajectoryLine trajectory={trajectory} />
          <AnimatedBall trajectory={trajectory} isPlaying={isPlaying} />
        </>
      )}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={25}
      />

      {/* Grid helper */}
      <gridHelper args={[30, 30, '#333333', '#1a1a1a']} position={[0, 0, -9]} />
    </Canvas>
  )
}
