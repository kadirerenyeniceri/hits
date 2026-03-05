import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { ROUTE_PATHS } from '@/lib/index';
import { IMAGES } from '@/assets/images';
import { springPresets, fadeInUp } from '@/lib/motion';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url(${IMAGES.CARD_BG_1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/70" />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center px-4 py-12 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPresets.gentle}
      >
        <motion.div
          className="mb-8 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springPresets.gentle, delay: 0.1 }}
        >
          <div
            className="w-32 h-32 rounded-3xl opacity-40"
            style={{
              backgroundImage: `url(${IMAGES.MOBILE_UI_3})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4 text-foreground tracking-tight"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ ...springPresets.gentle, delay: 0.2 }}
        >
          QR Card Game
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springPresets.gentle, delay: 0.3 }}
        >
          Scan your cards to unlock exclusive content
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springPresets.gentle, delay: 0.4 }}
        >
          <Link to={ROUTE_PATHS.SCAN}>
            <motion.button
              className="group relative px-16 py-8 bg-primary text-primary-foreground rounded-3xl font-bold text-2xl md:text-3xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={springPresets.snappy}
              style={{
                boxShadow:
                  '0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent), inset 0 1px 0 rgba(255,255,255, 0.1), inset 0 -1px 0 rgba(0,0,0, 0.1)',
              }}
            >
              <span className="relative z-10 flex items-center gap-4">
                <Play className="w-8 h-8" fill="currentColor" />
                PLAY
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20"
                initial={false}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </motion.div>

        <motion.p
          className="mt-8 text-sm text-muted-foreground font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...springPresets.gentle, delay: 0.6 }}
        >
          Tap PLAY to start scanning
        </motion.p>
      </motion.div>
    </div>
  );
}
