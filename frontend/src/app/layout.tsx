import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContextProvider from "@/providers/ContextProvider";

export const metadata: Metadata = {
  title: "Uptiq",
  description: "Uptiq is a scalable website monitoring platform that continuously checks the availability and performance of user-added services. Built with a distributed architecture using pollers, queues, and workers, it detects outages in real time and sends instant alerts through multiple notification channels.",
  authors: [
    {
      name: "Suhas Kanwar",
      url: "https://github.com/SuhasKanwar/Uptiq"
    },
    {
      name: "Suhas Kanwar",
      url: "https://suhaskanwar.vercel.app"
    }
  ],
  creator: "Suhas Kanwar",
  keywords: [
    "Website Monitoring",
    "Uptime Monitoring",
    "Service Availability",
    "Real-time Alerts",
    "Distributed Systems",
    "Queue-Based Architecture",
    "Worker Services",
    "Notification System",
    "Status Monitoring",
    "Performance Tracking",
    "Poller Services",
    "Scalable Monitoring",
    "Uptiq"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-(--background-color) text-(--white-color) overflow-x-hidden font-['Space_Grotesk']">
        <ContextProvider>
          <Navbar />
          {children}
          <Footer />
        </ContextProvider>
      </body>
    </html>
  );
}