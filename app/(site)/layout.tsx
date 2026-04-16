import { Footer } from "../shared/Footer";
import { Navbar } from "../shared/Navbar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_0%_0%,var(--bg-accent-soft),transparent_45%),radial-gradient(circle_at_100%_0%,var(--bg-accent-soft-2),transparent_40%),var(--bg)] bg-[length:120%_120%] animate-[gradientShift_18s_ease-in-out_infinite]">
      <Navbar />
      <main className="flex-1 mt-10">{children}</main>
      <Footer />
    </div>
  );
}
