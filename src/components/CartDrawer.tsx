import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/stores/useCart";
import { getCartWhatsAppLink } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
    const {
        items,
        isOpen,
        setIsOpen,
        removeItem,
        updateQuantity,
        totalPrice,
        clearCart,
    } = useCart();

    const whatsappLink = getCartWhatsAppLink(
        items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
        }))
    );

    const isEmpty = items.length === 0;
    const total = totalPrice();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay de fond */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panier latéral */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 26, stiffness: 220 }}
                        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-premium-xl border-l border-border/50"
                    >
                        {/* En-tête */}
                        <div className="flex items-center justify-between border-b border-border/50 px-6 py-5">
                            <h2 className="font-display text-xl font-semibold text-foreground">
                                Votre panier
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="magnetic-btn rounded-full p-2 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Contenu principal */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {isEmpty ? (
                                <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                                    <div className="rounded-full bg-muted p-6 animate-float-soft">
                                        <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Votre panier est tristement vide
                                    </p>
                                </div>
                            ) : (
                                <ul className="flex flex-col gap-6">
                                    {items.map((item) => (
                                        <CartLine
                                            key={item.id}
                                            id={item.id}
                                            name={item.name}
                                            image={item.image}
                                            price={item.price}
                                            quantity={item.quantity}
                                            onRemove={removeItem}
                                            onUpdateQuantity={updateQuantity}
                                        />
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Pied de page (si panier non vide) */}
                        {!isEmpty && (
                            <div className="border-t border-border/50 bg-muted/20 px-6 py-6">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                        Total estimé
                                    </span>
                                    <span className="font-display text-2xl font-bold text-foreground">
                                        {total.toLocaleString()} FCFA
                                    </span>
                                </div>

                                {/* Correction apportée ici : Réintégration de la balise ouvrante <a> */}
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="magnetic-btn flex w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] py-4 text-sm font-bold text-white shadow-lg hover:shadow-xl"
                                >
                                    Commander via WhatsApp
                                </a>

                                <button
                                    onClick={clearCart}
                                    className="mt-4 w-full py-2 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    Vider le panier
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

interface CartLineProps {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    onRemove: (id: number) => void;
    onUpdateQuantity: (id: number, quantity: number) => void;
}

function CartLine({ id, name, image, price, quantity, onRemove, onUpdateQuantity }: CartLineProps) {
    const lineTotal = price * quantity;

    return (
        <li className="flex gap-4 group">
            <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted/50 border border-border/40">
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            <div className="flex flex-1 flex-col justify-center py-1">
                <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-base font-semibold text-foreground">
                        {name}
                    </p>
                    <button
                        onClick={() => onRemove(id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>

                <p className="font-display text-sm text-primary mb-3">
                    {lineTotal.toLocaleString()} FCFA
                </p>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onUpdateQuantity(id, quantity - 1)}
                        className="magnetic-btn flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-foreground/5"
                    >
                        <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center text-sm font-medium">
                        {quantity}
                    </span>
                    <button
                        onClick={() => onUpdateQuantity(id, quantity + 1)}
                        className="magnetic-btn flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-foreground/5"
                    >
                        <Plus className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </li>
    );
}