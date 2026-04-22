"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { RiAddLine, RiDeleteBinLine, RiShoppingBagLine, RiLoader2Line } from "@remixicon/react";
import { BrandProduct, addBrandProduct, removeBrandProduct } from "@/lib/data/brands";
import toast from "react-hot-toast";

interface ProductManagerProps {
    businessId: number;
    initialProducts: BrandProduct[];
    onUpdate?: () => void;
}

export default function ProductManager({ businessId, initialProducts, onUpdate }: ProductManagerProps) {
    const [products, setProducts] = React.useState<BrandProduct[]>(initialProducts);
    const [isAdding, setIsAdding] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    // New product state
    const [newProduct, setNewProduct] = React.useState<Omit<BrandProduct, 'id'>>({
        productName: "",
        priceTier: "mid",
        purchaseCycle: "monthly",
        channel: []
    });

    const handleAddProduct = async () => {
        if (!newProduct.productName) return toast.error("Product name is required");
        
        setIsSubmitting(true);
        try {
            const res = await addBrandProduct(businessId, newProduct);
            if (res.success) {
                toast.success("Product added");
                setProducts([...products, res.data]);
                setOpen(false);
                setNewProduct({ productName: "", priceTier: "mid", purchaseCycle: "monthly", channel: [] });
                if (onUpdate) onUpdate();
            }
        } catch (err) {
            toast.error("Failed to add product");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this product?")) return;
        
        try {
            const res = await removeBrandProduct(businessId, id);
            if (res.success) {
                toast.success("Product removed");
                setProducts(products.filter(p => p.id !== id));
                if (onUpdate) onUpdate();
            }
        } catch (err) {
            toast.error("Failed to remove product");
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your brand's core product catalog.</CardDescription>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <RiAddLine className="mr-1 h-4 w-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Product Name</Label>
                                <Input 
                                    value={newProduct.productName}
                                    onChange={(e) => setNewProduct(p => ({ ...p, productName: e.target.value }))}
                                    placeholder="e.g. Classic Sneakers"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Price Tier</Label>
                                    <Select 
                                        value={newProduct.priceTier}
                                        onValueChange={(val: any) => setNewProduct(p => ({ ...p, priceTier: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Budget/Value</SelectItem>
                                            <SelectItem value="mid">Mid-Range</SelectItem>
                                            <SelectItem value="premium">Premium/Luxury</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Purchase Cycle</Label>
                                    <Select 
                                        value={newProduct.purchaseCycle}
                                        onValueChange={(val: any) => setNewProduct(p => ({ ...p, purchaseCycle: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="impulse">Impulse</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="annual">Annual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddProduct} disabled={isSubmitting}>
                                {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                                Create Product
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {products.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/30">
                        <RiShoppingBagLine className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <p className="text-muted-foreground">No products added yet.</p>
                        <Button variant="link" onClick={() => setOpen(true)}>Add your first product</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map(product => (
                            <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors">
                                <div className="space-y-1">
                                    <h4 className="font-semibold">{product.productName}</h4>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="capitalize">{product.priceTier}</Badge>
                                        <Badge variant="outline" className="capitalize">{product.purchaseCycle}</Badge>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(product.id)}>
                                    <RiDeleteBinLine className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
