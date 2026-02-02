import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    RiDropboxLine,
    RiGithubLine,
    RiGitlabLine,
    RiInstagramLine,
    RiNotionLine,
    RiSlackLine,
    RiTiktokLine,
} from "@remixicon/react";


const integrations = [
    {
        name: "Tiktok",
        description: "Upload your files to Google Drive",
        icon: <RiTiktokLine />,
        enabled: true
    },
    {
        name: "Slack",
        description: "Post to a Slack channel",
        icon: <RiSlackLine />,
        enabled: true
    },
    {
        name: "Notion",
        description: "Retrieve notion note to your project",
        icon: <RiNotionLine />,
        enabled: false
    },
    {
        name: "Instagram",
        description: "Create posts on Instagram",
        icon: <RiInstagramLine />,
        enabled: false
    },
    {
        name: "Dropbox",
        description: "Exchange data with Dropbox",
        icon: <RiDropboxLine />,
        enabled: false
    },
    {
        name: "Github",
        description: "Exchange files with a GitHub repository",
        icon: <RiGithubLine />,
        enabled: false
    },
    {
        name: "Gitlab",
        description: "Exchange files with a Gitlab repository",
        icon: <RiGitlabLine />,
        enabled: false
    }
];



export function IntegrationsSection() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-balance">Integration</h1>
                <p className="text-muted-foreground mt-1">
                    Supercharge your workflow using these integration
                </p>
            </div>

            <div className="space-y-4">
                {integrations.map((integration) => (
                    <Card key={integration.name}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">{integration.icon}</div>
                                    <div>
                                        <h3 className="font-semibold">{integration.name}</h3>
                                        <p className="text-muted-foreground text-sm">{integration.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                                        Learn more
                                    </Button>
                                    <Switch defaultChecked={integration.enabled} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
