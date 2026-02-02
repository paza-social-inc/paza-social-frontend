
'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image";
import {
    RiMapPinLine,
    RiArrowLeftLine,
    RiArrowRightLine
} from "@remixicon/react"


const collaborators = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Kevin Hart" },
    { id: 4, name: "Lisa Ray" },
]

export function ProjectSidebar() {
    return (
        <aside className="flex flex-col items-start bg-black text-white w-full md:w-1/3 md:min-w-xs space-y-6">
            {/* Navigation Buttons */}
            <div className="flex w-full justify-between">
                <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white w-[48%]"
                >
                    <RiArrowLeftLine /> Previous
                </Button>
                <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white w-[48%]"
                >
                    Next <RiArrowRightLine />
                </Button>
            </div>

            {/* Profile Card */}
            <Card className="bg-transparent border border-primary rounded-xl p-4 text-white w-full">
                <div className="flex items-center justify-between gap-3">
                    <div className="aspect-square bg-gray-800 rounded-full flex items-center justify-center">
                        <Image
                            src="https://images.unsplash.com/photo-1680899010894-e9838a5e70ea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=327"
                            alt="user"
                            width={48}
                            height={48}
                            className="rounded-full object-cover w-18 h-18"
                        />
                    </div>
                    <div>
                        <h2 className="font-semibold text-white">Denzel Washington</h2>
                        <p className="text-sm text-gray-400">Arts & Creativity</p>
                        <p className="text-sm text-primary font-medium">
                            Pro: 100000 - 500000 reach
                        </p>
                        <div className="flex items-center text-gray-400 text-sm">
                            <RiMapPinLine size={14} className="mr-1" /> Nanyuki
                        </div>
                    </div>
                </div>
            </Card>

            {/* Project Details */}
            <div className="w-full">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">FirstTrial</h3>
                    <span className="text-sm text-gray-300 border-b border-primary cursor-pointer">
                        View Openings
                    </span>
                </div>
                <p className="text-gray-400 text-sm mt-2 mb-4">Description</p>

                <Button className="bg-primary text-white w-full hover:opacity-90">
                    Collaborate
                </Button>

                {/* Collaborators */}
                <div className="mt-4 flex items-end-safe justify-end gap-4">
                    <p className="text-sm text-primary font-medium mb-2">
                        Collaborators
                    </p>
                    <div className="flex -space-x-2">
                        {collaborators.map((user) => (
                            <img
                                key={user.id}
                                src={`https://placehold.co/36x36?text=${user.name.charAt(0)}`}
                                alt={user.name}
                                width={36}
                                height={36}
                                className="rounded-full border border-primary"
                            />
                        ))}                    </div>
                </div>
            </div>
        </aside>
    )
}
