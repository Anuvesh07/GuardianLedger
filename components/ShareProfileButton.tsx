'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareProfileButtonProps {
  username: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showIcon?: boolean;
}

export default function ShareProfileButton({ 
  username, 
  variant = 'outline',
  size = 'default',
  showIcon = true 
}: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/user/${username}`;
    
    try {
      // Try to use native share API first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: 'My GuardianLedger Profile',
          text: `Check out my expenses on GuardianLedger! @${username}`,
          url: profileUrl,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setShowToast(true);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setCopied(false);
          setShowToast(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: try clipboard anyway
      try {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setShowToast(true);
        setTimeout(() => {
          setCopied(false);
          setShowToast(false);
        }, 3000);
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
      }
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleShare}
        className="relative"
      >
        {showIcon && (
          copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Share2 className="h-4 w-4 mr-2" />
          )
        )}
        {copied ? 'Link Copied!' : 'Share Profile'}
      </Button>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 px-6 py-3 bg-soft-mint text-white rounded-lg shadow-soft-lg flex items-center gap-2"
          >
            <Check className="h-5 w-5" />
            <div>
              <p className="font-semibold">Link copied to clipboard!</p>
              <p className="text-sm opacity-90">Share it with your friends</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
