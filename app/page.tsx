import Image from "next/image";
import PricingDisplay from "./components/PricingDisplay";

export default function Home() {
  const supportedCurrencies = [
    {'code': 'NGN', 'symbol': '₦', 'name': 'Naira (₦)'},
    {'code': 'USD', 'symbol': '$', 'name': 'Dollar ($)'},
    {'code': 'GBP', 'symbol': '£', 'name': 'Pound (£)'},
    {'code': 'EUR', 'symbol': '€', 'name': 'Euro (€)'},
    {'code': 'XOF', 'symbol': 'CFA', 'name': 'CFA Franc (CFA)'},
    {'code': 'KES', 'symbol': 'KSh', 'name': 'Kenyan Shilling (KSh)'},
    {'code': 'ZAR', 'symbol': 'R', 'name': 'Rand (R)'},
    {'code': 'INR', 'symbol': '₹', 'name': 'Rupee (₹)'},
    {'code': 'GHS', 'symbol': 'GH₵', 'name': 'Ghana Cedi (GH₵)'},
    {'code': 'AED', 'symbol': 'AED', 'name': 'Dirham (AED)'},
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 border-b border-zinc-200">
        <div className="flex items-center">
          <Image 
            src="https://res.cloudinary.com/dijhekwvl/image/upload/v1766146257/IMG_9619_ilwzns.jpg" 
            alt="Reventory Logo" 
            width={120}
            height={40}
            className="h-8 sm:h-10 w-auto rounded-lg"
            priority
          />
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-6 items-center justify-center text-sm">
          <a href="#features" className="text-zinc-700 hover:text-black transition font-medium">
            Features
          </a>
          <a href="#pricing" className="text-zinc-700 hover:text-black transition font-medium">
            Pricing
          </a>
          <a href="#faq" className="text-zinc-700 hover:text-black transition font-medium">
            FAQ
          </a>
          <a 
            href="https://apps.apple.com/ng/app/reventory/id6747654868"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 sm:px-5 py-2 bg-black text-white rounded-md hover:bg-zinc-800 transition font-medium"
          >
            Download
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 bg-zinc-100 rounded-full text-xs sm:text-sm font-medium text-zinc-700">
              Free to Start • Upgrade Anytime
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 sm:mb-6 text-black leading-tight">
              Replace Notebooks & WhatsApp
              <br className="hidden sm:block" />
              <span className="block sm:inline"> </span>
              <span className="text-zinc-600">with Smart Inventory Management</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
              Track sales, manage inventory, monitor profits, and hold workers accountable—all in one powerful app designed for <span className="font-semibold text-black">Small-Medium Shop Owners</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <a 
                href="https://apps.apple.com/ng/app/reventory/id6747654868"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium text-sm sm:text-base shadow-sm"
              >
                Download for iOS
              </a>
              <a 
                href="#features"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-zinc-300 text-black rounded-md hover:bg-zinc-50 transition font-medium text-sm sm:text-base"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-zinc-200">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-1">1K+</div>
              <div className="text-xs sm:text-sm text-zinc-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-1">50K+</div>
              <div className="text-xs sm:text-sm text-zinc-600">Sales Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-1">99%</div>
              <div className="text-xs sm:text-sm text-zinc-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Currency Support */}
      <section className="bg-zinc-50 py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-black">
              Multi-Currency Support
            </h2>
            <p className="text-sm sm:text-base text-zinc-600">
              Native support for 10 currencies across Africa and beyond
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-zinc-200 p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                {supportedCurrencies.map((currency) => (
                  <div key={currency.code} className="text-center p-3 sm:p-4 rounded-md hover:bg-zinc-50 transition border border-transparent hover:border-zinc-200">
                    <div className="text-lg sm:text-xl font-semibold text-black mb-1">{currency.symbol}</div>
                    <div className="text-xs sm:text-sm font-medium text-zinc-700 mb-0.5">{currency.code}</div>
                    <div className="text-xs text-zinc-600">{currency.name.split('(')[0].trim()}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-zinc-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-zinc-600 mb-1">Payment Methods</div>
                    <div className="font-medium text-black">Bank Transfer, Card Payment, Apple Pay</div>
                  </div>
                  <div>
                    <div className="text-zinc-600 mb-1">Primary Currency</div>
                    <div className="font-medium text-black">Nigerian Naira (NGN)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 text-black">
              Everything You Need to Run Your Shop
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto">
              Reventory helps you manage your business smarter—from inventory tracking to worker management, all with offline support.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
            <div className="p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition bg-white">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-black">Inventory Management</h3>
              <p className="text-zinc-600 mb-3 sm:mb-4 text-sm leading-relaxed">
                Track products, categories, and brands with real-time stock updates and low-stock alerts.
              </p>
              <ul className="space-y-1.5 sm:space-y-2 text-zinc-600 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Hierarchical categories and brand management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Real-time stock tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Low-stock alerts</span>
                </li>
              </ul>
            </div>

            <div className="p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition bg-white">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-black">Sales Tracking</h3>
              <p className="text-zinc-600 mb-3 sm:mb-4 text-sm leading-relaxed">
                Workers submit sales for approval. You control every transaction and track revenue in real-time.
              </p>
              <ul className="space-y-1.5 sm:space-y-2 text-zinc-600 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Worker sales submission with approval workflow</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Revenue and profit tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Sales analytics per worker</span>
                </li>
              </ul>
            </div>

            <div className="p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition bg-white">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-black">Worker Management</h3>
              <p className="text-zinc-600 mb-3 sm:mb-4 text-sm leading-relaxed">
                Manage your employees with device registration, performance tracking, and slot management.
              </p>
              <ul className="space-y-1.5 sm:space-y-2 text-zinc-600 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>One device per worker (security)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Worker performance analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Multi-branch support</span>
                </li>
              </ul>
            </div>

            <div className="p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition bg-white">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-black">Analytics & Reports</h3>
              <p className="text-zinc-600 mb-3 sm:mb-4 text-sm leading-relaxed">
                Get insights into your business with detailed analytics and exportable reports.
              </p>
              <ul className="space-y-1.5 sm:space-y-2 text-zinc-600 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Business analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Weekly, monthly, and all-time reports</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Export to Excel and PDF</span>
                </li>
              </ul>
            </div>

            <div className="p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition bg-white">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-black">Offline Support</h3>
              <p className="text-zinc-600 mb-3 sm:mb-4 text-sm leading-relaxed">
                Work without internet. Your data syncs automatically when connection is restored.
              </p>
              <ul className="space-y-1.5 sm:space-y-2 text-zinc-600 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Full offline functionality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Automatic sync when online</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Local data storage</span>
                </li>
              </ul>
            </div>

            <div className="p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition bg-white">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-black">Smart Notifications</h3>
              <p className="text-zinc-600 mb-3 sm:mb-4 text-sm leading-relaxed">
                Stay informed with real-time alerts for low stock, new sales, and important updates.
              </p>
              <ul className="space-y-1.5 sm:space-y-2 text-zinc-600 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Low stock alerts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Worker sales notifications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Push notifications</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="https://apps.apple.com/ng/app/reventory/id6747654868"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium text-sm sm:text-base shadow-sm"
            >
              Download App
            </a>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 text-xs sm:text-sm text-zinc-600">
              <a 
                href="https://apps.apple.com/ng/app/reventory/id6747654868"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                Download on App Store
              </a>
              <span className="hidden sm:inline">•</span>
              <a 
                href="#"
                className="hover:text-black transition"
              >
                Get it on Google Play
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-zinc-50 py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 text-black">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto">
              Start free and upgrade as your business grows. No hidden fees.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-zinc-200 hover:shadow-md transition">
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-black">Starter</h3>
                <div className="text-3xl sm:text-4xl font-semibold mb-2 text-black">Free</div>
                <p className="text-zinc-600 text-xs sm:text-sm">Perfect for small shops getting started</p>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-xs sm:text-sm">
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>1 worker (never expires)</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>20 products</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Basic inventory tracking</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Sales management</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Basic analytics</span>
                </li>
              </ul>
              <a 
                href="https://apps.apple.com/ng/app/reventory/id6747654868"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 sm:px-6 py-2.5 sm:py-3 border border-zinc-300 text-black rounded-md hover:bg-zinc-50 transition font-medium text-xs sm:text-sm"
              >
                Get Started
              </a>
            </div>

            {/* Standard Plan */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border-2 border-black relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs font-medium">
                Popular
              </div>
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-black">Standard</h3>
                <div className="text-3xl sm:text-4xl font-semibold mb-2 text-black">
                  <PricingDisplay plan="standard" />
                  <span className="text-base sm:text-lg text-zinc-600 font-normal">/month</span>
                </div>
                <p className="text-zinc-600 text-xs sm:text-sm">For growing businesses • Billed monthly</p>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-xs sm:text-sm">
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>2 workers</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>50 products</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Data export (Excel, PDF)</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Low stock alerts</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Advanced analytics</span>
                </li>
              </ul>
              <a 
                href="https://apps.apple.com/ng/app/reventory/id6747654868"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium text-xs sm:text-sm shadow-sm"
              >
                Upgrade Now
              </a>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-zinc-200 hover:shadow-md transition">
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-black">Pro</h3>
                <div className="text-3xl sm:text-4xl font-semibold mb-2 text-black">
                  <PricingDisplay plan="pro" />
                  <span className="text-base sm:text-lg text-zinc-600 font-normal">/month</span>
                </div>
                <p className="text-zinc-600 text-xs sm:text-sm">For established businesses • Billed monthly</p>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-xs sm:text-sm">
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>5 workers</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Unlimited products</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Worker sales alerts</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>Smart alerts</span>
                </li>
                <li className="flex items-start text-zinc-700">
                  <span className="text-zinc-400 mr-2">•</span>
                  <span>All advanced features</span>
                </li>
              </ul>
              <a 
                href="https://apps.apple.com/ng/app/reventory/id6747654868"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 sm:px-6 py-2.5 sm:py-3 border border-zinc-300 text-black rounded-md hover:bg-zinc-50 transition font-medium text-xs sm:text-sm"
              >
                Upgrade Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 text-black">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-zinc-600">
              Everything you need to know about Reventory
            </p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <details className="group p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 transition bg-white">
              <summary className="cursor-pointer text-base sm:text-lg font-semibold text-black list-none">
                <span className="flex justify-between items-center">
                  <span>Is Reventory free to use?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition text-sm">▼</span>
                </span>
              </summary>
              <p className="mt-4 text-zinc-600 text-xs sm:text-sm leading-relaxed">
                Yes! Reventory offers a free Starter plan with 1 worker and 20 products. You can start managing your inventory immediately at no cost. Upgrade to Standard or Pro plans as your business grows.
              </p>
            </details>

            <details className="group p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 transition bg-white">
              <summary className="cursor-pointer text-base sm:text-lg font-semibold text-black list-none">
                <span className="flex justify-between items-center">
                  <span>How does worker management work?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition text-sm">▼</span>
                </span>
              </summary>
              <p className="mt-4 text-zinc-600 text-xs sm:text-sm leading-relaxed">
                Workers can sign in with company credentials and submit sales for your approval. Each worker can only be logged in on one device at a time for security. You can track their performance, view analytics, and manage worker slots based on your subscription plan.
              </p>
            </details>

            <details className="group p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 transition bg-white">
              <summary className="cursor-pointer text-base sm:text-lg font-semibold text-black list-none">
                <span className="flex justify-between items-center">
                  <span>Does Reventory work offline?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition text-sm">▼</span>
                </span>
              </summary>
              <p className="mt-4 text-zinc-600 text-xs sm:text-sm leading-relaxed">
                Yes! Reventory works completely offline. You can manage inventory, submit sales, and view data without internet connection. All changes sync automatically when your connection is restored.
              </p>
            </details>

            <details className="group p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 transition bg-white">
              <summary className="cursor-pointer text-base sm:text-lg font-semibold text-black list-none">
                <span className="flex justify-between items-center">
                  <span>How do I track sales and profits?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition text-sm">▼</span>
                </span>
              </summary>
              <p className="mt-4 text-zinc-600 text-xs sm:text-sm leading-relaxed">
                Workers submit sales through the app, and you approve or reject them. All approved sales are tracked in your analytics dashboard where you can view revenue, profit, items sold, and performance metrics by day, week, month, or all-time. You can also export reports to Excel or PDF.
              </p>
            </details>

            <details className="group p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 transition bg-white">
              <summary className="cursor-pointer text-base sm:text-lg font-semibold text-black list-none">
                <span className="flex justify-between items-center">
                  <span>Can I manage multiple branches?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition text-sm">▼</span>
                </span>
              </summary>
              <p className="mt-4 text-zinc-600 text-xs sm:text-sm leading-relaxed">
                Yes! Reventory supports multi-branch management. You can create multiple branches, assign workers to specific branches, and manage branch-specific inventory all from one account.
              </p>
            </details>

            <details className="group p-5 sm:p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 transition bg-white">
              <summary className="cursor-pointer text-base sm:text-lg font-semibold text-black list-none">
                <span className="flex justify-between items-center">
                  <span>Is my data secure?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition text-sm">▼</span>
                </span>
              </summary>
              <p className="mt-4 text-zinc-600 text-xs sm:text-sm leading-relaxed">
                Absolutely. Reventory uses Firebase Authentication and secure cloud storage. Your data is encrypted and backed up automatically. Device registration ensures only authorized workers can access your business data.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-50 py-8 sm:py-10 md:py-12 border-t border-zinc-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-2">
                <Image 
                  src="https://res.cloudinary.com/dijhekwvl/image/upload/v1766146257/IMG_9619_ilwzns.jpg" 
                  alt="Reventory Logo" 
                  width={100}
                  height={32}
                  className="h-6 sm:h-8 w-auto rounded-lg"
                />
              </div>
              <p className="text-zinc-600 text-xs sm:text-sm">Smart inventory management for Small-Medium Shop Owners</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="#features" className="text-zinc-600 hover:text-black font-medium transition">
                Features
              </a>
              <a href="#pricing" className="text-zinc-600 hover:text-black font-medium transition">
                Pricing
              </a>
              <a href="#faq" className="text-zinc-600 hover:text-black font-medium transition">
                FAQ
              </a>
              <a 
                href="https://apps.apple.com/ng/app/reventory/id6747654868"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-black font-medium transition"
              >
                Download
              </a>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-zinc-200 text-center text-zinc-600 text-xs sm:text-sm">
            <p>© 2025 Reventory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
