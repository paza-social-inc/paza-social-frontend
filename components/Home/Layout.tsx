import Footer from './Footer';
import Navbar from './Navbar';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="bg-background w-full min-h-screen relative py-4 px-16">
            <Navbar />

            {children}

            <Footer showMain />
        </main>
    )
}
