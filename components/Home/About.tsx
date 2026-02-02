
import { about, about2, about3 } from '@/assets';
import HomeLayout from './Layout';


export default function About() {
    return (
        <HomeLayout>
            <div className="space-y-24 mt-4">
                <img src={about.src} alt='about' className='w-full h-72 object-cover' />
                <div className="text-center text-zinc-400 text-4xl">
                    <p>Based in Nairobi, Paza Social Web</p>
                    <p>application acts as a direct bridge</p>
                    <p>between creative talent and opportunity.</p>
                    <p>We provide creators with a platform to</p>
                    <p>showcase their work and connect with</p>
                    <p>brands for collaborations.</p>
                </div>
                <div className="grid grid-cols-3">
                    <p className="text-orange-700"><i className="bi bi-grid-1x2-fill mr-2"></i>Our Story</p>
                    <p className='underline'>PAZA SOCIAL</p>
                    <p className='text-sm'>Our story began in Nairobi with a clear purpose: to ignite the potential of creators. We saw the gap between incredible talent and meaningful opportunity, and we built Paza Digital to bridge it. At the heart of our work is Paza Social, a web application crafted to be the intuitive space where creators can not only showcase their unique vision but also forge powerful connections with brands. We're driven by the mission to create seamless digital experiences that don't just connect, but actively foster growth and unlock a world of new possibilities for creators across every industry.</p>
                </div>

                <div className="grid grid-cols-3">
                    <p className="w-1/3 "></p>
                    <p className='underline'>VISION</p>
                    <p className='text-sm'>Be the premier space for collaboration in the creator economy. enabling strategic brand integration across diverse creative content. while allowing creators to connect with like minded talents to elevate their projects.</p>
                </div>

                <div className="text-4xl">
                    <p>BE PART OF</p>
                    <p>OUR COMMUNITY</p>
                    <p>WHAT IF YOUR NEXT <span className='text-orange-700'>BIG</span></p>
                    <p>CAMPAIGN STARTED HERE?</p>
                </div>

                <div className="flex justify-between">
                    <img src={about3.src} alt="paza" className='h-80 w-1/3 object-fill' />
                    <p className='text-right text-lg w-1/2'>Make it easy to collaborate with anyone around the world while maximizing the potential of every collaboration fostering a win- win scenario where creativity thrives and all the parties involved get to achieve their goals and objectives.</p>
                </div>

                <div>
                    <p className="text-orange-700"><i className="bi bi-grid-1x2-fill mr-2"></i>About Us</p>
                    <div className='text-zinc-400 space-y-2 leading-loose text-3xl font-bold tracking-wide'>
                        <p>OUR VALUES</p>
                        <p className="text-6xl font-bold text-white">ARE ROOTED IN</p>
                        <p>CREATIVITY</p>
                        <p>AUTHENTICITY, AND</p>
                        <p>COLLABORATION - </p>
                        <p>ENCOURAGING</p>
                        <p>ORIGINALITY, </p>
                        <p>BUILDING GENUINE</p>
                        <p>CONNECTIONS AND, </p>
                        <p>FOSTERING</p>
                        <p>PATNERSHIPS THAT</p>
                        <p>BRING IDEAS TO LIFE.</p>
                    </div>
                </div>

                <div className="text-center flex flex-col items-center space-y-2">
                    <p className='text-5xl font-bold '>BE PART OF</p>
                    <div className="flex items-center justify-center space-x-4 text-left">
                        <p className="text-sm w-1/3">Together, we create a powerful synergy that propels creativity, fuels innovation and unlocks endless possibilities. </p>
                        <img src={about2.src} alt="about us" className='h-80 w-1/3 object-cover' />
                        <p className='text-sm'>Join us at Paza and embark on a transformative journey.</p>
                    </div>
                    <p className='text-5xl font-bold'>OUR COMMUNITY</p>
                </div>
                <button className='border flex items-center mx-auto space-x-8 p-2'><p>Join Us Today</p><i className="bi bi-arrow-up-right"></i></button>

                <div className="h-24"></div>
            </div>
        </HomeLayout>
    );
}
