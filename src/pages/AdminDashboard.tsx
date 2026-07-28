import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    Package,
    Tag,
    FileText,
    Palette,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Sparkles,
    Star,
    PackageX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAdmin } from "@/stores/useAdmin";
import { useTheme } from "@/stores/useTheme";
import { useToast } from "@/stores/useToast";
import {
    useAdminProducts,
    useAdminCategories,
    useAdminBlogPosts,
    useAdminSiteSettings,
    deleteProduct,
    deleteCategory,
    deleteBlogPost,
    updateSiteSettings,
    toggleFeatured,
    toggleStock,
} from "@/hooks/useSupabase";
import type { ProductDB, CategoryDB, BlogPostDB } from "@/lib/supabase";
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import CategoryFormDialog from "@/components/admin/CategoryFormDialog";
import BlogFormDialog from "@/components/admin/BlogFormDialog";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUploadField from "@/components/admin/ImageUploadField";
import VideoUploadField from "@/components/admin/VideoUploadField";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    { id: "products", label: "Produits", icon: Package },
    { id: "featured", label: "Selection", icon: Star },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "style", label: "Style", icon: Palette },
] as const;

type TabId = (typeof NAV_ITEMS)[number]["id"];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { logout } = useAdmin();
    const { settings } = useAdminSiteSettings();
    const [activeTab, setActiveTab] = useState<TabId>("products");

    function handleLogout() {
        logout();
        navigate("/admin");
    }

    const siteName = settings?.site_name?.trim() || "JA Jí Yoū";
    const activeItem = NAV_ITEMS.find((item) => item.id === activeTab)!;

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-muted/20">
            <div className="blob -right-40 -top-40 hidden h-96 w-96 bg-primary/30 lg:block" />
            <div className="blob -left-40 top-96 hidden h-80 w-80 bg-secondary/25 lg:block" style={{ animationDelay: "4s" }} />

            <div className="relative z-10 flex">
                {/* Sidebar desktop */}
                <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/40 bg-background/70 backdrop-blur-xl lg:flex">
                    <div className="flex items-center gap-3 px-6 py-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-md">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex flex-col leading-tight">
                            <span className="truncate font-display text-lg font-semibold text-foreground">
                                {siteName}
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                                Administration
                            </span>
                        </div>
                    </div>

                    <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={
                                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all " +
                                        (isActive
                                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                                            : "text-foreground/70 hover:bg-primary/10 hover:text-foreground")
                                    }
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="border-t border-border/40 p-3">
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="w-full justify-start gap-2 rounded-2xl border-border/50 font-semibold hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                        >
                            <LogOut className="h-4 w-4" />
                            Deconnexion
                        </Button>
                    </div>
                </aside>

                {/* Contenu principal */}
                <div className="min-w-0 flex-1">
                    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-4 backdrop-blur-xl md:px-6 lg:px-8">
                        <div className="flex items-center gap-3 lg:hidden">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-sm">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <span className="truncate font-display text-base font-semibold text-foreground">
                                {siteName}
                            </span>
                        </div>

                        <div className="hidden items-center gap-2 lg:flex">
                            <activeItem.icon className="h-5 w-5 text-primary" />
                            <h1 className="font-display text-xl font-semibold text-foreground">
                                {activeItem.label}
                            </h1>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive lg:hidden"
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </header>

                    <main className="px-4 py-6 pb-32 md:px-6 md:py-8 lg:px-8 lg:pb-10">
                        <StatsRow />

                        <div className="mt-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {activeTab === "products" && <ProductsTab />}
                                    {activeTab === "featured" && <FeaturedTab />}
                                    {activeTab === "categories" && <CategoriesTab />}
                                    {activeTab === "blog" && <BlogTab />}
                                    {activeTab === "style" && <StyleTab />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </main>
                </div>
            </div>

            {/* Barre de navigation mobile */}
            <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 lg:hidden">
                <div className="glass flex w-full max-w-md items-center justify-between gap-1 rounded-full px-2 py-2 shadow-premium-lg">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[10px] font-semibold"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="admin-nav-bubble"
                                        className="absolute inset-x-1 inset-y-0.5 rounded-full bg-gradient-to-r from-primary to-secondary shadow-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                <item.icon className={"relative z-10 h-5 w-5 " + (isActive ? "text-white" : "text-foreground/50")} />
                                <span className={"relative z-10 " + (isActive ? "text-white" : "text-foreground/50")}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}

