import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

export function NotificationsSection() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-balance">Notification</h1>
            </div>

            {/* Notification Preferences Card */}
            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email notifications</p>
                                <p className="text-sm text-muted-foreground">Receive updates via email</p>
                            </div>
                            <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Push notifications</p>
                                <p className="text-sm text-muted-foreground">Get notified on your devices</p>
                            </div>
                            <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Marketing updates</p>
                                <p className="text-sm text-muted-foreground">Product news and updates</p>
                            </div>
                            <Button variant="outline" size="sm">Configure</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Enable desktop notification</h3>
                            <p className="text-muted-foreground text-sm">
                                Decide whether you want to be notified of new message & updates
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Enable unread notification badge</h3>
                            <p className="text-muted-foreground text-sm">
                                Display a red indicator on of the notification icon when you have unread message
                            </p>
                        </div>
                        <Switch />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="font-medium">Enable unread notification badge</h3>

                        <RadioGroup defaultValue="mentions" className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <RadioGroupItem value="all" id="all" className="mt-1" />
                                <div>
                                    <Label htmlFor="all" className="font-medium">
                                        All new messages
                                    </Label>
                                    <p className="text-muted-foreground text-sm">
                                        Broadcast notifications to the channel for each new message
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <RadioGroupItem value="mentions" id="mentions" className="mt-1" />
                                <div>
                                    <Label htmlFor="mentions" className="font-medium">
                                        Mentions only
                                    </Label>
                                    <p className="text-muted-foreground text-sm">
                                        Only alert me in the channel if someone mentions me in a message
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <RadioGroupItem value="nothing" id="nothing" className="mt-1" />
                                <div>
                                    <Label htmlFor="nothing" className="font-medium">
                                        Nothing
                                    </Label>
                                    <p className="text-muted-foreground text-sm">Don't notify me anything</p>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Email notification</h3>
                            <p className="text-muted-foreground text-sm">
                                Substance can send you email notification for any new direct message
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Checkbox id="news" defaultChecked />
                            <div>
                                <Label htmlFor="news" className="font-medium">
                                    News & updates
                                </Label>
                                <p className="text-muted-foreground text-sm">
                                    New about product and features update
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox id="tips" defaultChecked />
                            <div>
                                <Label htmlFor="tips" className="font-medium">
                                    Tips & tutorials
                                </Label>
                                <p className="text-muted-foreground text-sm">
                                    Tips & trick in order to increase your performance efficiency
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox id="offers" />
                            <div>
                                <Label htmlFor="offers" className="font-medium">
                                    Offer & promotions
                                </Label>
                                <p className="text-muted-foreground text-sm">
                                    Promotion about product price & latest discount
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox id="reminders" />
                            <div>
                                <Label htmlFor="reminders" className="font-medium">
                                    Follow up reminder
                                </Label>
                                <p className="text-muted-foreground text-sm">
                                    Receive notification all the reminder that have been made
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


