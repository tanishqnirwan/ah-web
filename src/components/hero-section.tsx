'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaitlistForm } from './waitlist-form';

export function HeroSection() {
  const [animationPhase, setAnimationPhase] = useState('initial');
  const [showStaticLogo, setShowStaticLogo] = useState(false);
  const [showHeroContent, setShowHeroContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [gifSrc, setGifSrc] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  const videos = ['bg1.mp4', 'bg2.mp4', 'bg3.mp4'];

  // Animation timing
  const timeUntilSlide = 2500; // Time before GIF starts sliding
  const slideDuration = 1200; // Duration of slide animation
  const playAtTopDuration = 2000; // How long GIF plays at final position

  // Animation target position (where GIF slides to)
  const animationTargetPosition = {
    desktop: {
      top: '-20px',
      left: '50vw',
      transform: 'translate(-50%, 0)',
      width: '220px',
    },
    mobile: {
      top: '100px',
      left: '50vw', 
      transform: 'translate(-50%, 0)',
      width: '140px',
    }
  };

  // Final static logo position
  const logoPosition = {
    desktop: {
      top: '50px',
      left: '50vw',
      transform: 'translate(-50%, 0)',
      width: '220px',
    },
    mobile: {
      top: '150px',
      left: '50vw', 
      transform: 'translate(-50%, 0)',
      width: '140px',
    }
  };

  const currentAnimationTarget = isMobile ? animationTargetPosition.mobile : animationTargetPosition.desktop;
  const currentLogoPosition = isMobile ? logoPosition.mobile : logoPosition.desktop;

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Force GIF to restart from beginning
  useEffect(() => {
    const timestamp = Date.now();
    setGifSrc(`/logo/ahoumTextWhite.gif?t=${timestamp}`);
  }, []);

  // Simple video cycling
  useEffect(() => {
    // Start first video immediately
    const firstVideo = videoRefs.current[0];
    if (firstVideo) {
      firstVideo.currentTime = 0;
      firstVideo.play().catch(console.error);
    }
  }, []);

  // Handle video transitions
  const handleVideoEnd = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
    
    // Start next video immediately
    const nextVideo = videoRefs.current[nextIndex];
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(console.error);
    }
  };

  // Boot animation sequence
  useEffect(() => {
    if (!gifSrc) return;
    
    // Disable scroll during animation
    document.body.style.overflow = 'hidden';
    
    const animationSequence = async () => {
      // Phase 1: Start playing GIF in center
      setAnimationPhase('playing');
      
      // Phase 2: Wait, then start sliding and show hero content
      await new Promise(resolve => setTimeout(resolve, timeUntilSlide));
      setAnimationPhase('sliding');
      setShowHeroContent(true);
      
      // Phase 3: GIF reaches final position
      await new Promise(resolve => setTimeout(resolve, slideDuration));
      setAnimationPhase('playingAtTop');
      
      // Phase 4: GIF finishes at top, show static logo
      await new Promise(resolve => setTimeout(resolve, playAtTopDuration));
      setShowStaticLogo(true);
      setAnimationPhase('completed');
      
      // Phase 5: Re-enable scroll
      await new Promise(resolve => setTimeout(resolve, 300));
      document.body.style.overflow = 'unset';
    };

    animationSequence();

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [gifSrc, timeUntilSlide, slideDuration, playAtTopDuration]);

  return (
    <section className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Background Videos with Fade Transition */}
      {videos.map((videoSrc, index) => (
        <video
          key={index}
          ref={(el) => { videoRefs.current[index] = el; }}
          muted
          playsInline
          loop={false}
          onEnded={handleVideoEnd}
          className="absolute inset-0 object-cover transition-opacity duration-1000 ease-in-out"
          style={{ 
            width: '120%',
            height: '120%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: index === currentVideoIndex ? 0.6 : 0
          }}
        >
          <source src={`/${videoSrc}`} type="video/mp4" />
        </video>
      ))}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      {/* Dark Blurred Overlay */}
      <AnimatePresence>
        {animationPhase !== 'sliding' && animationPhase !== 'playingAtTop' && animationPhase !== 'completed' && (
          <motion.div
            className="fixed inset-0 z-[199] bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* GIF Animation */}
      <AnimatePresence>
        {animationPhase !== 'completed' && gifSrc && (
          <motion.img
            src={gifSrc}
            alt="Ahoum Logo Animation"
            className="fixed z-[9999] pointer-events-none"
            style={{
              top: (animationPhase === 'sliding' || animationPhase === 'playingAtTop') ? 
                currentAnimationTarget.top : 
                '50vh',
              left: (animationPhase === 'sliding' || animationPhase === 'playingAtTop') ? 
                currentAnimationTarget.left : 
                '50vw',
              transform: (animationPhase === 'sliding' || animationPhase === 'playingAtTop') ?
                currentAnimationTarget.transform :
                'translate(-50%, -50%)',
              width: (animationPhase === 'sliding' || animationPhase === 'playingAtTop') ?
                currentAnimationTarget.width :
                (isMobile ? '280px' : '480px'),
              height: 'auto',
              transition: animationPhase === 'sliding' ? 
                `all ${slideDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` : 
                'opacity 0.3s ease',
              opacity: animationPhase === 'initial' ? 0 : 1,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Static White Logo */}
      {showStaticLogo && (
        <motion.img
          src="/logo/cursiveLogoWhite.png"
          alt="Ahoum"
          className="absolute z-[9999] pointer-events-none"
          style={currentLogoPosition}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}

      
      {/* Hero Content - only shows after animation completes */}
      {showHeroContent && (
        <motion.div
          className="p-4 max-w-7xl mx-auto relative z-30 w-full h-screen flex flex-col justify-center items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.h1 
            className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 mb-8 font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Next Evolution <br /> Made Simple
          </motion.h1>
          
          <motion.p 
            className="mt-4 font-normal text-base md:text-lg text-neutral-300 max-w-2xl text-center mx-auto mb-12 font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Small daily rituals can spark life-changing shifts. Let ahoum create a journey that&apos;s uniquely yours.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button 
              className="border-2 border-white/70 text-white hover:bg-white hover:text-black font-semibold text-lg px-10 py-4 rounded-full transition-all font-sans"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsWaitlistOpen(true)}
            >
              Join Waitlist
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Waitlist Form Modal */}
      <WaitlistForm 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
      />
    </section>
  );
}