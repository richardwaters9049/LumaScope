"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import UploadForm from "@/components/UploadForm";

const DashboardPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Only show the toast if the user is authenticated
        if (localStorage.getItem("isAuthenticated") === "true") {
            // Show success toast after login and redirection to dashboard
            toast.success("Logged in successfully!! ✅", {
                duration: 3000, // Show for 2 seconds
            });
        } else {
            // If not authenticated, redirect to login page
            router.replace("/"); // Redirect to login page if not authenticated
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
