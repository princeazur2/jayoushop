import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, PackageCheck, PackageX } from "lucide-react";
import { createProduct, updateProduct } from "@/hooks/useSupabase";
import type { ProductDB, CategoryDB } from "@/lib/supabase";
import { useToast } from "@/stores/useToast";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface ProductFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: ProductDB | null;
    categories: CategoryDB[];
    onSuccess: () => void;
}

const emptyForm = {
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: "",
    in_stock: true,
};

export default function ProductFormDialog({
    open,
    onOpenChange,
    product,
    categories,
    onSuccess,
}: ProductFormDialogProps) {
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name,
                description: product.description,
                price: String(product.price),
                category_id: String(product.category_id),
                image: product.image,
                in_stock: product.in_stock !== false,
            });
        } else {
            setForm(emptyForm);
        }
    }, [product, open]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.name || !form.category_id || !form.price) {
            showToast("error", "Merci de remplir tous les champs obligatoires.");
            return;
        }

        setSaving(true);

        const payload = {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            category_id: Number(form.category_id),
            image: form.image,
            in_stock: form.in_stock,
        };

        try {
            if (product) {
                await updateProduct(product.id, payload);
                showToast("success", "Produit modifie avec succes.");
            } else {
                await createProduct(payload);
                showToast("success", "Produit ajoute avec succes.");
            }
            onSuccess();
            onOpenChange(false);
        } catch {
            showToast("error", "Une erreur est survenue. Reessayez.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl">
                        {product ? "Modifier le produit" : "Nouveau produit"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1 -mr-1">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nom du produit</Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Blazer Premium Lin"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Description detaillee du produit"
                                rows={4}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="price">Prix (FCFA)</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                inputMode="numeric"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                placeholder="45000"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Categorie</Label>
                            <Select
                                value={form.category_id}
                                onValueChange={(value) => setForm({ ...form, category_id: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choisir une categorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

<<<<<<< HEAD
                        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 px-4 py-3">
                            <div className="flex flex-col">
                                <Label htmlFor="in-stock-switch">Disponibilite</Label>
                                <span className="text-xs text-muted-foreground">
                                    {form.in_stock ? "Ce produit est en stock" : "Ce produit est marque comme epuise"}
                                </span>
                            </div>
                            <Switch
                                id="in-stock-switch"
                                checked={form.in_stock}
                                onCheckedChange={(checked) => setForm({ ...form, in_stock: checked })}
                            />
=======
                        <div className="flex flex-col gap-2">
                            <Label>Disponibilite</Label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, in_stock: true })}
                                    className={
                                        "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors " +
                                        (form.in_stock
                                            ? "border-success bg-success/10 text-success"
                                            : "border-border text-muted-foreground hover:border-success/40")
                                    }
                                >
                                    <PackageCheck className="h-4 w-4" />
                                    En stock
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, in_stock: false })}
                                    className={
                                        "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors " +
                                        (!form.in_stock
                                            ? "border-destructive bg-destructive/10 text-destructive"
                                            : "border-border text-muted-foreground hover:border-destructive/40")
                                    }
                                >
                                    <PackageX className="h-4 w-4" />
                                    Rupture de stock
                                </button>
                            </div>
>>>>>>> 6049a46d8d1609ab6f4044a8a89541f0b4092669
                        </div>

                        <ImageUploadField
                            id="product-image-upload"
                            label="Image du produit"
                            value={form.image}
                            onChange={(url) => setForm({ ...form, image: url })}
                            folder="products"
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={saving} className="gap-2">
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            {saving ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}