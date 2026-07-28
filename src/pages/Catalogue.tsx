import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageX, SlidersHorizontal } from "lucide-react";
import { useCategories, useProducts } from "@/hooks/useSupabase";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Catalogue() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeSlug = searchParams.get("category") ?? undefined;
    const [sort, setSort] = useState<"recent" | "price_asc" | "price_desc">("recent");

    const { categories } = useCategories();
    const { products, loading } = useProducts(activeSlug);

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            if (sort === "price_asc") return a.price - b.price;
            if (sort === "price_desc") return b.price - a.price;
            return b.id - a.id;
        });
    }, [products, sort]);

    function handleCategoryClick(slug?: string) {
        if (slug) {
            setSearchParams({ category: slug });
        } else {
            setSearchParams({});
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-background pb-24">
            <div className="blob -right-40 top-0 h-96 w-96 bg-primary/70" />
            <div className="blob -left-32 top-64 h-72 w-72 bg-secondary/60" style={{ animationDelay: "4s" }} />

            <section className="relative py-10 md:py-24 border-b border-white/30">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 mx-auto max-w-7xl px-4 text-center md:px-8"
                >
                    <span className="glass inline-block rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        La collection complete
                    </span>
                    <h1 className="font-display mt-4 text-3xl font-semibold text-foreground md:mt-6 md:text-6xl">
                        Notre <span className="text-gradient italic">catalogue</span>
                    </h1>
                    <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground md:mt-4">
                        {sortedProducts.length} article{sortedProducts.length > 1 ? "s" : ""}
                    </p>
                </motion.div>
            </section>

            <section className="relative z-10 mx-auto max-w-7xl py-6 md:px-8 md:py-8">
                <div className="flex flex-col gap-4 mb-6 md:mb-12 md:flex-row md:items-center md:justify-between md:gap-6">
                    {/* Filtres de categories : scroll horizontal sur mobile, wrap sur desktop */}
                    <div className="no-scrollbar flex items-center gap-2.5 overflow-x-auto px-4 pb-1 md:flex-wrap md:gap-3 md:overflow-visible md:px-0">
                        <button
                            onClick={() => handleCategoryClick(undefined)}
                            className={
                                "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 md:px-5 md:py-2.5 md:text-sm " +
                                (!activeSlug
                                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md glow-primary"
                                    : "glass text-foreground hover:bg-primary/10")
                            }
                        >
                            Tous
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.slug)}
                                className={
                                    "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 md:px-5 md:py-2.5 md:text-sm " +
                                    (activeSlug === cat.slug
                                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md glow-primary"
                                        : "glass text-foreground hover:bg-primary/10")
                                }
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 glass mx-4 p-1.5 rounded-2xl md:mx-0">
                        <div className="pl-3 text-primary">
                            <SlidersHorizontal className="h-4 w-4" />
                        </div>
                        <Select value={sort} onValueChange={(value) => setSort(value as typeof sort)}>
                            <SelectTrigger className="w-full border-none bg-transparent shadow-none font-medium md:w-[180px]">
                                <SelectValue placeholder="Trier par" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-premium">
                                <SelectItem value="recent">Plus recents</SelectItem>
                                <SelectItem value="price_asc">Prix croissant</SelectItem>
                                <SelectItem value="price_desc">Prix decroissant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 gap-3 px-4 sm:gap-6 md:px-0 lg:grid-cols-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] rounded-2xl bg-muted md:rounded-3xl" />
                                <div className="mt-3 h-3 w-3/4 rounded bg-muted" />
                                <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
                            </div>
                        ))}
                    </div>
                ) : sortedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-32 px-4">
                        <div className="glass rounded-full p-6">
                            <PackageX className="h-10 w-10 text-primary/60" />
                        </div>
                        <p className="text-base font-medium text-muted-foreground text-center">
                            Aucun produit trouve dans cette categorie.
                        </p>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-2 gap-3 px-4 sm:gap-6 md:px-0 lg:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                            {sortedProducts.map((product) => {
                                const inStock = product.in_stock !== false;
                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        key={product.id}
                                    >
                                        <Link
                                            to={"/produit/" + product.id}
                                            className="group block overflow-hidden rounded-2xl glass shadow-sm transition-all duration-500 active:scale-[0.98] md:rounded-3xl md:hover:-translate-y-2 md:hover:glow-primary"
                                        >
                                            <div className="relative aspect-[3/4] overflow-hidden bg-muted/30 md:aspect-[4/5]">
                                                {!inStock && (
                                                    <span className="absolute left-2 top-2 z-10 rounded-full bg-foreground/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md md:left-3 md:top-3 md:px-3 md:py-1 md:text-[10px]">
                                                        Épuisé
                                                    </span>
                                                )}
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className={
                                                        "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 " +
                                                        (!inStock ? "opacity-60 grayscale-[0.4]" : "")
                                                    }
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-0.5 p-2.5 md:gap-1 md:p-5">
                                                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary/70 md:text-[10px] md:tracking-[0.2em]">
                                                    {product.categories?.name}
                                                </span>
                                                <h3 className="font-display text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors md:text-lg md:leading-normal md:line-clamp-1">
                                                    {product.name}
                                                </h3>
                                                <p className="font-display text-sm font-semibold text-gradient mt-0.5 md:text-xl md:mt-1">
                                                    {product.price.toLocaleString()} FCFA
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </section>
        </div>
    );
}