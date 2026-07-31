import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X, Sparkles } from "lucide-react";

const DISMISSED_KEY = "jayou-pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isStandalone() {
    const isDisplayModeStandalone =
        window.matchMedia("(display-mode: standalone)").matches;
    // Safari iOS
    const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    return isDisplayModeStandalone || isIosStandalone;
}

export default function InstallPWAPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Deja installee, ou l'utilisateur a deja repondu (oui ou non) : on ne montre plus rien.
        if (isStandalone() || localStorage.getItem(DISMISSED_KEY)) {
            return;
        }

        function handleBeforeInstallPrompt(e: Event) {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setVisible(true);
        }

        function handleAppInstalled() {
            localStorage.setItem(DISMISSED_KEY, "1");
            setVisible(false);
            setDeferredPrompt(null);
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    async function handleAccept() {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        localStorage.setItem(DISMISSED_KEY, "1");
        setVisible(false);
        setDeferredPrompt(null);
    }

    function handleDecline() {
        localStorage.setItem(DISMISSED_KEY, "1");
        setVisible(false);
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ type: "spring", damping: 24, stiffness: 260 }}
                    className="fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-3 md:px-4 md:pt-4"
                >
                    <div className="glass flex w-full max-w-xl items-center gap-3 rounded-2xl px-4 py-3 shadow-premium-lg md:gap-4 md:px-5 md:py-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-md">
                            <Sparkles className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-foreground">
                                Installer l'application ?
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Accedez a la boutique en un tap depuis votre ecran d'accueil.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                onClick={handleDecline}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
                                aria-label="Refuser l'installation"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Oui
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}