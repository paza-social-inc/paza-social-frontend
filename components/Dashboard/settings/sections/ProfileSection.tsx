
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
import { Upload, MapPin, User, Settings } from "lucide-react";

export function ProfileSection() {
    return (
        <div className="space-y-6 w-full">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-balance">Profile Settings</h1>
                <p className="text-muted-foreground">
                    Manage your personal information and account preferences
                </p>
            </div>

            {/* Profile Overview Card */}
            <Card className="overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="https://bundui-images.netlify.app/avatars/10.png" />
                                <AvatarFallback className="text-lg">AG</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-semibold">Angelina Gotelli</h2>
                                    <Badge variant="secondary" className="text-xs">Premium</Badge>
                                </div>
                                <p className="text-muted-foreground">carolyn_h@hotmail.com</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    New York, United States
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Photo
                            </Button>
                            <Button size="sm" variant="outline">
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information Card */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" defaultValue="Angelina" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" defaultValue="Gotelli" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" defaultValue="angelina_g" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display name</Label>
                            <Input id="displayName" defaultValue="Angelina G." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" type="email" defaultValue="carolyn_h@hotmail.com" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <div className="flex gap-2">
                            <Select defaultValue="us">
                                <SelectTrigger className="w-24">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="us">🇺🇸 +1</SelectItem>
                                    <SelectItem value="uk">🇬🇧 +44</SelectItem>
                                    <SelectItem value="ca">🇨🇦 +1</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input className="flex-1" defaultValue="121231234" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none"
                            placeholder="Tell us about yourself..."
                            defaultValue="Creative professional passionate about design and user experience."
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Address Information Card */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Address Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select defaultValue="us">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="us">🇺🇸 United States</SelectItem>
                                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                                <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="address">Street address</Label>
                            <Input id="address" defaultValue="123 Main Street" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apartment">Apartment/Suite</Label>
                            <Input id="apartment" placeholder="Apt 2B" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" defaultValue="New York" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State/Province</Label>
                            <Input id="state" defaultValue="NY" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal code</Label>
                            <Input id="postalCode" defaultValue="10001" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button variant="outline">Save Address</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

