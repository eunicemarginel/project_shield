import "./globals.css";

export const metadata = { title: "Shield" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-blue-50 text-slate-800">
                {children}
            </body>
        </html>
    );
}
