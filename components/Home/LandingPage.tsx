
import { hero2, hero3, land } from "@/assets"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Grid2X2 } from "lucide-react"
import HomeLayout from "./Layout"
import Service from "./Service"

export default function LandingPage() {
    return (
        <HomeLayout>
            <section className="mt-20 flex flex-col space-y-12">
                <p className={`dark:text-zinc-400 text-black w-1/2 md:text-xl text-lg`}>Paza bridges the gap between brands and creators, creating a space where collaboration thrives. Together, we turn ideas into reality. Exciting things are coming soon - keep an eye out!</p>

                <img src={land.src} alt="pazasocial" className="w-96 h-80 object-cover self-center relative" />
                <p className="text-[165px] drop-shadow-lg h-fit font-extrabold tracking-wider absolute inset-0 top-80 left-96 dark:text-white">PAZA</p>

                <section className="">
                    <div className="flex justify-between">
                        <img src={hero3.src} alt="social" className="w-[350px] h-[65vh]" />
                        <p className={`dark:text-zinc-400 text-black w-1/2 md:text-xl text-sm`}>Bring your ideas to life with Paza. We're creating a platform where brands and creators
                            unite to turn visions into reality. Exciting updates are coming soon - watch this space!
                        </p>
                    </div>
                    <div className={`text-[90px] dark:text-zinc-400 text-black relative`}>
                        <img src={hero2.src} alt="paza" className="w-[300px] h-[70vh] object-cover absolute right-12 -top-36" />
                        <p>HELPING</p>
                        <p className="mx-36 w-3/4">
                            BRANDS MEET
                        </p>
                        <div className="flex justify-end">
                            <div className="">CREATORS</div>
                        </div>
                    </div>
                </section>
                <div className="">
                    <p className={`dark:text-zinc-400 text-black w-1/2 md:text-xl text-sm`}>Feel something special with Paza. We align every detail to evoke emotion. Head to our landing
                        page and start your journey!
                    </p>
                </div>

                <div className="space-y-4">
                    <p className="flex text-orange-700 text-2xl items-center"><Grid2X2 className="mr-2" />Who is paza</p>
                    <p className="uppercase text-[48px]">At Paza, we bring together your favorite creators and trusted brands
                        <span className={`dark:text-zinc-400 text-zinc-500`}> to build and grow through impactful campaigns. Our platform simplifies collaboration, making it easy to connect, communicate, and bring your creative vision to life with a range of powerful features.</span></p>
                    <p className="cursor-pointer underline underline-offset-4 text-center">Learn More About Us <i className="bi bi-arrow-right ml-2"></i></p>
                </div>

                <div className={`relative dark:text-zinc-400 text-black`}>
                    <img src={land.src} alt="pazasocial" className="w-96 h-80 m-auto object-cover" />
                    <p className="absolute top-0 -right-4 w-1/3 md:text-xl text-sm">At paza we create the emotions, we make everything align with everything that we do.</p>
                    <p className="absolute bottom-0 -left-4 w-1/3 md:text-xl text-sm">At paza we create the emotions, we make everything align with everything that we do.</p>
                </div>

                <div className="text-[90px]">
                    <p className="text-center dark:text-zinc-400 text-black">COLLABORATE,</p>
                    <p className="text-orange-700">CREATE,</p>
                    <p className="text-center dark:text-zinc-400 text-black">ELEVATE.</p>
                </div>
                <div>
                    <div className="flex justify-between">
                        <p className="text-orange-700"><i className="bi bi-grid-1x2-fill mr-2"></i>Our Services</p>
                        <p className="text-right uppercase text-[40px] w-1/2">Explore Services Designed for <span className="text-orange-700">Creators</span> and <span className="text-orange-700">Brands</span> to Thrive Together</p>
                    </div>
                    <Service index="01" title="Create Patnerships" />
                    <Service index="02" title="Production" />
                    <Service index="03" title="Brand Strategy" />
                    <Service index="04" title="Content Production" />
                </div>
                <p className="cursor-pointer underline underline-offset-4 text-center">View Our Services <i className="bi bi-arrow-right ml-2"></i></p>

                <div className="text-right my-16">
                    <p className="text-orange-700"><i className="bi bi-grid-1x2-fill mr-2"></i>How It Works <span className="text-white text-[40px] mx-4">DIVE INTO HOW OUR <br></br>PLATFORM WORKS </span></p>
                </div>

                <div className="min-h-screen py-16">
                    <p className="text-orange-700"><i className="bi bi-grid-1x2-fill mr-2"></i>Get in touch</p>
                    <div className="grid grid-cols-2 mt-4">
                        <div>
                            <p className="text-[40px]">LET'S TALK ABOUT THE PROJECT!</p>
                            <p className="text-zinc-500">Have questions, feedback, or partnership ideas? We’d love to hear from you. Reach out and let’s make great things happen!</p>
                        </div>
                        <form className="space-y-8">
                            <div className="grid grid-cols-2 gap-2">
                                <Field>
                                    <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                                    <Input id="first-name" placeholder="John" />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                                    <Input id="last-name" placeholder="Doe" />
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email">Your email address</FieldLabel>
                                <Input id="email" type="email" placeholder="your@email.com" />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="message">Your message</FieldLabel>
                                <Textarea id="message" rows={8} placeholder="Tell us about your project..." />
                            </Field>
                            <Button variant="secondary" className="hover:bg-orange-700 max-w-xs w-full">
                                <p>Send Your Request</p> <ArrowRight className="h-6 w-6" />
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="divide-y divide-zinc-500">
                    {[
                        { title: "GENERAL", email: "info@pazasocial.com" },
                        { title: "YOUTUBE", email: "PazaDigital" },
                        { title: "TIKTOK", email: "PazaTiktok" },
                        { title: "JOIN US", email: "info@pazasocial.com" }
                    ].map((item, index) => (
                        <div key={index} className="flex cursor-pointer px-2 justify-between overflow-hidden   dark:text-zinc-500  py-4 relative group">
                            <span className="absolute dark:bg-zinc-200 bg-black bottom-0 left-0 w-full h-0 transition-all duration-300 ease-in-out group-hover:h-full" />
                            <p className="text-[25px] group-hover:dark:text-black group-hover:text-zinc-400
                     transition-colors duration-300 z-10 dark:text-zinc-400 text-black">
                                {item.title}
                            </p>
                            <p className="group-hover:dark:text-black group-hover:text-zinc-400
                     transition-colors duration-300 z-10 dark:text-zinc-400 text-black">
                                {item.email}
                            </p>
                        </div>
                    ))}
                </div>
                <p>Or visit</p>
                <div className="mb-8 divide-y divide-zinc-500">
                    {[
                        { title: "+254 422189529", email: "info@pazasocial.com" },
                        { title: "NAIROBI", email: "00100, Ronald Ngala pz Nairobi, Kenya" },
                        { title: "MOMBASA", email: "Mwarabu, Mombasa" },
                        { title: "NAKURU", email: "00231,Nakuru,Kenya" }
                    ].map((item, index) => (
                        <div key={index} className="flex px-2 justify-between overflow-hidden dark:text-zinc-500  py-4 relative group">
                            <span className="absolute dark:bg-zinc-200 bg-black bottom-0 left-0 w-full h-0 transition-all duration-300 ease-in-out group-hover:h-full" />
                            <p className="text-[25px] group-hover:dark:text-black
                       group-hover:text-zinc-400 transition-colors duration-300 z-10 dark:text-zinc-400 text-black">
                                {item.title}
                            </p>
                            <p className="group-hover:dark:text-black group-hover:text-zinc-400
                     transition-colors duration-300 z-10 dark:text-zinc-400 text-black">
                                {item.email}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </HomeLayout>
    )
}
