'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Share2, Loader2 } from "lucide-react";
import { pazaApi } from "@/lib/axiosClients";
import toast from "react-hot-toast";

interface Visibility {
  email: boolean;
  phone: boolean;
  location: boolean;
  socials: boolean;
}

const VISIBILITY_ITEMS = [
  {
    key: "email" as const,
    label: "Email address",
    description: "Allow others to see your email in your inbox profile",
    icon: Mail,
  },
  {
    key: "phone" as const,
    label: "Phone number",
    description: "Allow others to see your phone number in your inbox profile",
    icon: Phone,
  },
  {
    key: "location" as const,
    label: "Location / City",
    description: "Allow others to see your city in your inbox profile",
    icon: MapPin,
  },
  {
    key: "socials" as const,
    label: "Social media links",
    description: "Allow others to see your connected social profiles",
    icon: Share2,
  },
];

export function PrivacySection() {
//   const [visibility, setVisibility] = useState<Visibility>({
//     email: false,
//     phone: false,
//     location: false,
//     socials: true,
//   });
  const [visibility, setVisibility] = useState<Visibility | null>(null);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // fetch current visibility on mount
  useEffect(() => {
    pazaApi
      .get("/api/users/me")
      .then((res) => {
        console.log("getMe response:", res.data);
        const vis = res.data?.data?.profileVisibility;
        console.log("profileVisibility from API:", vis);
        setAccountEmail(res.data?.data?.email ?? null);
        // #region agent log
        fetch('http://127.0.0.1:7652/ingest/df3d88ac-8592-4007-bdc8-b681ec8fbbe9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bdaae3'},body:JSON.stringify({sessionId:'bdaae3',location:'PrivacySection.tsx:load',message:'loaded visibility from getMe',data:{profileVisibility:vis,fullDataKeys:res.data?.data?Object.keys(res.data.data):[]},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        setVisibility(vis ?? {
          email: false,
          phone: false,
          location: false,
          socials: true,
        });
      })
      .catch((err) => {
        console.error("getMe error:", err);
        setVisibility({
          email: false,
          phone: false,
          location: false,
          socials: true,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (key: keyof Visibility) => {
    setVisibility((prev) => prev ? { ...prev, [key]: !prev[key] } : prev);
  };

  const handleSave = async () => {
    if (!visibility) return;
    setSaving(true);
    try {
      const res = await pazaApi.patch("/api/users/me/visibility", visibility);
      // #region agent log
      fetch('http://127.0.0.1:7652/ingest/df3d88ac-8592-4007-bdc8-b681ec8fbbe9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bdaae3'},body:JSON.stringify({sessionId:'bdaae3',location:'PrivacySection.tsx:save',message:'save visibility response',data:{sent:visibility,response:res.data},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      toast.success("Privacy settings saved");
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7652/ingest/df3d88ac-8592-4007-bdc8-b681ec8fbbe9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bdaae3'},body:JSON.stringify({sessionId:'bdaae3',location:'PrivacySection.tsx:saveError',message:'save visibility failed',data:{sent:visibility,error:String(err)},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      toast.error("Failed to save privacy settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Privacy</h1>
        <p className="text-muted-foreground mt-1">
          Control what others can see when they view your profile in messages.
          {accountEmail && (
            <span className="block mt-1 text-xs">
              Settings apply to account: <span className="font-medium text-foreground">{accountEmail}</span>
            </span>
          )}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile visibility</CardTitle>
          <CardDescription>
            Choose which pieces of information are visible to other users
            when they click your name in the inbox. Changes take effect
            after clicking Save changes.
        </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {loading || visibility === null ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            VISIBILITY_ITEMS.map(({ key, label, description, icon: Icon }, index) => (
              <div key={key}>
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 flex items-center justify-center rounded-full bg-muted">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <Label htmlFor={`vis-${key}`} className="text-sm font-medium cursor-pointer">
                        {label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                    </div>
                  </div>
                  <Switch
                    id={`vis-${key}`}
                    checked={visibility[key]}
                    onCheckedChange={() => handleToggle(key)}
                  />
                </div>
                {index < VISIBILITY_ITEMS.length - 1 && (
                  <div className="h-px bg-border" />
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || loading}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </div>
  );
}