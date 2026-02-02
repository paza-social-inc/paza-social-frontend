'use client'

import React from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export function ProjectCarousel() {

    const [activeTab, setActiveTab] = React.useState("about");

    const images = [
        "https://images.unsplash.com/photo-1586228044731-58323b1387f4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1031",
        "https://images.unsplash.com/photo-1687322484985-ceef04a67288?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=840",
        "https://images.unsplash.com/photo-1745878248949-06f72332f260?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387",
        "https://images.unsplash.com/photo-1564114330597-e94389745905?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
    ]

    return (
        <div className="flex flex-col  w-full md:w-3/4">
            <Carousel className="w-full max-w-4xl">
                <CarouselContent>
                    {images.map((src, idx) => (
                        <CarouselItem key={idx}>
                            <Card className="overflow-hidden shadow-lg p-0">
                                <CardContent className="p-0">
                                    <Image
                                        src={src}
                                        alt={`slide-${idx}`}
                                        width={1000}
                                        height={600}
                                        className="w-full h-[480px] object-cover"
                                    />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="bg-primary text-white hover:opacity-80 absolute left-5 top-1/2 h-11 w-11" />
                <CarouselNext className="bg-primary text-white hover:opacity-80 absolute right-5 top-1/2 h-11 w-11" />
            </Carousel>

            <div className="flex gap-2 my-6 mx-auto max-w-md">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="w-3 h-3 rounded-full bg-gray-300" />
            </div>


            <div className="pt-6 pb-2">
                <div className="flex gap-8 border-b">
                    <button
                        onClick={() => setActiveTab("about")}
                        className={`pb-2 font-medium ${activeTab === "about" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
                    >
                        About
                    </button>
                    <button
                        onClick={() => setActiveTab("progress")}
                        className={`pb-2 font-medium ${activeTab === "progress" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
                    >
                        Progress
                    </button>
                    <button
                        onClick={() => setActiveTab("faqs")}
                        className={`pb-2 font-medium ${activeTab === "faqs" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
                    >
                        Q & A's
                    </button>
                </div>
            </div>



            <div className="py-6">
                {activeTab === "about" && (
                    <div className="space-y-6">
                        about
                    </div>
                )}

                {activeTab === "progress" && (
                    <div className="space-y-6">
                        progress
                    </div>
                )}

                {activeTab === "faqs" && (
                    <div className="space-y-6">
                        faqs
                    </div>
                )}
            </div>


        </div>
    )
}
