
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/



import React, { Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from './components/World/Environment';
import { Player } from './components/World/Player';
import { LevelManager } from './components/World/LevelManager';
import { Effects } from './components/World/Effects';
import { HUD } from './components/UI/HUD';
import { useStore } from './store';
import { AdMob } from '@capacitor-community/admob';

// Dynamic Camera Controller
const CameraController = () => {
  const { camera, size } = useThree();
  const { laneCount } = useStore();

  useFrame((state, delta) => {
    // Determine screen type and aspect ratio
    const aspect = size.width / size.height;
    const isMobile = aspect < 1.2; // Mobile portrait or square
    const isVeryNarrow = aspect < 0.7; // Very tall phones (modern aspect ratios)

    // Calculate expansion factors
    // Mobile requires backing up significantly more because vertical FOV is fixed in Three.js,
    // meaning horizontal view shrinks as aspect ratio drops.
    // We use more aggressive multipliers for mobile to keep outer lanes in frame.

    // IMPROVED: Better factors for ensuring full lane visibility
    const heightFactor = isVeryNarrow ? 3.5 : isMobile ? 3.0 : 0.5;
    const distFactor = isVeryNarrow ? 7.0 : isMobile ? 6.0 : 1.0;

    // Base (3 lanes): Higher and further back for mobile
    // Calculate target based on how many extra lanes we have relative to the start
    const extraLanes = Math.max(0, laneCount - 3);

    // Ensure minimum camera distance for mobile
    const baseY = isMobile ? 8.0 : 5.5; // Higher starting position for mobile
    const baseZ = isMobile ? 14.0 : 8.0; // Further back for mobile

    const targetY = baseY + (extraLanes * heightFactor);
    const targetZ = baseZ + (extraLanes * distFactor);

    const targetPos = new THREE.Vector3(0, targetY, targetZ);

    // Smoothly interpolate camera position
    camera.position.lerp(targetPos, delta * 2.0);

    // Look further down the track to see the end of lanes
    // On mobile, look slightly closer to keep runner in view
    const lookDistance = isMobile ? -25 : -30;
    camera.lookAt(0, 0, lookDistance);
  });

  return null;
};

function Scene() {
  return (
    <>
      <Environment />
      <group>
        {/* Attach a userData to identify player group for LevelManager collision logic */}
        <group userData={{ isPlayer: true }} name="PlayerGroup">
          <Player />
        </group>
        <LevelManager />
      </group>
      <Effects />
    </>
  );
}

function App() {
  // Initialize AdMob when app loads
  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        await AdMob.initialize({
          testingDevices: [],
          initializeForTesting: false,
        });
        console.log('AdMob initialized successfully');
      } catch (error) {
        console.error('AdMob initialization failed:', error);
      }
    };

    initializeAdMob();
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      <HUD />
      <Canvas
        dpr={typeof window !== 'undefined' && /Android|iPhone|iPad/i.test(navigator.userAgent) ? [0.8, 1.0] : [1, 1.5]} // Better quality
        gl={{
          antialias: false,
          stencil: false,
          depth: true,
          powerPreference: typeof window !== 'undefined' && /Android|iPhone|iPad/i.test(navigator.userAgent) ? "default" : "high-performance",
          failIfMajorPerformanceCaveat: false
        }}
        // Initial camera, matches the controller base
        camera={{ position: [0, 5.5, 8], fov: 60 }}
      >
        <CameraController />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* SEO Content Section - Hidden but accessible to search engines */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" style={{ zIndex: -1, opacity: 0.01 }}>
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="text-3xl font-cyber font-bold mb-3">
            Play Space Runner – The Ultimate Neon Space Adventure Game
          </h1>
          <p className="text-base leading-relaxed mb-3">
            Space Runner is a high-speed neon-style space adventure game where you run through cosmic paths,
            dodge obstacles, and explore the futuristic galaxy. Enjoy smooth gameplay, colorful visuals,
            and an addictive running experience. Play Space Runner now and test your reflexes in this
            thrilling sci-fi runner game. Perfect for fans of action games, arcade games, and space adventures.
          </p>
          <div className="text-sm opacity-75">
            <strong>Keywords:</strong> space runner game, space game online, neon running game, sci-fi runner game,
            galaxy adventure game, free online game, arcade space game, cosmic runner, futuristic game,
            action adventure game
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
