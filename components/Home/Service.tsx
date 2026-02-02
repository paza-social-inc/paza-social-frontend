import { ArrowUpRight } from "lucide-react";

interface ServiceProps {
    index: string;
    title: string;
}

export default function Service(props: ServiceProps) {
    return <>
        <div className={`grid grid-cols-4 items-center mt-12 dark:text-zinc-400 text-black`}>
            <p>{props.index}</p>
            <p className="text-xs">Click to open</p>
            <p className={`text-[25px] dark:text-zinc-300 text-black`}>{props.title}</p>
            <p className="flex justify-end">
                <ArrowUpRight className={`dark:text-zinc-300 text-black text-lg`} />
            </p>
        </div>
        {/* <hr className="border-zinc-500"></hr> */}
    </>
}
