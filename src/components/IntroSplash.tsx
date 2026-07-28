import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSupabase";

const SPARKLE_SPOTS = [
    { top: "15%", left: "18%", delay: 0, size: 14 },
    { top: "22%", left: "80%", delay: 0.3, size: 10 },
    { top: "72%", left: "14%", delay: 0.5, size: 12 },
    { top: "78%", left: "78%", delay: 0.2, size: 16 },
    { top: "10%", left: "50%", delay: 0.6, size: 10 },
    { top: "60%", left: "90%", delay: 0.4, size: 12 },
    { top: "85%", left: "45%", delay: 0.1, size: 14 },
    { top: "45%", left: "8%", delay: 0.7, size: 10 },
];

export default function IntroSplash({ onFinish }: { onFinish?: () => void }) {
    const { settings } = useSiteSettings();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onFinish?.();
        }, 2500);
        return () => clearTimeout(timer);
    }, [onFinish]);

    const siteName = settings?.site_name?.trim() || "JA Jí Yoū";

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary"
                >
                    <div className="blob -left-24 -top-24 h-72 w-72 bg-white/20" />
                    <div className="blob -right-24 bottom-0 h-80 w-80 bg-white/10" style={{ animationDelay: "2s" }} />

                    {SPARKLE_SPOTS.map((s, i) => (
                        <motion.span
                            key={i}
                            className="absolute text-white/90"
                            style={{ top: s.top, left: s.left }}
                            initial={{ opacity: 0, scale: 0, rotate: 0 }}
                            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.6], rotate: 180 }}
                            transition={{
                                duration: 1.6,
                                delay: s.delay,
                                repeat: Infinity,
                                repeatDelay: 0.4,
                            }}
                        >
                            <Sparkles size={s.size} strokeWidth={1.5} />
                        </motion.span>
                    ))}

                    <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.6, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/15 shadow-2xl backdrop-blur-md ring-1 ring-white/30 sm:h-28 sm:w-28"
                        >
                            {settings?.logo_url ? (
                                <img
                                    src={settings.logo_url}
                                    alt={siteName}
                                    className="h-14 w-14 object-contain sm:h-16 sm:w-16"
                                />
                            ) : (
                                <Sparkles className="h-10 w-10 text-white" />
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="font-display text-3xl font-semibold text-white sm:text-4xl">
                                {siteName}
                            </span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="text-sm font-medium uppercase tracking-[0.3em] text-white/80"
                            >
                                Bienvenue
                            </motion.span>
                        </motion.div>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.6, delay: 0.4, ease: "easeInOut" }}
                            className="h-[3px] w-28 origin-left rounded-full bg-white/60 sm:w-36"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}