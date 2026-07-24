import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, ShoppingBag, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/stores/useCart";
import { useSiteSettings } from "@/hooks/useSupabase";
import SearchDialog from "@/components/SearchDialog";

const navLinks = [
    { label: "Accueil", path: "/" },
    { label: "Catalogue", path: "/catalogue" },
    { label: "Blog", path: "/blog" },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { totalItems, setIsOpen } = useCart();
    const cartCount = totalItems();
    const { settings } = useSiteSettings();

    return (
        <header className="sticky top-0 z-50 w-full glass shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
                <Link to="/" className="flex items-center gap-2">
                    {settings?.logo_url ? (
                        <img
                            src={settings.logo_url}
                            alt={settings?.shop_name || "Logo"}
                            className="h-9 w-auto object-contain"
                        />
                    ) : (
                        <span className="font-display flex items-center gap-1.5 text-xl font-semibold tracking-tight text-foreground">
                            {settings?.shop_name || "JA Jí Yoū"}
                            <Sparkles className="h-4 w-4 text-secondary" />
                        </span>
                    )}
                </Link>

                <nav className="hidden items-center gap-1 rounded-full glass px-2 py-1.5 md:flex">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive
                                    ? "text-white"
                                    : "text-foreground/70 hover:text-foreground"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary to-secondary shadow-md"
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    {link.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-primary/10"
                        onClick={() => setSearchOpen(true)}
                    >
                        <Search className="h-5 w-5" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-primary/10"
                        onClick={() => setIsOpen(true)}
                    >
                        <ShoppingBag className="h-5 w-5" />
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.div
                                    key={cartCount}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                    className="absolute -right-1 -top-1"
                                >
                                    <Badge className="h-5 w-5 justify-center rounded-full bg-gradient-to-r from-primary to-secondary p-0 text-[11px] text-white shadow-sm">
                                        {cartCount}
                                    </Badge>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-primary/10 md:hidden"
                        onClick={() => setMobileOpen((o) => !o)}
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-1 overflow-hidden border-t border-white/30 glass px-4 py-4 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `rounded-xl px-3 py-3 text-sm font-semibold ${isActive
                                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                                        : "text-foreground/80 hover:bg-primary/10"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </motion.nav>
                )}
            </AnimatePresence>

            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </header>
    );
}