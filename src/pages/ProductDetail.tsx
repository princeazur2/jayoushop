import { Link, useParams } from "react-router-dom";
import { ShieldCheck, ShoppingBag, Truck, ChevronLeft, Sparkles, Check } from "lucide-react";
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

    const relatedProducts = allProducts
        .filter((p) => p.category_id === product.category_id && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="relative min-h-screen overflow-hidden bg-background pb-32 md:pb-20">
            <div className="blob -right-32 top-0 h-96 w-96 bg-primary/50 hidden sm:block" />
            <div className="blob left-0 top-96 h-72 w-72 bg-secondary/40 hidden sm:block" />

            <BackLink />

            <section className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8 lg:py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20 items-center">
                    <ProductImage src={product.image} alt={product.name} />
                    <ProductInfo product={product} />
                </div>
            </section>

            {relatedProducts.length > 0 && (
                <RelatedProducts products={relatedProducts} />
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

function ProductImage({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-muted/30 shadow-sm animate-fade-up">
            <img src={src} alt={alt} loading="eager" decoding="async" className="h-full w-full object-cover" />
        </div>
    );
}

function ProductInfo({ product }: { product: ProductDB }) {
    const { addItem, setIsOpen } = useCart();
    const [added, setAdded] = useState(false);

    function handleAddToCart() {
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

    const cartLabel = added ? "Ajoute !" : "Ajouter au panier";
    const categoryName = product.categories?.name ?? "";

    return (
        <div className="flex flex-col justify-center">
            <span className="glass-light inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3 w-3" />
                {categoryName}
            </span>

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
                    className="flex-1 gap-2 rounded-full py-4 text-base glass-light border-primary/30 hover:bg-primary/10"
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
    const whatsappLink = getWhatsAppLink({ name: product.name, price: product.price });

    function handleAddToCart() {
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
                <button onClick={handleAddToCart} className="touch-target flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background/60 text-primary" aria-label="Ajouter au panier">
                    <AddToCartIcon added={added} />
                </button>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="touch-target flex h-11 shrink-0 items-center justify-center rounded-full bg-[#25d366] px-5 text-sm font-bold text-white shadow-md">
                    Commander
                </a>
            </div>
        </div>
    );
}