import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, MapPin, User, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { fetchAuthMe } from "@/lib/data/auth";
import { getCreatorProfile, updateFullCreatorProfile, uploadCreatorAvatar, CreatorProfile } from "@/lib/data/creator";
import { getBrandProfile, updateBrandIdentity, uploadBrandLogo, ApiResponse, BrandProfile } from "@/lib/data/brands";
import toast from "react-hot-toast";

export function ProfileSection() {
    const queryClient = useQueryClient();
    const { } = useAuth();
    
    // Fetch user and profile data
    const { data: authMe, isLoading: authLoading } = useQuery({
        queryKey: ["auth-me"],
        queryFn: fetchAuthMe,
    });

    const isCreator = authMe?.accountType?.toLowerCase() === "creator";
    const isBrand = authMe?.accountType?.toLowerCase() === "business" || authMe?.accountType?.toLowerCase() === "brand";
    const businessId = authMe?.businessId || (authMe?.id ? Number(authMe.id) : null);

    const { data: creatorProfileResult, isLoading: creatorLoading } = useQuery({
        queryKey: ["creator-profile"],
        queryFn: getCreatorProfile,
        enabled: isCreator,
    });

    const { data: brandProfileResult, isLoading: brandLoading } = useQuery({
        queryKey: ["brand-profile"],
        queryFn: () => getBrandProfile(businessId!),
        enabled: isBrand && !!businessId,
    });

    const creatorProfile = creatorProfileResult?.data;
    const brandProfile = brandProfileResult?.data;
    const authMeWithMedia = authMe as (typeof authMe & { avatarUrl?: string; profilePhotoUrl?: string }) | null;
    const creatorWithMedia = creatorProfile as (typeof creatorProfile & { avatarUrl?: string; profilePhotoUrl?: string }) | undefined;
    const brandWithMedia = brandProfile as (typeof brandProfile & { logoUrl?: string; profilePhotoUrl?: string }) | undefined;
    const profileImageSrc =
        creatorWithMedia?.avatar ||
        creatorWithMedia?.avatarUrl ||
        creatorWithMedia?.profilePhotoUrl ||
        brandWithMedia?.logo ||
        brandWithMedia?.logoUrl ||
        brandWithMedia?.profilePhotoUrl ||
        authMeWithMedia?.avatar ||
        authMeWithMedia?.avatarUrl ||
        authMeWithMedia?.profilePhotoUrl ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${authMe?.email}`;

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        displayName: "",
        email: "",
        phone: "",
        bio: "",
        address: "",
        city: "",
        country: "ke"
    });

    // Initialize form data when raw data arrives
    useEffect(() => {
        if (authMe) {
            setFormData(prev => ({
                ...prev,
                firstName: authMe.firstName || "",
                lastName: authMe.lastName || "",
                email: authMe.email || ""
            }));
        }
        if (creatorProfile) {
            setFormData(prev => ({
                ...prev,
                username: creatorProfile.creatorname || "",
                displayName: creatorProfile.creatorname || "",
                bio: creatorProfile.about || "",
                country: creatorProfile.locales?.[0]?.country || "ke",
                city: creatorProfile.locales?.[0]?.city || "",
            }));
        } else if (brandProfile) {
            setFormData(prev => ({
                ...prev,
                username: brandProfile.brandname || "",
                displayName: brandProfile.displayName || "",
                bio: brandProfile.description || "",
                country: brandProfile.operatingRegions?.[0]?.country || "ke",
                city: brandProfile.operatingRegions?.[0]?.city || "",
            }));
        }
    }, [authMe, creatorProfile, brandProfile]);

    // Mutations
    const updateProfileMutation = useMutation<ApiResponse<BrandProfile | CreatorProfile>, Error, Record<string, unknown>>({
        mutationFn: async (data: Record<string, unknown>) => {
            if (isCreator) return updateFullCreatorProfile(data) as Promise<ApiResponse<BrandProfile | CreatorProfile>>;
            if (isBrand && businessId) return updateBrandIdentity(businessId, data) as Promise<ApiResponse<BrandProfile | CreatorProfile>>;
            throw new Error("Invalid account type");
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["auth-me"] });
            queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
            queryClient.invalidateQueries({ queryKey: ["brand-profile"] });
        },
        onError: () => {
            toast.error("Failed to update profile");
        }
    });

    const uploadAvatarMutation = useMutation<ApiResponse<{ avatar?: string; logo?: string }>, Error, File>({
        mutationFn: async (file: File) => {
            if (isCreator) return uploadCreatorAvatar(file) as Promise<ApiResponse<{ avatar?: string; logo?: string }>>;
            if (isBrand && businessId) return uploadBrandLogo(businessId, file) as Promise<ApiResponse<{ avatar?: string; logo?: string }>>;
            throw new Error("Invalid account type");
        },
        onSuccess: () => {
            toast.success("Photo uploaded successfully");
            queryClient.invalidateQueries({ queryKey: ["auth-me"] });
            queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
            queryClient.invalidateQueries({ queryKey: ["brand-profile"] });
        },
        onError: () => {
            toast.error("Failed to upload photo");
        }
    });

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadAvatarMutation.mutate(file);
        }
    };

    const handleSave = () => {
        // Map form to specific API payload
        if (isCreator) {
            updateProfileMutation.mutate({
                creatorname: formData.username,
                about: formData.bio,
                locales: formData.city ? [{ country: formData.country, city: formData.city }] : []
            });
        } else if (isBrand) {
            updateProfileMutation.mutate({
                brandname: formData.username,
                displayName: formData.displayName,
                description: formData.bio,
                address: formData.address,
                operatingRegions: formData.city ? [{ country: formData.country, city: formData.city }] : []
            });
        }
    };

    const isLoading = authLoading || (isCreator && creatorLoading) || (isBrand && brandLoading);

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full pb-10">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-balance">Profile Settings</h1>
                <p className="text-muted-foreground">
                    Manage your personal information and account preferences
                </p>
            </div>

            {/* Profile Overview Card */}
            <Card className="overflow-hidden border-border/50">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
                                    <AvatarImage src={profileImageSrc} />
                                    <AvatarFallback className="text-lg bg-orange-100 text-orange-700">
                                        {authMe?.firstName?.[0]}{authMe?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                {uploadAvatarMutation.isPending && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1 text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <h2 className="text-xl font-semibold">
                                        {authMe?.firstName} {authMe?.lastName}
                                    </h2>
                                    {authMe?.isVerified && (
                                        <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-600 border-blue-100">Verified</Badge>
                                    )}
                                </div>
                                <p className="text-muted-foreground text-sm">{authMe?.email}</p>
                                <p className="text-xs font-medium text-primary uppercase tracking-wider">
                                    {authMe?.accountType} Account
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Input
                                type="file"
                                id="avatar-input"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                            />
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 sm:flex-none"
                                onClick={() => document.getElementById("avatar-input")?.click()}
                                disabled={uploadAvatarMutation.isPending}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Change Photo
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information Card */}
            <Card className="border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5 text-primary" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input 
                                id="firstName" 
                                value={formData.firstName} 
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input 
                                id="lastName" 
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                placeholder="Enter last name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Handle / Username</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                                <Input 
                                    id="username" 
                                    className="pl-8"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, "")})}
                                    placeholder="username"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display name</Label>
                            <Input 
                                id="displayName" 
                                value={formData.displayName}
                                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                                placeholder="Public name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            value={formData.email} 
                            disabled
                            className="bg-muted/50"
                        />
                        <p className="text-[10px] text-muted-foreground">Email cannot be changed manually. Contact support to update.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Tell us about yourself..."
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button 
                            onClick={handleSave} 
                            disabled={updateProfileMutation.isPending}
                            className="min-w-[120px]"
                        >
                            {updateProfileMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Address Information Card */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                        Address Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select 
                            value={formData.country} 
                            onValueChange={(val) => setFormData({...formData, country: val})}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ke">🇰🇪 Kenya</SelectItem>
                                <SelectItem value="us">🇺🇸 United States</SelectItem>
                                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                                <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="address">Street address</Label>
                            <Input 
                                id="address" 
                                placeholder="123 Main Street" 
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input 
                                id="city" 
                                placeholder="Nairobi" 
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button 
                            variant="outline" 
                            onClick={handleSave}
                            disabled={updateProfileMutation.isPending}
                        >
                            {updateProfileMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : "Save Address"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

