
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
import { AdsterraBanner } from './components/Ads/AdsterraBanner';
import { AdsterraSocialBar } from './components/Ads/AdsterraSocialBar';
import { Recorder } from './components/UI/Recorder';
import { AdminToggle } from './components/UI/AdminToggle';
import { PauseMenu } from './components/UI/PauseMenu';

// Dynamic Camera Controller
const CameraController = () => {
  const { camera, size } = useThree();
  const { laneCount } = useStore();

  useFrame((state, delta) => {
    // FIXED CAMERA FOR ALL DEVICES
    // Camera stays at starting position throughout the game
    // No drone-like movement during level changes

    const aspect = size.width / size.height;
    const isMobile = aspect < 1.2;

    // Fixed camera positions - OPTIMIZED FOR MOBILE
    const cameraY = isMobile ? 5.5 : 6.0;   // Lower on mobile for better player visibility
    const cameraZ = isMobile ? 10.0 : 10.0;  // Same distance for consistency
    const lookDistance = isMobile ? -15 : -25; // Closer look-at for mobile

    const targetPos = new THREE.Vector3(0, cameraY, cameraZ);

    // Gentle lerp for smooth initial positioning
    camera.position.lerp(targetPos, delta * 0.5);

    // Fixed look-at point
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

// Landing Page Component with Blog/Description
const LandingPage = ({ onPlay }: { onPlay: () => void }) => {
  useEffect(() => {
    // AdSense initialization removed
  }, []);
  return (
    <div className="relative w-full h-screen bg-black overflow-y-auto overflow-x-hidden text-white scroll-smooth scrollbar-hide">
      {/* Background Effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center min-h-screen">

        {/* Hero Section */}
        <header className="text-center mb-16 mt-8 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-cyber font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_25px_rgba(34,211,238,0.6)]">
            SPACE RUNNER
          </h1>
          <p className="text-xl md:text-3xl text-cyan-100 mb-10 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            Dive into the <span className="text-cyan-400 font-semibold">Ultimate Neon Odyssey</span>. Run, Dodge, Survive.
          </p>

          {/* Play Button */}
          <button
            onClick={onPlay}
            className="group relative px-16 py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-2xl md:text-3xl rounded-sm transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.8)]"
            aria-label="Play Space Runner Game"
          >
            <span className="relative z-10 flex items-center gap-3">
              LETS PLAY 🚀
            </span>
            <div className="absolute inset-0 bg-white/20 blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
          </button>
        </header>

        {/* Adsterra Banner - Top position */}
        <div className='w-full flex justify-center mb-8'>
          <AdsterraBanner />
        </div>



        {/* Adsterra Banner - Above Footer */}
        <AdsterraBanner />

        {/* Footer */}
        <footer className="text-gray-500 text-sm text-center pb-8 w-full max-w-4xl border-t border-white/5 pt-8 mt-[35vh]">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4">
            <a href="/privacy.html" className="hover:text-cyan-300 transition-colors">Privacy Policy</a>
            <a href="/terms.html" className="hover:text-cyan-300 transition-colors">Terms of Service</a>
            <a href="/about.html" className="hover:text-cyan-300 transition-colors">About Us</a>
            <a href="/contact.html" className="hover:text-cyan-300 transition-colors">Contact</a>
            <a href="/cookies.html" className="hover:text-cyan-300 transition-colors">Cookie Policy</a>
          </div>
          <p>© 2025 Space Runner. All Rights Reserved.</p>
          <p className="mt-2 text-xs">Email: spacerunner.fun@gmail.com | Developer: Leo Dash</p>
        </footer>

        {/* AdSense Banner - Bottom of Landing Page removed */}
        <div className="w-full pb-8 flex flex-col items-center gap-4">
          {/* Ads removed */}
        </div>

      </div>
    </div>
  );
};

function App() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const { recordingDpr } = useStore();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Mobile detection for performance optimization
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => {
      const aspect = window.innerWidth / window.innerHeight;
      setIsMobile(aspect < 1.2 || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Render Social Bar globally
  React.useEffect(() => {
    // Force re-render of social bar if needed
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        useStore.getState().pauseGame();
      }
    };

    const handleBlur = () => {
      useStore.getState().pauseGame();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // AdMob removed - no ads in this version

  if (!isPlaying) {
    return <LandingPage onPlay={() => setIsPlaying(true)} />;
  }

  return (
    <div className="bg-black w-full h-screen flex items-center justify-center">
      <div className="w-full h-full select-none relative">
        <AdminToggle />
        <PauseMenu />
        <HUD />
        <Recorder canvasRef={canvasRef} />
        <Canvas
          ref={canvasRef}
          dpr={recordingDpr || (isMobile ? 1 : [1, 2])} // Cap at 1x for mobile performance
          gl={{
            antialias: !isMobile, // Disable antialias on mobile for performance
            stencil: false,
            depth: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: true // Required for capturing canvas stream
          }}
          camera={{ position: [0, 5.5, 8], fov: 60 }}
        >
          <CameraController />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default App;
