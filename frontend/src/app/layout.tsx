import { ReactNode } from "react";
import "../app/globals.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
       <body className=" bg-gray-900 dark:bg-gray-900 transition-colors duration-300">
          <Header />
          <Sidebar />
          <main className="ml-70 pt-24 p-6">
            <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-all duration-300">
              {children}
            </div>
          </main>
      </body>
    </html>
  );
}