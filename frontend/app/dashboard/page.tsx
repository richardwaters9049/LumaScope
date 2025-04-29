"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import UploadForm from "@/components/UploadForm";

const DashboardPage = () => {
    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        const justLoggedIn = localStorage.getItem("justLoggedIn") === "true";

        if (isAuthenticated) {
            if (justLoggedIn) {
                toast.success("Logged in successfully!!! ✅", {
                    duration: 1500,
                });
                localStorage.removeItem("justLoggedIn");
            }
        } else {
            router.replace("/");
        }
    }, [router]);

    return (
        <div>
            <Navbar />
            <UploadForm />
        </div>
    );
};

export default DashboardPage;
