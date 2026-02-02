import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SecuritySection() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-balance">Password</h1>
                <p className="text-muted-foreground mt-1">
                    Remember, your password is your digital key to your account. Keep it safe, keep it secure!
                </p>
            </div>

            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current password</Label>
                        <Input id="currentPassword" type="password" defaultValue="••••••••" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New password</Label>
                        <Input id="newPassword" type="password" defaultValue="••••••••" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm new password</Label>
                        <Input id="confirmPassword" type="password" defaultValue="••••••••" />
                    </div>

                    <div className="flex justify-end">
                        <Button>Update</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>2-Step verification</CardTitle>
                    <CardDescription>
                        Your account holds great value to hackers. Enable two-step verification to safeguard
                        your account!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                                <span className="text-sm font-semibold text-red-600">G</span>
                            </div>
                            <div>
                                <h4 className="font-medium">Google Authenticator</h4>
                                <p className="text-muted-foreground text-sm">
                                    Using Google Authenticator app generates time-sensitive codes for secure logins.
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Activated
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                <span className="text-sm font-semibold text-blue-600">O</span>
                            </div>
                            <div>
                                <h4 className="font-medium">Okta Verify</h4>
                                <p className="text-muted-foreground text-sm">
                                    Receive push notifications from Okta Verify app on your phone for quick login
                                    approval.
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            Enable
                        </Button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                                <span className="text-sm font-semibold text-orange-600">@</span>
                            </div>
                            <div>
                                <h4 className="font-medium">E Mail verification</h4>
                                <p className="text-muted-foreground text-sm">
                                    Unique codes sent to email for confirming logins.
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            Enable
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Privacy & Security Card */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center">🛡️</div>
                        Privacy & Security
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Two-factor authentication</p>
                                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                            </div>
                            <Button variant="outline" size="sm">Enable</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Password & security</p>
                                <p className="text-sm text-muted-foreground">Update your password and security settings</p>
                            </div>
                            <Button variant="outline" size="sm">Manage</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Data export</p>
                                <p className="text-sm text-muted-foreground">Download your data</p>
                            </div>
                            <Button variant="outline" size="sm">Export</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}




