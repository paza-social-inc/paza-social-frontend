"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

type BaseProps = {
    value?: number
    variant?: "linear" | "radial"
}

type LinearProgressProps = BaseProps &
    React.ComponentProps<typeof ProgressPrimitive.Root>

type RadialProgressProps = BaseProps &
    React.ComponentProps<"svg"> & {
        size?: number
        strokeWidth?: number
        label?: string
    }

type ProgressProps = LinearProgressProps | RadialProgressProps

export function Progress(props: ProgressProps) {
    const {
        variant = "linear",
        value = 0,
        className,
        ...rest
    } = props as any

    if (variant === "radial") {
        const {
            size = 64,
            strokeWidth = 6,
            label = "Progress",
            ...svgProps
        } = rest as RadialProgressProps

        const radius = (size - strokeWidth) / 2
        const circumference = 2 * Math.PI * radius
        const offset = circumference - (value / 100) * circumference
        const center = size / 2

        return (
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className={cn("text-primary", className)}
                {...svgProps}
            >
                {/* Background circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.2"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                    className="transition-all duration-300"
                />
                {/* Centered text (title and description) */}
                <text
                    x={center}
                    y={center}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-sans"
                >
                    <tspan
                        x={center}
                        dy="-0.2em"
                        className="fill-foreground text-[1.25rem] font-bold"
                    >
                        {value}%
                    </tspan>
                    <tspan
                        x={center}
                        dy="1.4em"
                        className="fill-muted-foreground text-[0.75rem]"
                    >
                        {label}
                    </tspan>
                </text>
            </svg>
        )
    }

    // Linear Progress
    const linearProps = rest as LinearProgressProps

    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
                className
            )}
            {...linearProps}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="bg-primary h-full transition-all"
                style={{ transform: `translateX(-${100 - value}%)` }}
            />
        </ProgressPrimitive.Root>
    )
}
