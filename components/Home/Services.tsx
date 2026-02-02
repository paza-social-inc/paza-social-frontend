
import { hero3, service } from '@/assets';
import HomeLayout from './Layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpToLine } from 'lucide-react';
import { RiArrowUpLine } from '@remixicon/react';




export default function Services() {
    return (
        <HomeLayout>
            <div className="relative space-y-24 py-24">
                <div className='absolute dark:text-white text-primary z-50 text-5xl font-bold leading-loose -top-0'>
                    <h1 className='mx-72'>BEYOND</h1>
                    <h1 className=''>TRANSACTIONS - UNITING</h1>
                    <h1 className=''>COMMUNITIES THAT BUILD WITH</h1>
                    <h1 className='mx-96'>AND SHAPE</h1>
                    <h1 className='absolute left-[55%]'>CULTURE</h1>
                </div>
                <div className="flex justify-between">

                    <div className="relative w-[450px] h-[90vh]">
                        <img src={service.src} alt="services" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black to-black opacity-70" />
                    </div>


                    <p className={`dark:text-zinc-500 md:text-lg text-base text-black w-1/3`}>Together we create a powerful synergy that propels creativity fuels innovation and unlocks endless possibilities.Join us at Paza and embark on a transformative journey.</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className={`dark:text-zinc-500 text-black w-1/3 md:text-lg text-base`}>Together we create a powerful synergy that propels creativity fuels innovation and unlocks endless possibilities.Join us at Paza and embark on a transformative journey.</p>
                    <img src={hero3.src} alt="services" className="w-[450px] h-[90vh] object-cover absolute right-0 top-72 brightness-50" />
                </div>
                <button className='mt-24 border border-white w-56 p-2 flex text-center space-x-4'><p>Lets talk about project</p> <i className='bi bi-arrow-right'></i></button>
                <div className="flex space-x-12">
                    <p className="text-orange-700"><i className="bi bi-grid-1x2-fill mr-2"></i>Our Services</p>
                    <p className='text-3xl'>EXPLORE SERVICES DESIGNED FOR <span className="text-orange-700">CREATORS</span><br></br> AND <span className="text-orange-700">BRANDS</span> TO THRIVE</p>
                </div>
                <div className="flex justify-between items-center font-bold text-2xl">
                    <p>Brands</p>
                    <p className='w-3/4 text-center border-b border-orange-800 text-zinc-500'>Creators</p>
                </div>
                <div className="flex justify-between ">
                    <p>(01)</p>
                    <div className='leading-loose w-3/4'>
                        <p className='font-bold text-lg'>Effortless Collaboration</p>
                        <p>Smart Matching – AI-powered system connects brands with the right creators based on audience, style, and engagement.</p>
                        <p>Seamless Communication – In-app messaging & collaboration tools to keep discussions organized.</p>
                        <p>Approval Workflows – Brands can review, request edits, and approve content before it goes live.</p>
                    </div>
                </div>
                <div className="flex justify-between">
                    <p>(02)</p>
                    <div className='leading-loose w-3/4'>
                        <p className='font-bold text-lg'>Campaign Management</p>
                        <p>End-to-End Dashboard – Create, manage, and track all influencer campaigns in one place.</p>
                        <p>Seamless Communication – In-app messaging & collaboration tools to keep discussions organized.</p>
                        <p>Approval Workflows – Brands can review, request edits, and approve content before it goes live.</p>
                    </div>
                </div>

                <div className="flex justify-between">
                    <p>(03)</p>
                    <div className='leading-loose'>
                        <p className='font-bold text-lg'>Transparent Payments & Rewards</p>
                        <p>Smart Matching – AI-powered system connects brands with the right creators based on audience, style, and engagement.</p>
                        <p>Seamless Communication – In-app messaging & collaboration tools to keep discussions organized.</p>
                        <p>Approval Workflows – Brands can review, request edits, and approve content before it goes live.</p>
                    </div>
                </div>

                <div className="flex space-x-12">
                    <p className="text-orange-700"><i className="bi bi-grid-1x2-fill mr-2"></i>Pricing</p>
                    <p className='text-3xl'>LET VALUE DRIVEN <span className="text-orange-700">PATNERSHIPS</span><br></br>POWER YOUR REVENUE</p>
                </div>
                <div>
                    <div className="flex font-bold text-2xl">
                        <p className='w-1/4 border-b-4 border-orange-800 text-center '>Brands</p>
                        <p className='mx-24 text-zinc-500'>Creator</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-4 mt-8">
                        <div className='space-y-4 text-sm text-zinc-400 p-2 lg:border-r lg:border-zinc-500 uppercase'>
                            <p>Free plan</p>
                            <p>Sh <span className='text-3xl font-semibold text-white'>0</span>/MONTH </p>
                            <p className="lowercase">Use Paza’s job board to post campaigns (for brands) or apply to opportunities (for creators), connecting with potential partners.</p>
                            <p>8% retainer fee(service charge + marketing change)</p>
                            <p>20 job swipes a day</p>
                            <p>20 showcase swipes a day</p>
                            <p>1 campaign</p>
                            <p>5 tasks per campaign</p>
                            <p>upto 5 members in a campaign</p>
                            <p>2 users per account</p>
                            <p>email support</p>
                            <Button className='flex-1 w-full'>
                                Get Started
                            </Button>
                        </div>
                        <div className='space-y-4 text-sm text-zinc-400 p-2 lg:border-r lg:border-zinc-500 uppercase'>
                            <p>Monthly plan</p>
                            <p>Sh <span className='text-3xl font-semibold text-white'>6,200</span>/MONTH </p>
                            <p className='lowercase'>Use Paza’s job board to post campaigns (for brands) or apply to opportunities (for creators), connecting with potential partners.</p>
                            <p>6% retainer fee</p>
                            <p>50 job swipes a day</p>
                            <p>50 showcase swipes a day</p>
                            <p>100 campaigns</p>
                            <p>50 tasks per campaign</p>
                            <p>upto 100 members in a campaign</p>
                            <p>2 users per account</p>
                            <p>email support</p>
                            <Button className='flex-1 w-full'>
                                Get Started
                            </Button>
                        </div>
                        <div className='space-y-4 text-sm text-zinc-400 p-2 uppercase'>
                            <p>One time plan</p>
                            <p>Sh <span className='text-3xl font-semibold text-white'>32,000</span>/MONTH </p>
                            <p className='lowercase'>Use Paza’s job board to post campaigns (for brands) or apply to opportunities (for creators), connecting with potential partners.</p>
                            <p>unlimited job post a month</p>
                            <p>unlimited proposal approvals per post</p>
                            <p>unlimitedshowcase swipes a day</p>
                            <p>unlimited campaigns</p>
                            <p>unlimited tasks per campaign</p>
                            <p>unlimited members in a campaign</p>
                            <p>unlimited users per account</p>
                            <p>email support</p>
                            <p className='text-center'>Additional services</p>
                            <div className='flex gap-3 items-center'>
                                <Checkbox title='upto 3 managed campaigns' value="managed campaigns" checked />
                                <p>Manage Campaigns</p>
                            </div>
                            <div className='flex gap-3 items-center'>

                                <Checkbox title='marketing' value="managed campaigns" />
                                <p>Marketing</p>
                            </div>
                            <div>

                                <Button className='flex-1 w-full'>
                                    Get Started
                                </Button>

                            </div>

                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-8 mt-8">
                        <p className='text-3xl'>WHAT IF YOUR NEXT <br></br> <span className='text-orange-700'>CAMPAIGN</span> STARTED HERE?</p>
                        <p className='text-zinc-500 w-1/2 text-center'>Connect with the right creators, launch impactful campaigns, and watch your brand grow. Join us and be among the first to experience seamless brand-creator collaborations.</p>
                        <Button variant="outline" ><p>Get Early Access </p><RiArrowUpLine className='rotate-45 h-12' /></Button>
                    </div>

                    <div className="h-24"></div>

                </div>
            </div>
        </HomeLayout>
    );
}
