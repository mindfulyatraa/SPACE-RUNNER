
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
import { AdSenseBanner } from './components/Ads/AdSenseBanner';

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

    // Fixed camera positions
    const cameraY = isMobile ? 8.0 : 5.5;   // Height based on device
    const cameraZ = isMobile ? 14.0 : 8.0;  // Distance based on device
    const lookDistance = isMobile ? -25 : -30; // View distance

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
    // Initialize AdSense ads
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
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
            <div className="absolute inset-0 bg-white/30 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
          </button>
        </header>

        {/* AdSense Banner - Top of Landing Page */}
        <div className="w-full mb-12 flex justify-center">
          <AdSenseBanner slot="7961728996" style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px' }} />
        </div>

        {/* Main Content / Blog Section */}
        <main className="w-full bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl mb-16">

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl md:text-4xl font-cyber text-cyan-400 mb-6 border-b border-cyan-500/30 pb-4">
              Welcome to the Future of Arcade Running
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed space-y-6">
              <p>
                Imagine a universe where speed is the only currency and survival is the only goal. <strong>Space Runner</strong> isn't just another endless runner; it's a high-octane journey through a synthwave-soaked galaxy.
              </p>
              <p>
                We built Space Runner for those who crave the nostalgia of 80s arcade games but demand the visual fidelity of modern web technologies. Powered by <span className="text-purple-400 font-semibold">React Three Fiber</span>, every frame is a visual treat, rendering a 3D world that reacts to your every move.
              </p>
            </div>
          </section>

          {/* AdSense Banner - Middle of Content */}
          <div className="w-full mb-12 flex justify-center">
            <AdSenseBanner slot="7961728996" format="auto" responsive={true} style={{ display: 'block', width: '100%' }} />
          </div>

          {/* The Story */}
          <section className="mb-12 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-500">🌌</span> The Story
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                You are a rogue pilot navigating the <strong>Neon Highway</strong>, a treacherous interstellar route connecting the outer rim colonies. The path is littered with energy barriers, quantum debris, and void gaps. Your mission? Go as far as you can. There is no finish line—only the pursuit of a higher score and the thrill of the run.
              </p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-yellow-400">⚡</span> Key Features
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span><strong>Infinite Procedural World:</strong> No two runs are ever the same.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span><strong>Responsive Controls:</strong> Smooth handling on both Desktop and Mobile.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span><strong>Stunning 3D Graphics:</strong> Neon glows, dynamic lighting, and particle effects.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span><strong>Global Leaderboard:</strong> Compete with players worldwide (Coming Soon).</span>
                </li>
              </ul>
            </div>
          </section>

          {/* How to Play */}
          <section className="mb-12">
            <h2 className="text-3xl md:text-4xl font-cyber text-cyan-400 mb-8 border-b border-cyan-500/30 pb-4">
              How to Master the Void
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-cyan-500/50 transition-colors">
                <div className="text-4xl mb-4">⬅️ ➡️</div>
                <h4 className="text-xl font-bold text-white mb-2">Steer</h4>
                <p className="text-gray-400">Use <strong>Left/Right Arrow Keys</strong> or <strong>Swipe</strong> on mobile to switch lanes instantly.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-colors">
                <div className="text-4xl mb-4">⬆️</div>
                <h4 className="text-xl font-bold text-white mb-2">Jump</h4>
                <p className="text-gray-400">Press <strong>Up Arrow</strong> or <strong>Swipe Up</strong> to leap over low obstacles and gaps.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-pink-500/50 transition-colors">
                <div className="text-4xl mb-4">🛡️</div>
                <h4 className="text-xl font-bold text-white mb-2">Survive</h4>
                <p className="text-gray-400">Avoid red barriers and falling into the void. One mistake and it's game over.</p>
              </div>
            </div>
          </section>

          {/* SEO Keywords (Hidden visually but present for structure) */}
          <div className="mt-12 pt-8 border-t border-white/10 text-sm text-gray-500 text-center">
            <p className="mb-2">Popular Searches:</p>
            <p className="italic opacity-70">
              space runner game, free online arcade game, 3d browser game, neon cyberpunk runner, sci-fi endless runner, play space games online, react three fiber game showcase
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-gray-500 text-sm text-center pb-8 w-full max-w-4xl border-t border-white/5 pt-8">
          <div className="flex justify-center gap-6 mb-4">
            <a href="/privacy.html" className="hover:text-cyan-300 transition-colors" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyan-300 transition-colors">Contact Support</a>
          </div>
          <p>© 2025 Space Runner. Crafted with ❤️ for the Web.</p>
        </footer>

        {/* AdSense Banner - Bottom of Landing Page */}
        <div className="w-full pb-8 flex justify-center">
          <AdSenseBanner slot="7961728996" style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px' }} />
        </div>

      </div>
    </div>
  );
};

function App() {
  const [isPlaying, setIsPlaying] = React.useState(false);

  // AdMob removed - no ads in this version

  if (!isPlaying) {
    return <LandingPage onPlay={() => setIsPlaying(true)} />;
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      <HUD />
      <Canvas
        dpr={typeof window !== 'undefined' && /Android|iPhone|iPad/i.test(navigator.userAgent) ? [1.0, 1.5] : [1, 2]} // IMPROVED: Better quality on mobile
        gl={{
          antialias: true, // IMPROVED: Enable antialiasing for smoother edges
          stencil: false,
          depth: true,
          powerPreference: typeof window !== 'undefined' && /Android|iPhone|iPad/i.test(navigator.userAgent) ? "high-performance" : "high-performance",
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
    </div>
  );
}

export default App;
