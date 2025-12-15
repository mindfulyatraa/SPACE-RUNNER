
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
                Imagine a universe where speed is the only currency and survival is the only goal. <strong>Space Runner</strong> isn't just another endless runner; it's a high-octane journey through a synthwave-soaked galaxy. This free-to-play browser game combines cutting-edge 3D graphics with intuitive gameplay mechanics to deliver an unforgettable gaming experience.
              </p>
              <p>
                We built Space Runner for those who crave the nostalgia of 80s arcade games but demand the visual fidelity of modern web technologies. Powered by <span className="text-purple-400 font-semibold">React Three Fiber</span> and WebGL, every frame is a visual treat, rendering a fully interactive 3D world that reacts to your every move. Whether you're a casual player looking for quick entertainment or a hardcore gamer chasing high scores, Space Runner offers endless replayability with its procedurally generated levels and increasing difficulty curve.
              </p>
              <p>
                What makes Space Runner special is its accessibility. There's no download required, no installation process, and no hidden fees. Simply open your browser, visit our website, and start playing instantly. The game works seamlessly across desktop computers, laptops, tablets, and smartphones, ensuring you can enjoy the neon-lit cosmos wherever you are.
              </p>
            </div>
          </section>

          {/* AdSense Banner - Middle of Content */}
          <div className="w-full mb-12 flex justify-center">
            <AdSenseBanner slot="7961728996" format="auto" responsive={true} style={{ display: 'block', width: '100%' }} />
          </div>

          {/* Detailed Game Guide */}
          <section className="mb-12">
            <h2 className="text-3xl md:text-4xl font-cyber text-cyan-400 mb-8 border-b border-cyan-500/30 pb-4">
              Complete Game Guide for Beginners
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed space-y-6">
              <h3 className="text-2xl font-bold text-white mt-6 mb-4">Getting Started</h3>
              <p>
                Starting your Space Runner journey is incredibly simple. Click the "LETS PLAY" button on the homepage, and you'll be immediately transported into the neon-lit cosmic highway. The game loads instantly in your browser without any additional plugins or downloads. Your character automatically moves forward, and your job is to navigate left, right, and jump to avoid obstacles.
              </p>

              <h3 className="text-2xl font-bold text-white mt-6 mb-4">Understanding Game Mechanics</h3>
              <p>
                Space Runner features a three-lane running system. Your character runs continuously forward on one of three parallel lanes in space. As you progress, various obstacles appear in your path - some are stationary energy barriers, while others are dynamic quantum debris that require precise timing to avoid. The game speed gradually increases as you run farther, testing your reflexes and concentration.
              </p>
              <p>
                The scoring system is straightforward yet rewarding. You earn points for every second survived and bonus points for successfully avoiding obstacles at high speeds. The longer you survive, the higher your score multiplier becomes. Your high score is automatically saved in your browser's local storage, allowing you to track your progress and compete against yourself.
              </p>

              <h3 className="text-2xl font-bold text-white mt-6 mb-4">Obstacle Types Explained</h3>
              <p>
                <strong>Energy Barriers:</strong> These glowing red obstacles block entire lanes and require you to switch lanes quickly. They appear with increasing frequency as the game progresses.
              </p>
              <p>
                <strong>Void Gaps:</strong> Sometimes the cosmic highway has missing sections. Jump over these gaps to avoid falling into the endless void of space.
              </p>
              <p>
                <strong>Quantum Debris:</strong> Floating space debris that moves in patterns. Learn to predict their movement and time your lane changes accordingly.
              </p>

              <h3 className="text-2xl font-bold text-white mt-6 mb-4">Controls Mastery</h3>
              <p>
                <strong>Desktop Controls:</strong> Use the Left and Right arrow keys to switch between the three lanes. Press the Up arrow key or Spacebar to jump over low obstacles and gaps. The controls are highly responsive, registering inputs instantly to give you precise control.
              </p>
              <p>
                <strong>Mobile Controls:</strong> Swipe left or right on your screen to change lanes. Swipe up to jump. The touch controls are optimized for smartphones and tablets, providing the same level of precision as keyboard controls.
              </p>

              <h3 className="text-2xl font-bold text-white mt-6 mb-4">Progression and Difficulty</h3>
              <p>
                Space Runner implements a dynamic difficulty system. The game starts at a comfortable pace, allowing beginners to learn the mechanics. As you progress, the speed increases incrementally, and obstacles appear more frequently in complex patterns. Around the 30-second mark, you'll notice a significant speed boost. At 60 seconds, the game enters "Ultra Mode" where only the most skilled players can survive.
              </p>
            </div>
          </section>

          {/* The Story & Key Features */}
          <section className="mb-12 grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-500">🌌</span> The Story
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                You are a rogue pilot navigating the <strong>Neon Highway</strong>, a treacherous interstellar route connecting the outer rim colonies. The path is littered with energy barriers, quantum debris, and void gaps. Your mission? Go as far as you can. There is no finish line—only the pursuit of a higher score and the thrill of the run.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                In the year 2247, the Neon Highway became the fastest trade route through deep space, but it's also the most dangerous. Pirates, cosmic storms, and unstable wormholes make every journey a test of skill and courage. You've been hired to test the route's viability, and every successful run brings humanity closer to establishing permanent colonies beyond the solar system.
              </p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-yellow-400">⚡</span> Key Features Detailed
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span><strong>Infinite Procedural World:</strong> Our advanced algorithm generates unique obstacle patterns for every playthrough. No two runs are identical, ensuring endless replayability and fresh challenges every time you play.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span><strong>Responsive Controls:</strong> Sub-10ms input latency on modern browsers ensures your commands are executed instantly. Optimized for both keyboard and touch controls with smooth, lag-free performance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span><strong>Stunning 3D Graphics:</strong> Real-time WebGL rendering powered by Three.js delivers console-quality visuals in your browser. Features include dynamic neon lighting, particle effects, post-processing bloom, and chromatic aberration.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span><strong>Cross-Platform Compatibility:</strong> Works on Windows, macOS, Linux, Android, and iOS. Optimized for Chrome, Firefox, Safari, and Edge browsers.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* How to Play */}
          <section className="mb-12">
            <h2 className="text-3xl md:text-4xl font-cyber text-cyan-400 mb-8 border-b border-cyan-500/30 pb-4">
              How to Master the Void
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center mb-8">
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-cyan-500/50 transition-colors">
                <div className="text-4xl mb-4">⬅️ ➡️</div>
                <h4 className="text-xl font-bold text-white mb-2">Steer</h4>
                <p className="text-gray-400">Use <strong>Left/Right Arrow Keys</strong> or <strong>Swipe</strong> on mobile to switch lanes instantly. Master quick lane changes to avoid obstacles.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-colors">
                <div className="text-4xl mb-4">⬆️</div>
                <h4 className="text-xl font-bold text-white mb-2">Jump</h4>
                <p className="text-gray-400">Press <strong>Up Arrow</strong> or <strong>Swipe Up</strong> to leap over low obstacles and gaps. Timing is crucial for successful jumps.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-pink-500/50 transition-colors">
                <div className="text-4xl mb-4">🛡️</div>
                <h4 className="text-xl font-bold text-white mb-2">Survive</h4>
                <p className="text-gray-400">Avoid red barriers and falling into the void. One mistake and it's game over. Stay focused and keep your reflexes sharp!</p>
              </div>
            </div>
          </section>

          {/* Advanced Strategies */}
          <section className="mb-12">
            <h2 className="text-3xl md:text-4xl font-cyber text-cyan-400 mb-8 border-b border-cyan-500/30 pb-4">
              Advanced Strategies for High Scores
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed space-y-6">
              <h3 className="text-2xl font-bold text-white mt-6 mb-4">Expert Tips to Maximize Your Score</h3>
              <p>
                <strong>1. Stay in the Middle Lane:</strong> Whenever possible, position yourself in the center lane. This gives you maximum flexibility to dodge left or right when obstacles appear. The middle lane provides the best reaction time for unexpected patterns.
              </p>
              <p>
                <strong>2. Anticipate, Don't React:</strong> Top players don't just react to obstacles—they anticipate them. Watch the horizon ahead and plan your moves 2-3 seconds in advance. This proactive approach becomes essential as the game speed increases.
              </p>
              <p>
                <strong>3. Develop Pattern Recognition:</strong> While levels are procedurally generated, certain obstacle combinations repeat. After playing for a while, you'll start recognizing patterns like "left-middle-right barrier sequences" or "gap followed by debris." Learning these patterns dramatically improves survival time.
              </p>
              <p>
                <strong>4. Perfect Your Jump Timing:</strong> Jumping too early or too late results in collision. Practice timing your jumps so you press the jump key exactly when you're about one full character-length away from the gap or low obstacle. This becomes muscle memory with practice.
              </p>

              <h3 className="text-2xl font-bold text-white mt-6 mb-4">Common Mistakes to Avoid</h3>
              <p>
                <strong>Panic Lane Switching:</strong> New players often switch lanes repeatedly when panicked, which usually leads to colliding with obstacles in adjacent lanes. Stay calm and make deliberate, single lane changes.
              </p>
              <p>
                <strong>Looking at Your Character:</strong> Don't focus on your runner—watch the obstacles ahead. Your peripheral vision will naturally track your character's position while your main focus should be on upcoming hazards.
              </p>
              <p>
                <strong>Playing When Tired:</strong> Space Runner requires sharp reflexes and concentration. Playing when tired significantly reduces performance. Take breaks every 15-20 minutes to maintain peak performance.
              </p>

              <h3 className="text-2xl font-bold text-white mt-6 mb-4">Performance Optimization Tips</h3>
              <p>
                For the best gaming experience, close unnecessary browser tabs and applications that might consume system resources. Use a wired internet connection when possible to minimize input lag. On mobile devices, enable "Do Not Disturb" mode to prevent notification interruptions during gameplay.
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-3xl md:text-4xl font-cyber text-cyan-400 mb-8 border-b border-cyan-500/30 pb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-black/30 p-6 rounded-xl border border-cyan-500/20">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">What is Space Runner?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Space Runner is a free-to-play, browser-based 3D endless runner game set in a futuristic neon-lit space environment. Built with modern web technologies like React Three Fiber and WebGL, it delivers high-quality graphics and smooth gameplay without requiring any downloads or installations.
                </p>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-purple-500/20">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">Can I play on mobile devices?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Absolutely! Space Runner is fully optimized for both iOS and Android devices. The game features responsive touch controls (swipe gestures) and automatically adjusts graphics quality based on your device's capabilities to ensure smooth 60fps gameplay on smartphones and tablets.
                </p>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-cyan-500/20">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">Which browsers are supported?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Space Runner works best on modern browsers including Google Chrome (version 90+), Mozilla Firefox (version 88+), Safari (version 14+), and Microsoft Edge (version 90+). We recommend using the latest browser version for optimal performance and the best visual experience.
                </p>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-purple-500/20">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">Is Space Runner completely free?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Yes! Space Runner is 100% free to play with no hidden costs, in-app purchases, or pay-to-win mechanics. We display non-intrusive advertisements to support development and server costs, but the core game experience is completely free and accessible to everyone.
                </p>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-cyan-500/20">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">Why is my game lagging?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Performance issues are usually caused by: (1) Running too many browser tabs or applications simultaneously - try closing unused tabs; (2) Outdated graphics drivers - update your GPU drivers; (3) Hardware limitations - older devices may struggle with 3D graphics; (4) Poor internet connection affecting asset loading. For best results, use a modern device with a dedicated graphics card or recent integrated GPU.
                </p>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-purple-500/20">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">How are high scores saved?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Your high scores are automatically saved in your browser's local storage. This means your scores persist across gaming sessions on the same device and browser. However, if you clear your browser cache or play on a different device, your scores won't transfer. We're working on a user account system for cross-device score synchronization in future updates.
                </p>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-cyan-500/20">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">What are the minimum system requirements?</h3>
                <p className="text-gray-300 leading-relaxed">
                  <strong>Minimum:</strong> Dual-core processor (2.0GHz+), 4GB RAM, integrated graphics (Intel HD 4000 or equivalent), modern browser with WebGL support. <strong>Recommended:</strong> Quad-core processor (2.5GHz+), 8GB RAM, dedicated graphics card (NVIDIA GTX 1050 or AMD RX 560 equivalent), latest browser version. Mobile: iPhone 8+ / iPad 2018+ for iOS; Android 8.0+ with Snapdragon 660 or equivalent chipset.
                </p>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-purple-500/20">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">Will there be multiplayer mode?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Yes! Multiplayer features are on our development roadmap. We're planning to implement global leaderboards first, followed by real-time competitive racing modes where you can challenge other players. Join our community and follow updates to be notified when these features launch.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Details */}
          <section className="mb-12">
            <h2 className="text-3xl md:text-4xl font-cyber text-cyan-400 mb-8 border-b border-cyan-500/30 pb-4">
              Technical Excellence
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed space-y-6">
              <p>
                Space Runner represents the cutting edge of browser-based gaming technology. We leverage React Three Fiber, a React renderer for Three.js, to create stunning 3D graphics that run at 60 frames per second on most modern devices. The game engine uses WebGL 2.0 for hardware-accelerated rendering, ensuring smooth performance even during intense gameplay moments.
              </p>
              <p>
                Our procedural generation system uses advanced algorithms to create infinite, unique levels. Each obstacle placement is calculated based on difficulty curves, ensuring the game remains challenging but fair. The physics engine handles collision detection with sub-pixel accuracy, giving you precise control over your spacecraft.
              </p>
              <p>
                We've optimized the game for minimal load times and maximum performance. The entire game loads in under 3 seconds on standard broadband connections. Asset compression, code splitting, and lazy loading techniques ensure efficient bandwidth usage. The game state management system uses Zustand for lightning-fast state updates without performance overhead.
              </p>
            </div>
          </section>

          {/* Browser Compatibility */}
          <section className="mb-12">
            <h2 className="text-3xl md:text-4xl font-cyber text-cyan-400 mb-8 border-b border-cyan-500/30 pb-4">
              Browser & Device Compatibility
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-cyan-900/20 to-black p-6 rounded-xl border border-cyan-500/30">
                <h3 className="text-xl font-bold text-white mb-4">Desktop Browsers</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Google Chrome 90+ (Recommended)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Mozilla Firefox 88+
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Microsoft Edge 90+
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Safari 14+ (macOS)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">⚠</span> Opera 76+ (Limited testing)
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-black p-6 rounded-xl border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-4">Mobile Devices</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> iOS 14+ (Safari, Chrome)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Android 8.0+ (Chrome, Firefox)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> iPadOS 14+
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Android Tablets
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-gray-400 mt-6 text-center italic">
              Note: Older devices may experience reduced graphics quality or lower frame rates. Ensure WebGL is enabled in your browser settings for optimal experience.
            </p>
          </section>

          {/* SEO Keywords */}
          <div className="mt-12 pt-8 border-t border-white/10 text-sm text-gray-500 text-center">
            <p className="mb-2">Popular Searches:</p>
            <p className="italic opacity-70">
              space runner game, free online arcade game, 3d browser game, neon cyberpunk runner, sci-fi endless runner, play space games online, react three fiber game showcase, WebGL space game, best browser games 2024, mobile space runner
            </p>
          </div>

        </main>

        {/* Footer */}
        <footer className="text-gray-500 text-sm text-center pb-8 w-full max-w-4xl border-t border-white/5 pt-8">
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

        {/* AdSense Banner - Bottom of Landing Page */}
        <div className="w-full pb-8 flex justify-center">
          <AdSenseBanner slot="7961728996" style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px' }} />
        </div>

      </div>
    </div>
  );
};

import { Recorder } from './components/UI/Recorder';
import { AdminToggle } from './components/UI/AdminToggle';
import { PauseMenu } from './components/UI/PauseMenu';

function App() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const { recordingDpr } = useStore();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

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
          dpr={recordingDpr || [1, 3]} // Allow high quality (up to 3x) when not recording lag
          gl={{
            antialias: true,
            stencil: false,
            depth: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: true // Required for capturing canvas stream
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
    </div>
  );
}

export default App;
