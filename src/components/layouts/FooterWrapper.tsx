"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const FooterWrapper = (): React.ReactElement | null => {
  const pathname = usePathname();
  const isCheckoutOrCart = pathname === "/checkout" || pathname === "/cart";

  // Hide footer on mobile during checkout and cart, show everywhere else
  if (isCheckoutOrCart) {
    return (
      <div className="hidden md:block">
        <Footer />
      </div>
    );
  }

  return <Footer />;
};

export default FooterWrapper;
