import { Link, useParams } from "react-router-dom";
import { ShieldCheck, ShoppingBag, Truck, ChevronLeft, Sparkles, Check, PackageX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/stores/useCart";
import { useProduct, useProducts } from "@/hooks/useSupabase";
import { getWhatsAppLink } from "@/lib/whatsapp";
import type { ProductDB } from "@/lib/supabase";

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const { product, loading } = useProduct(Number(id));
    const { products: allProducts } = useProducts();

    if (loading) {
        return <ProductSkeleton />;
    }

    if (!product) {
        return <ProductNotFound />;
    }

    const inStock = product.in_stock !== false;

    const relatedProducts = allProducts
        .filter((p) => p.category_id === product.category_id && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="relative min-h-screen overflow-hidden bg-background pb-32 md:pb-20">
            <div className="blob -right-32 top-0 h-96 w-96 bg-primary/50 hidden sm:block" />
            <div className="blob left-0 top-96 h-72 w-72 bg-secondary/40 hidden sm:block" />

            <BackLink />

<<<<<<< HEAD
            <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="relative aspect-[4/5] overflow-hidden rounded-[2rem] glass shadow-sm"
                    >
                        {!inStock && (
                            <span className="absolute left-4 top-4 z-10 rounded-full bg-foreground/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                                Épuisé
                            </span>
                        )}
                        <img
                            src={product.image}
                            alt={product.name}
                            className={
                                "h-full w-full object-cover transition-transform duration-700 hover:scale-105 " +
                                (!inStock ? "opacity-60 grayscale-[0.4]" : "")
                            }
                        />
                    </motion.div>

                    <div className="flex flex-col justify-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="glass inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary"
                        >
                            <Sparkles className="h-3 w-3" />
                            {product.categories?.name}
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="font-display mt-4 text-4xl font-semibold leading-tight text-foreground md:text-5xl"
                        >
                            {product.name}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="font-display text-gradient mt-6 text-3xl font-semibold"
                        >
                            {product.price.toLocaleString()} FCFA
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground"
                        >
                            {product.description}
                        </motion.p>

                        {inStock ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.5 }}
                                className="mt-10 flex flex-col gap-4 sm:flex-row"
                            >
                                <WhatsAppButton
                                    product={{
                                        name: product.name,
                                        price: product.price,
                                    }}
                                    className="flex-1 rounded-full py-4 text-base"
                                />
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="flex-1 gap-2 rounded-full py-4 text-base glass border-primary/30 hover:bg-primary/10"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    Ajouter au panier
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.5 }}
                                className="mt-10 flex flex-col gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"
                            >
                                <div>
                                    <p className="font-display text-lg font-semibold text-foreground">
                                        Actuellement épuisé
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Contactez-nous pour etre informe(e) de son retour en stock.
                                    </p>
                                </div>
                                <WhatsAppButton
                                    product={{ name: product.name, price: product.price }}
                                    label="Etre averti(e)"
                                    className="rounded-full py-3 px-6 text-sm sm:shrink-0"
                                />
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="mt-12 flex flex-col gap-4 rounded-3xl glass p-6"
                        >
                            <div className="flex items-center gap-4 text-sm font-medium text-foreground/80">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                                    <Truck className="h-5 w-5" />
                                </div>
                                Livraison rapide disponible
                            </div>
                            <div className="flex items-center gap-4 text-sm font-medium text-foreground/80">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                Paiement securise a la livraison
                            </div>
                        </motion.div>
                    </div>
=======
            <section className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8 lg:py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20 items-center">
                    <ProductImage src={product.image} alt={product.name} outOfStock={product.in_stock === false} />
                    <ProductInfo product={product} />
>>>>>>> 6049a46d8d1609ab6f4044a8a89541f0b4092669
                </div>
            </section>

            {relatedProducts.length > 0 && (
<<<<<<< HEAD
                <section className="relative z-10 py-24 mt-12 border-t border-white/30">
                    <div className="mx-auto max-w-7xl px-4 md:px-8">
                        <h2 className="font-display text-3xl font-semibold text-foreground">
                            Vous aimerez <span className="text-gradient italic">aussi</span>
                        </h2>
                        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((p, index) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Link
                                        to={"/produit/" + p.id}
                                        className="group block overflow-hidden rounded-3xl glass shadow-sm transition-all hover:-translate-y-2 hover:glow-primary"
                                    >
                                        <div className="relative aspect-[4/5] overflow-hidden bg-muted/30">
                                            {p.in_stock === false && (
                                                <span className="absolute left-3 top-3 z-10 rounded-full bg-foreground/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                                                    Épuisé
                                                </span>
                                            )}
                                            <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        </div>
                                        <div className="p-5">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">{p.categories?.name}</span>
                                            <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                                            <p className="font-display text-xl text-gradient font-semibold mt-1">{p.price.toLocaleString()} FCFA</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
=======
                <RelatedProducts products={relatedProducts} />
>>>>>>> 6049a46d8d1609ab6f4044a8a89541f0b4092669
            )}

            <MobileActionBar product={product} />
        </div>
    );
}

function ProductSkeleton() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                <div className="aspect-[4/5] rounded-[2rem] shimmer-bg" />
                <div className="flex flex-col gap-4 pt-4 md:pt-8">
                    <div className="h-4 w-1/4 rounded shimmer-bg" />
                    <div className="h-10 w-3/4 rounded shimmer-bg" />
                    <div className="h-8 w-1/3 rounded shimmer-bg" />
                    <div className="h-24 w-full rounded shimmer-bg" />
                </div>
            </div>
        </div>
    );
}

