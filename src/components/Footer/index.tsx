'use client';
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--color-primary)] text-[var(--color-text)] py-12\">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">About Us</h3>
                <p className="text-[var(--color-text)] opacity-75">Your trusted online store for quality products.</p>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Quick Links</h3>
                <ul className="space-y-2">
                <li><a href="#home" className="text-[var(--color-text)] opacity-75 hover:opacity-100 transition">Home</a></li>
                <li><a href="#shop" className="text-[var(--color-text)] opacity-75 hover:opacity-100 transition">Shop</a></li>
                <li><a href="#about" className="text-[var(--color-text)] opacity-75 hover:opacity-100 transition">About</a></li>
                <li><a href="#contact" className="text-[var(--color-text)] opacity-75 hover:opacity-100 transition">Contact</a></li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Contact</h3>
                <p className="text-[var(--color-text)] opacity-75">Email: info@flexistore.com</p>
                <p className="text-[var(--color-text)] opacity-75">Phone: +1 (555) 123-4567</p>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Follow Us</h3>
                <ul className="space-y-2">
                <li><a href="#facebook" className="text-[var(--color-text)] opacity-75 hover:opacity-100 transition">Facebook</a></li>
                <li><a href="#twitter" className="text-[var(--color-text)] opacity-75 hover:opacity-100 transition">Twitter</a></li>
                <li><a href="#instagram" className="text-[var(--color-text)] opacity-75 hover:opacity-100 transition">Instagram</a></li>
                </ul>
            </div>
            </div>

            <div className="border-t border-[var(--color-text)] border-opacity-20 mt-8 pt-8 text-center text-[var(--color-text)] opacity-75\">
            <p>&copy; {currentYear} Flexi Store. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;