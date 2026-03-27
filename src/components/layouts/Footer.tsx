import Link from "next/link";
import Container from "../layout/Container";

const currentYear = new Date().getUTCFullYear();

export default function Footer() {
  return (
    <footer className="bg-(--color-bg) text-(--color-text) border-t mt-12">
      <Container className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg">Flexi-Store</h4>
            <p className="text-sm mt-2">Modern ecommerce starter — curated products & fast checkout.</p>
          </div>

          <div>
            <h5 className="font-semibold">Customer Service</h5>
            <ul className="mt-2 text-sm space-y-1">
              <li><Link href="#">Help Center</Link></li>
              <li><Link href="#">Returns</Link></li>
              <li><Link href="#">Shipping</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold">Company</h5>
            <ul className="mt-2 text-sm space-y-1">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Press</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold">Follow Us</h5>
            <ul className="mt-2 text-sm space-y-1">
              <li><Link href="#">Twitter</Link></li>
              <li><Link href="#">Instagram</Link></li>
              <li><Link href="#">Newsletter</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-sm text-muted-foreground flex flex-col sm:flex-row sm:justify-between gap-4">
          <span>© {currentYear} Flexi-Store. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="#">Terms</Link>
            <Link href="#">Privacy</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
