'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-black/[0.98] border-t border-neutral-800/50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image 
                src="/logo/cursiveLogoWhite.png" 
                alt="Ahoum" 
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-neutral-400 text-sm font-sans leading-relaxed max-w-sm">
              The Operating System for the Soul. We compress a 25-year inner growth process into 3 years, blending ancient wisdom with modern AI technology.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold font-sans">Contact</h3>
            <div className="space-y-2">
              <a 
                href="mailto:aloha@ahoum.com" 
                className="block text-neutral-400 hover:text-primary transition-colors text-sm font-sans"
              >
                aloha@ahoum.com
              </a>
              <p className="text-neutral-500 text-sm font-sans">
                We&apos;d love to hear from you
              </p>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800/50 pt-8">
          
          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <motion.p 
              className="text-neutral-500 text-sm font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              © 2025 Ahoum. All rights reserved.
            </motion.p>

            {/* Additional Links */}
            <motion.div 
              className="flex space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <a href="#privacy" className="text-neutral-500 hover:text-primary transition-colors text-sm font-sans">
                Privacy Policy
              </a>
              <a href="#terms" className="text-neutral-500 hover:text-primary transition-colors text-sm font-sans">
                Terms of Service
              </a>
            </motion.div>

          </div>

          {/* Vision Statement */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-neutral-600 text-xs font-sans italic max-w-2xl mx-auto">
              &ldquo;Building the future of human consciousness through the intersection of ancient wisdom and cutting-edge technology&rdquo;
            </p>
          </motion.div>

        </div>

      </div>
    </footer>
  );
}