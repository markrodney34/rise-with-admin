import Navbar from "@/components/Navbar"; import Footer from "@/components/Footer"; import MobileBottomNav from "@/components/MobileBottomNav";
export default function SiteLayout({ children }: { children: React.ReactNode }) { return (<><Navbar /><div className="mobile-app-shell"><main>{children}</main><Footer /></div><MobileBottomNav /></>); }
