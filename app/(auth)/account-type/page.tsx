import { AccountType } from "@/components/Auth/accountType/AccountType"
import Footer from "@/components/Home/Footer"
import NavBar from "@/components/Home/Navbar"

export default function page() {
    return (
        <main className="px-4 p-3">
            <NavBar />
            <AccountType />
            <Footer showMain={false} />
        </main>
    )
}