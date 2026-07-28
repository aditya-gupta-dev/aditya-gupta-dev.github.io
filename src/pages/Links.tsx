import { Label } from "@/components/ui/8bit/label";
import { Card, CardContent } from "@/components/ui/8bit/card";
import { Instagram } from "@/svgs/instagram";
import { YouTube } from "@/svgs/youtube";
import type { JSX } from "react/jsx-runtime";
import { Navbar } from "@/components/layout/Navbar";
import { LinkedIn } from "@/svgs/linkedin";
import { Threads } from "@/svgs/threads";
import { Facebook } from "@/svgs/facebook";
import { xAI as XIcon } from "@/svgs/x";

interface SocialHandle {
    url: string;
    label: string;
    username: string;
    icon: JSX.Element
}

const social_handles: SocialHandle[] = [
    {
        url: "https://www.instagram.com/cto.adi/",
        label: "Instagram",
        username: "cto.adi",
        icon: <Instagram />
    },
    {
        url: "https://www.youtube.com/@adi-builds?sub_confirmation=1",
        username: "@adi-builds",
        label: "Youtube",
        icon: <YouTube />
    },
    {
        url: "https://www.linkedin.com/in/aditya-gupta-75b528380?utm_source=share_via&utm_content=profile",
        username: "aditya-gupta-75b528380",
        label: "LinkedIn",
        icon: <LinkedIn />
    },
    {
        url: "https://www.threads.com/@cto.adi",
        username: "cto.adi",
        label: "Threads",
        icon: <Threads />
    }, 
    { 
        url: "https://www.facebook.com/share/14nuHNCu6WR/", 
        username: "cto.adi",
        label: "Facebook",
        icon: <Facebook/>
    }, 
    { 
        url: "https://x.com/adi_builds", 
        label: "X(twitter)",
        username: "adi_builds",
        icon: <XIcon/>
    }
]

export default function Links() {
    return (
        <div className="relative flex flex-col min-h-screen w-full items-center pt-32 pb-32 px-4 bg-background">
            <Navbar />
            <Label className="text-4xl md:text-5xl mb-12 tracking-wider">Socials</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl z-10">
                {social_handles.map((handle) => (
                    <a
                        key={handle.label}
                        href={handle.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full hover:-translate-y-2 transition-transform duration-200"
                    >
                        <Card className="w-full">
                            <CardContent className="flex flex-row items-center p-6 gap-6 w-full">
                                {/* Icon container (rounded square) */}
                                <div className="flex-shrink-0 w-20 h-20 bg-muted/10 border-4 border-foreground dark:border-ring rounded-xl flex items-center justify-center p-3">
                                    <div className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                                        {handle.icon}
                                    </div>
                                </div>

                                {/* Text container */}
                                <div className="flex flex-col justify-center items-start flex-1 min-w-0">
                                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-foreground truncate w-full text-left">
                                        {handle.label}
                                    </h3>
                                    <p className="text-sm md:text-base text-muted-foreground truncate w-full text-left">
                                        {handle.username}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                ))}
            </div>
        </div>
    )
}