function StatsRow() {
    const { products } = useAdminProducts();
    const { categories } = useAdminCategories();
    const { posts } = useAdminBlogPosts();

    const outOfStockCount = products.filter((p) => p.in_stock === false).length;

    const stats = [
        { icon: Package, label: "Produits actifs", value: products.length },
        { icon: Tag, label: "Categories", value: categories.length },
        { icon: FileText, label: "Articles publies", value: posts.length },
        { icon: PackageX, label: "En rupture de stock", value: outOfStockCount },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="flex flex-col gap-3 rounded-3xl glass p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:p-6"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-md sm:h-14 sm:w-14">
                        <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-muted-foreground sm:text-sm">{stat.label}</p>
                        <p className="font-display text-2xl font-bold text-foreground sm:mt-1 sm:text-3xl">
                            {stat.value}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function SectionCard({
    title,
    action,
    children,
}: {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-3xl glass shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/30 px-5 py-5 md:px-8">
                <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">{title}</h3>
                {action}
            </div>
            <div className="bg-background/40">{children}</div>
        </div>
    );
}

function StockBadge({ inStock }: { inStock: boolean }) {
    return (
        <span
            className={
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold " +
                (inStock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")
            }
        >
            <span className={"h-1.5 w-1.5 rounded-full " + (inStock ? "bg-success" : "bg-destructive")} />
            {inStock ? "En stock" : "Épuisé"}
        </span>
    );
}

function ProductsTab() {
    const { products, loading, refetch } = useAdminProducts();
    const { categories } = useAdminCategories();
    const { showToast } = useToast();

    const [formOpen, setFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductDB | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState<ProductDB | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [stockSavingId, setStockSavingId] = useState<number | null>(null);

    function openCreate() {
        setEditingProduct(null);
        setFormOpen(true);
    }

    function openEdit(product: ProductDB) {
        setEditingProduct(product);
        setFormOpen(true);
    }

    function askDelete(product: ProductDB) {
        setDeletingProduct(product);
        setConfirmOpen(true);
    }

    async function confirmDelete() {
        if (!deletingProduct) return;
        setDeleting(true);
        try {
            await deleteProduct(deletingProduct.id);
            showToast("success", "Produit supprime avec succes.");
            refetch();
            setConfirmOpen(false);
        } catch {
            showToast("error", "Impossible de supprimer ce produit.");
        } finally {
            setDeleting(false);
        }
    }

    async function handleToggleStock(product: ProductDB) {
        setStockSavingId(product.id);
        try {
            await toggleStock(product);
            refetch();
        } catch {
            showToast("error", "Impossible de mettre a jour la disponibilite.");
        } finally {
            setStockSavingId(null);
        }
    }

    return (
        <SectionCard
            title="Gestion des produits"
            action={
                <Button
                    size="sm"
                    className="gap-2 rounded-full bg-gradient-to-r from-primary to-secondary font-semibold text-white shadow-md hover:opacity-90"
                    onClick={openCreate}
                >
                    <Plus className="h-4 w-4" />
                    Nouveau
                </Button>
            }
        >
            {loading ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                    Chargement des produits...
                </div>
            ) : products.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                    Aucun produit pour le moment.
                </div>
            ) : (
                <>
                    {/* Vue mobile : liste de cartes */}
                    <ul className="divide-y divide-white/20 sm:hidden">
                        {products.map((product) => {
                            const inStock = product.in_stock !== false;
                            return (
                                <li key={product.id} className="flex flex-col gap-3 px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted border border-white/30 shadow-sm">
                                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="truncate font-bold text-foreground">{product.name}</p>
                                                {product.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-secondary text-secondary" />}
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                                <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-0.5 text-[11px] font-semibold text-secondary">
                                                    {product.categories?.name || "-"}
                                                </span>
                                                <span className="text-sm font-bold text-gradient">
                                                    {product.price.toLocaleString()} FCFA
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1">
                                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10" onClick={() => openEdit(product)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10" onClick={() => askDelete(product)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleToggleStock(product)}
                                        disabled={stockSavingId === product.id}
                                        className="flex w-fit items-center gap-1 disabled:opacity-50"
                                    >
                                        {stockSavingId === product.id ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                                        ) : (
                                            <StockBadge inStock={inStock} />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Vue desktop : tableau */}
                    <div className="hidden sm:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-white/30">
                                    <TableHead className="px-6 py-4 font-semibold text-foreground md:px-8">Produit</TableHead>
                                    <TableHead className="font-semibold text-foreground">Categorie</TableHead>
                                    <TableHead className="font-semibold text-foreground">Prix</TableHead>
                                    <TableHead className="font-semibold text-foreground">Stock</TableHead>
                                    <TableHead className="text-right px-6 font-semibold text-foreground md:px-8">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => {
                                    const inStock = product.in_stock !== false;
                                    return (
                                        <TableRow key={product.id} className="border-white/20 hover:bg-primary/5 transition-colors">
                                            <TableCell className="px-6 py-4 md:px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted border border-white/30 shadow-sm">
                                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-foreground">{product.name}</span>
                                                        {product.featured && (
                                                            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">
                                                    {product.categories?.name || "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-bold text-gradient">
                                                {product.price.toLocaleString()} FCFA
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    onClick={() => handleToggleStock(product)}
                                                    disabled={stockSavingId === product.id}
                                                    className="disabled:opacity-50"
                                                >
                                                    {stockSavingId === product.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                    ) : (
                                                        <StockBadge inStock={inStock} />
                                                    )}
                                                </button>
                                            </TableCell>
                                            <TableCell className="text-right px-6 md:px-8">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10" onClick={() => openEdit(product)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10" onClick={() => askDelete(product)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}

            <ProductFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                product={editingProduct}
                categories={categories}
                onSuccess={refetch}
            />

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Supprimer ce produit ?"
                description={
                    "Cette action est irreversible. " +
                    (deletingProduct ? "Le produit \"" + deletingProduct.name + "\" sera definitivement supprime." : "")
                }
                onConfirm={confirmDelete}
                loading={deleting}
            />
        </SectionCard>
    );
}

function CategoriesTab() {
    const { categories, loading, refetch } = useAdminCategories();
    const { showToast } = useToast();

    const [formOpen, setFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryDB | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState<CategoryDB | null>(null);
    const [deleting, setDeleting] = useState(false);

    function openCreate() {
        setEditingCategory(null);
        setFormOpen(true);
    }

    function openEdit(category: CategoryDB) {
        setEditingCategory(category);
        setFormOpen(true);
    }

    function askDelete(category: CategoryDB) {
        setDeletingCategory(category);
        setConfirmOpen(true);
    }

    async function confirmDelete() {
        if (!deletingCategory) return;
        setDeleting(true);
        try {
            await deleteCategory(deletingCategory.id);
            showToast("success", "Categorie supprimee avec succes.");
            refetch();
            setConfirmOpen(false);
        } catch {
            showToast("error", "Impossible de supprimer cette categorie. Verifiez qu'aucun produit n'y est lie.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <SectionCard
            title="Gestion des categories"
            action={
                <Button
                    size="sm"
                    className="gap-2 rounded-full bg-gradient-to-r from-primary to-secondary font-semibold text-white shadow-md hover:opacity-90"
                    onClick={openCreate}
                >
                    <Plus className="h-4 w-4" />
                    Nouvelle
                </Button>
            }
        >
            {loading ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                    Chargement des categories...
                </div>
            ) : categories.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                    Aucune categorie pour le moment.
                </div>
            ) : (
                <>
                    <ul className="divide-y divide-white/20 sm:hidden">
                        {categories.map((cat) => (
                            <li key={cat.id} className="flex items-center gap-3 px-4 py-4">
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted border border-white/30 shadow-sm">
                                    <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-bold text-foreground">{cat.name}</p>
                                    <p className="truncate font-mono text-xs text-muted-foreground">{cat.slug}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10" onClick={() => openEdit(cat)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10" onClick={() => askDelete(cat)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden sm:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-white/30">
                                    <TableHead className="px-6 py-4 font-semibold text-foreground md:px-8">Nom</TableHead>
                                    <TableHead className="font-semibold text-foreground">Slug (URL)</TableHead>
                                    <TableHead className="text-right px-6 font-semibold text-foreground md:px-8">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((cat) => (
                                    <TableRow key={cat.id} className="border-white/20 hover:bg-primary/5 transition-colors">
                                        <TableCell className="px-6 py-4 font-bold text-foreground md:px-8">{cat.name}</TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-sm">{cat.slug}</TableCell>
                                        <TableCell className="text-right px-6 md:px-8">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10" onClick={() => openEdit(cat)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10" onClick={() => askDelete(cat)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}

            <CategoryFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                category={editingCategory}
                onSuccess={refetch}
            />

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Supprimer cette categorie ?"
                description={
                    "Cette action est irreversible. " +
                    (deletingCategory ? "La categorie \"" + deletingCategory.name + "\" sera definitivement supprimee." : "")
                }
                onConfirm={confirmDelete}
                loading={deleting}
            />
        </SectionCard>
    );
}

function BlogTab() {
    const { posts, loading, refetch } = useAdminBlogPosts();
    const { showToast } = useToast();

    const [formOpen, setFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPostDB | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingPost, setDeletingPost] = useState<BlogPostDB | null>(null);
    const [deleting, setDeleting] = useState(false);

    function openCreate() {
        setEditingPost(null);
        setFormOpen(true);
    }

    function openEdit(post: BlogPostDB) {
        setEditingPost(post);
        setFormOpen(true);
    }

    function askDelete(post: BlogPostDB) {
        setDeletingPost(post);
        setConfirmOpen(true);
    }

    async function confirmDelete() {
        if (!deletingPost) return;
        setDeleting(true);
        try {
            await deleteBlogPost(deletingPost.id);
            showToast("success", "Article supprime avec succes.");
            refetch();
            setConfirmOpen(false);
        } catch {
            showToast("error", "Impossible de supprimer cet article.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <SectionCard
            title="Articles de blog"
            action={
                <Button
                    size="sm"
                    className="gap-2 rounded-full bg-gradient-to-r from-primary to-secondary font-semibold text-white shadow-md hover:opacity-90"
                    onClick={openCreate}
                >
                    <Plus className="h-4 w-4" />
                    Nouveau
                </Button>
            }
        >
            {loading ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                    Chargement des articles...
                </div>
            ) : posts.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                    Aucun article pour le moment.
                </div>
            ) : (
                <>
                    <ul className="divide-y divide-white/20 sm:hidden">
                        {posts.map((post) => (
                            <li key={post.id} className="flex items-center gap-3 px-4 py-4">
                                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted border border-white/30">
                                    <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-bold text-foreground">{post.title}</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                            {post.category}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{post.published_at}</span>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10" onClick={() => openEdit(post)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10" onClick={() => askDelete(post)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden sm:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-white/30">
                                    <TableHead className="px-6 py-4 font-semibold text-foreground md:px-8">Titre</TableHead>
                                    <TableHead className="font-semibold text-foreground">Categorie</TableHead>
                                    <TableHead className="font-semibold text-foreground">Date</TableHead>
                                    <TableHead className="text-right px-6 font-semibold text-foreground md:px-8">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post.id} className="border-white/20 hover:bg-primary/5 transition-colors">
                                        <TableCell className="px-6 py-4 md:px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-16 shrink-0 overflow-hidden rounded-lg bg-muted border border-white/30">
                                                    <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
                                                </div>
                                                <span className="font-bold text-foreground max-w-[10rem] truncate md:max-w-xs">{post.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                                {post.category}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-medium text-sm">
                                            {post.published_at}
                                        </TableCell>
                                        <TableCell className="text-right px-6 md:px-8">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10" onClick={() => openEdit(post)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10" onClick={() => askDelete(post)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}

            <BlogFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                post={editingPost}
                onSuccess={refetch}
            />

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Supprimer cet article ?"
                description={
                    "Cette action est irreversible. " +
                    (deletingPost ? "L'article \"" + deletingPost.title + "\" sera definitivement supprime." : "")
                }
                onConfirm={confirmDelete}
                loading={deleting}
            />
        </SectionCard>
    );
}

function FeaturedTab() {
    const { products, loading, refetch } = useAdminProducts();
    const { showToast } = useToast();
    const [savingId, setSavingId] = useState<number | null>(null);

    const featuredCount = products.filter((p) => p.featured).length;

    async function handleToggle(product: ProductDB) {
        setSavingId(product.id);
        try {
            await toggleFeatured(product);
            refetch();
        } catch {
            showToast("error", "Impossible de mettre a jour la selection.");
        } finally {
            setSavingId(null);
        }
    }

    return (
        <SectionCard title="La Selection (page d'accueil)">
            <div className="border-b border-white/30 px-5 py-4 text-sm text-muted-foreground md:px-8">
                {featuredCount} produit{featuredCount > 1 ? "s" : ""} actuellement mis en avant sur la page d'accueil.
                Idealement entre 4 et 8 pieces pour un rendu equilibre. Tant qu'aucun produit n'est selectionne, les plus recents s'affichent par defaut.
            </div>

            {loading ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                    Chargement des produits...
                </div>
            ) : products.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                    Aucun produit pour le moment. Ajoute d'abord des produits dans l'onglet "Produits".
                </div>
            ) : (
                <ul className="divide-y divide-white/20">
                    {products.map((product) => (
                        <li key={product.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 md:px-8">
                            <div className="flex min-w-0 flex-1 items-center gap-4">
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted border border-white/30 shadow-sm">
                                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-bold text-foreground">{product.name}</p>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <span className="truncate text-sm text-muted-foreground">
                                            {product.categories?.name || "-"} · {product.price.toLocaleString()} FCFA
                                        </span>
                                        <StockBadge inStock={product.in_stock !== false} />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleToggle(product)}
                                disabled={savingId === product.id}
                                className={
                                    "flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 " +
                                    (product.featured
                                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                                        : "border border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary")
                                }
                            >
                                {savingId === product.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Star className={"h-4 w-4 " + (product.featured ? "fill-current" : "")} />
                                )}
                                {product.featured ? "En vedette" : "Mettre en avant"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </SectionCard>
    );
}

function StyleTab() {
    const { settings, loading, refetch } = useAdminSiteSettings();
    const { colors, setColors } = useTheme();
    const { showToast } = useToast();

    const [siteName, setSiteName] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [saving, setSaving] = useState(false);

    const [primary, setPrimary] = useState(colors.primary);
    const [secondary, setSecondary] = useState(colors.secondary);
    const [colorsSaved, setColorsSaved] = useState(false);

    useEffect(() => {
        if (settings) {
            setSiteName(settings.site_name || "");
            setLogoUrl(settings.logo_url || "");
            setVideoUrl(settings.hero_video_url || "");
        }
    }, [settings]);

    async function handleSaveIdentity() {
        setSaving(true);
        try {
            await updateSiteSettings({
                site_name: siteName || null,
                logo_url: logoUrl || null,
                hero_video_url: videoUrl || null,
            });
            showToast("success", "Identite du site mise a jour avec succes.");
            refetch();
        } catch {
            showToast("error", "Erreur lors de la mise a jour.");
        } finally {
            setSaving(false);
        }
    }

    function handleSaveColors() {
        setColors({ primary, secondary });
        setColorsSaved(true);
        setTimeout(() => setColorsSaved(false), 2000);
    }

    function applyPreset(preset: { primary: string; secondary: string }) {
        setPrimary(preset.primary);
        setSecondary(preset.secondary);
        setColors({ primary: preset.primary, secondary: preset.secondary });
    }

    const presets = [
        { label: "Violet + Orange (defaut)", primary: "258 90% 66%", secondary: "24 95% 53%" },
        { label: "Rose + Violet", primary: "330 81% 60%", secondary: "263 70% 50%" },
        { label: "Bleu + Turquoise", primary: "217 91% 60%", secondary: "172 66% 50%" },
        { label: "Or + Noir profond", primary: "38 92% 50%", secondary: "258 25% 20%" },
        { label: "Emeraude + Orange", primary: "142 71% 35%", secondary: "24 95% 53%" },
    ];

    if (loading) {
        return (
            <div className="rounded-3xl glass p-8 shadow-sm">
                <p className="text-sm text-muted-foreground">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
            <div className="rounded-3xl glass p-6 shadow-sm sm:p-8">
                <h3 className="font-display text-xl font-bold mb-1 sm:text-2xl">Identite de la boutique</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Le nom choisi ici remplace automatiquement le nom affiche dans l'en-tete,
                    le pied de page et l'onglet du navigateur, partout sur le site.
                </p>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="site-name">Nom du site</Label>
                        <Input
                            id="site-name"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            placeholder="JA Jí Yoū"
                            className="h-12 rounded-xl bg-background/60 text-base"
                        />
                    </div>

                    <ImageUploadField
                        id="logo-upload"
                        label="Logo"
                        value={logoUrl}
                        onChange={setLogoUrl}
                        folder="branding"
                    />

                    <VideoUploadField
                        id="hero-video-upload"
                        label="Video de fond (page d'accueil)"
                        value={videoUrl}
                        onChange={setVideoUrl}
                        folder="hero"
                    />

                    <Button
                        onClick={handleSaveIdentity}
                        disabled={saving}
                        className="gap-2 rounded-full h-12 self-start px-8 text-base font-bold bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:opacity-90"
                    >
                        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                        {saving ? "Enregistrement..." : "Enregistrer l'identite"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="rounded-3xl glass p-6 shadow-sm sm:p-8">
                    <h3 className="font-display text-xl font-bold mb-6 sm:text-2xl">Couleurs sur-mesure</h3>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-semibold">Couleur principale</Label>
                            <div className="flex items-center gap-3">
                                <div className="h-11 w-11 shrink-0 rounded-2xl border border-white/40 shadow-inner" style={{ backgroundColor: "hsl(" + primary + ")" }} />
                                <Input value={primary} onChange={(e) => setPrimary(e.target.value)} placeholder="258 90% 66%" className="h-11 rounded-xl bg-background/60" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-semibold">Couleur secondaire</Label>
                            <div className="flex items-center gap-3">
                                <div className="h-11 w-11 shrink-0 rounded-2xl border border-white/40 shadow-inner" style={{ backgroundColor: "hsl(" + secondary + ")" }} />
                                <Input value={secondary} onChange={(e) => setSecondary(e.target.value)} placeholder="24 95% 53%" className="h-11 rounded-xl bg-background/60" />
                            </div>
                        </div>

                        <Button
                            onClick={handleSaveColors}
                            className="rounded-full h-11 text-sm font-bold shadow-md bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                        >
                            {colorsSaved ? "Couleurs appliquees !" : "Appliquer les couleurs"}
                        </Button>
                    </div>
                </div>

                <div className="rounded-3xl glass p-6 shadow-sm sm:p-8">
                    <h3 className="font-display text-xl font-bold mb-5 sm:text-2xl">Themes predefinis</h3>
                    <div className="flex flex-col gap-3">
                        {presets.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => applyPreset(preset)}
                                className="group flex items-center justify-between rounded-2xl border border-white/30 bg-background/40 p-3.5 text-left transition-all hover:bg-primary/5 hover:shadow-sm"
                            >
                                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                    {preset.label}
                                </span>
                                <div className="flex gap-2">
                                    <div className="h-7 w-7 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: "hsl(" + preset.primary + ")" }} />
                                    <div className="h-7 w-7 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: "hsl(" + preset.secondary + ")" }} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}