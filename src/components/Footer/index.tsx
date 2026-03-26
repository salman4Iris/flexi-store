'use client';
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">About Us</h3>
                <p className="text-gray-400">Your trusted online store for quality products.</p>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="#shop" className="text-gray-400 hover:text-white transition">Shop</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition">Contact</a></li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-400">Email: info@flexistore.com</p>
                <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <ul className="space-y-2">
                <li><a href="#facebook" className="text-gray-400 hover:text-white transition">Facebook</a></li>
                <li><a href="#twitter" className="text-gray-400 hover:text-white transition">Twitter</a></li>
                <li><a href="#instagram" className="text-gray-400 hover:text-white transition">Instagram</a></li>
                </ul>
            </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {currentYear} Flexi Store. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;