function ProductNotFound() {
    return (
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
            <p className="font-display text-3xl font-bold text-foreground">
                Produit introuvable
            </p>
            <Link to="/catalogue" className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors">
                <ChevronLeft className="h-4 w-4" />
                Retour au catalogue
            </Link>
        </div>
    );
}

function BackLink() {
    return (
        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 md:pt-8 md:px-8">
            <Link to="/catalogue" className="touch-target inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors -ml-2">
                <ChevronLeft className="h-4 w-4" />
                Retour
            </Link>
        </div>
    );
}

function ProductImage({ src, alt, outOfStock }: { src: string; alt: string; outOfStock: boolean }) {
    return (
        <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-muted/30 shadow-sm animate-fade-up">
            <img
                src={src}
                alt={alt}
                loading="eager"
                decoding="async"
                className={"h-full w-full object-cover " + (outOfStock ? "grayscale-[35%] opacity-80" : "")}
            />
        </div>
    );
}

function ProductInfo({ product }: { product: ProductDB }) {
    const { addItem, setIsOpen } = useCart();
    const [added, setAdded] = useState(false);
    const outOfStock = product.in_stock === false;

    function handleAddToCart() {
        if (outOfStock) return;
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            setIsOpen(true);
        }, 450);
    }

    const cartLabel = added ? "Ajoute !" : outOfStock ? "Indisponible" : "Ajouter au panier";
    const categoryName = product.categories?.name ?? "";

    return (
        <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2">
                <span className="glass-light inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    <Sparkles className="h-3 w-3" />
                    {categoryName}
                </span>
                {outOfStock && (
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-destructive/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-destructive">
                        <PackageX className="h-3 w-3" />
                        Rupture de stock
                    </span>
                )}
            </div>

            <h1 className="font-display mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
                {product.name}
            </h1>

            <p className="font-display text-gradient mt-5 text-2xl font-semibold sm:text-3xl">
                {product.price.toLocaleString()} FCFA
            </p>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                {product.description}
            </p>

            <div className="mt-8 hidden flex-col gap-4 sm:flex sm:flex-row">
                <WhatsAppButton
                    product={{ name: product.name, price: product.price }}
                    className="flex-1 rounded-full py-4 text-base"
                />
                <Button
                    variant="outline"
                    size="lg"
                    disabled={outOfStock}
                    className="flex-1 gap-2 rounded-full py-4 text-base glass-light border-primary/30 hover:bg-primary/10 disabled:opacity-50"
                    onClick={handleAddToCart}
                >
                    <AddToCartIcon added={added} />
                    {cartLabel}
                </Button>
            </div>

            <TrustBox />
        </div>
    );
}

function AddToCartIcon({ added }: { added: boolean }) {
    if (added) {
        return <Check className="h-5 w-5 text-success" />;
    }
    return <ShoppingBag className="h-5 w-5" />;
}

function TrustBox() {
    return (
        <div className="mt-10 flex flex-col gap-4 rounded-3xl glass-light p-5 md:p-6">
            <div className="flex items-center gap-4 text-sm font-medium text-foreground/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                    <Truck className="h-5 w-5" />
                </div>
                Livraison rapide disponible
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-foreground/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                Paiement securise a la livraison
            </div>
        </div>
    );
}

function RelatedProducts({ products }: { products: ProductDB[] }) {
    return (
        <section className="relative z-10 py-16 mt-8 border-t border-border/30 md:py-24 md:mt-12">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                    Vous aimerez <span className="text-gradient italic">aussi</span>
                </h2>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-8 md:mt-12 lg:grid-cols-4">
                    {products.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={{
                                id: p.id,
                                name: p.name,
                                description: p.description,
                                price: p.price,
                                image: p.image,
                                categoryId: p.category_id,
                                categoryName: p.categories?.name ?? "",
                                sku: "",
                                inStock: p.in_stock,
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function MobileActionBar({ product }: { product: ProductDB }) {
    const { addItem, setIsOpen } = useCart();
    const [added, setAdded] = useState(false);
    const outOfStock = product.in_stock === false;
    const whatsappLink = getWhatsAppLink({ name: product.name, price: product.price });

    function handleAddToCart() {
        if (outOfStock) return;
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            setIsOpen(true);
        }, 450);
    }

    return (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pb-2 sm:hidden">
            <div className="glass mx-auto flex max-w-md items-center gap-3 rounded-2xl p-3 shadow-premium-lg">
                <div className="min-w-0 flex-1 pl-2">
                    <p className="truncate text-xs font-semibold text-muted-foreground">{product.name}</p>
                    <p className="font-display text-base font-bold text-primary">
                        {product.price.toLocaleString()} FCFA
                    </p>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={outOfStock}
                    className="touch-target flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background/60 text-primary disabled:opacity-40"
                    aria-label="Ajouter au panier"
                >
                    <AddToCartIcon added={added} />
                </button>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="touch-target flex h-11 shrink-0 items-center justify-center rounded-full bg-[#25d366] px-5 text-sm font-bold text-white shadow-md">
                    Commander
                </a>
            </div>
        </div>
    );
}