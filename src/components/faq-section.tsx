'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqData = [
  {
    question: "What makes Ahoum different from meditation apps?",
    answer: "Ahoum isn't a meditation app - it's an operating system for spiritual growth. We compress a 25-year inner growth process into 3 years using AI diagnostics, ancient wisdom, and human facilitators."
  },
  {
    question: "How does the AI personalization work?",
    answer: "Our 60,000-point algorithm creates your unique spiritual blueprint through conversation-style diagnostics, then personalizes your path through practices, content, and community connections."
  },
  {
    question: "Who is Ahoum for?",
    answer: "Anyone seeking spiritual growth - from therapy seekers and wellness enthusiasts to those experiencing suffering. We also serve B2B clients including wellness coaches and HR departments."
  },
  {
    question: "When will Ahoum be available?",
    answer: "We're currently in development. Join our waitlist to be notified when we launch and get early access to the platform."
  }
];

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  isInView: boolean;
}

function AccordionItem({ question, answer, isOpen, onToggle, index, isInView }: AccordionItemProps) {
  return (
    <motion.div 
      className="border-b border-neutral-700/50 last:border-b-0"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <button
        className="w-full py-6 px-6 text-left flex justify-between items-center hover:bg-neutral-800/20 transition-colors duration-200"
        onClick={onToggle}
      >
        <span className="text-white font-medium font-sans pr-4">
          {question}
        </span>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDownIcon className="w-5 h-5 text-neutral-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <p className="text-neutral-300 leading-relaxed font-sans">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section ref={ref} className="py-20 px-4 bg-black/[0.96]">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-sans">
            Frequently Asked
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {" "}Questions
            </span>
          </h2>
        </motion.div>

        {/* FAQ Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-neutral-900/30 to-neutral-800/20 rounded-2xl border border-neutral-700/30 overflow-hidden"
        >
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openItems[index] || false}
              onToggle={() => toggleItem(index)}
              index={index}
              isInView={isInView}
            />
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-neutral-400 mb-4 font-sans">
            Still have questions? Email us at{' '}
            <a href="mailto:aloha@ahoum.com" className="text-primary hover:underline">
              aloha@ahoum.com
            </a>
          </p>
        </motion.div>

      </div>
    </section>
  );
}