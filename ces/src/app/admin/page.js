// Home page for Admin 
"use client";
import { useRouter } from "next/navigation";
import Card from "../components/Card";
import Image from "next/image";

export default function Home() {
    const router = useRouter();

    const adminOptions = [
        { 
        icon: "/film.svg", 
        label: "Manage Movie Info", 
        route: "/admin/manage-movies" 
        },
        { 
        icon: "/user.svg", 
        label: "Manage Users", 
        route: "/admin/manage-users" 
        },
        { 
        icon: "/admin.svg", 
        label: "Manage Admin", 
        route: "/admin/manage-admin" 
        },
        { 
        icon: "/reports.svg", 
        label: "View Reports", 
        route: "/admin/view-reports" 
        },
        { 
        icon: "/price.svg", 
        label: "Manage Pricing", 
        route: "/admin/manage-pricing" 
        },
    ]; // adminOptions

    return(
        <div className="min-h-screen p-8" style={{ background: 'var(--background)' }}>
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--off-white)' }}>
                    Admin Dashboard
                </h1>
                <div className="grid grid-cols-3 gap-6 mb-6">
                    {adminOptions.slice(0, 3).map((option, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(option.route)}>
                            <div className="flex flex-col items-center justify-center p-6">
                                <Image src={option.icon} alt={option.label} width={80} height={80} className="mb-4"/>
                                <h2 className="text-lg font-semibold text-center" style={{ color: 'var(--darkest)' }}> {option.label} </h2>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {adminOptions.slice(3, 5).map((option, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(option.route)}>
                            <div className="flex flex-col items-center justify-center p-6">
                                <Image src={option.icon} alt={option.label} width={80} height={80} className="mb-4"/>
                                <h2 className="text-lg font-semibold text-center" style={{ color: 'var(--darkest)' }}> {option.label} </h2>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    ); // return
} // AdminHomePage
