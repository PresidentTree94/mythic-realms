import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="space-y-16 px-4 pt-16 max-w-7xl mx-auto">{children}</main>
    </>
  );
}
