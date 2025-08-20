import React from 'react';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function HeroSection({
  title = "Build Something Amazing",
  subtitle = "Transform Your Ideas Into Reality",
  description = "Create stunning web applications with modern tools and technologies. Join thousands of developers who trust our platform.",
  primaryButtonText = "Get Started",
  secondaryButtonText = "Learn More",
  onPrimaryClick,
  onSecondaryClick
}: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            <span className="block">{title}</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {subtitle}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onPrimaryClick}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              {primaryButtonText}
            </button>
            <button
              onClick={onSecondaryClick}
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:shadow-md transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              {secondaryButtonText}
            </button>
          </div>

          {/* Stats or social proof */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-gray-600 mt-1">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">99.9%</div>
              <div className="text-gray-600 mt-1">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600 mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Add custom animations to globals.css
// @keyframes blob {
//   0% { transform: translate(0px, 0px) scale(1); }
//   33% { transform: translate(30px, -50px) scale(1.1); }
//   66% { transform: translate(-20px, 20px) scale(0.9); }
//   100% { transform: translate(0px, 0px) scale(1); }
// }
// .animate-blob { animation: blob 7s infinite; }
// .animation-delay-2000 { animation-delay: 2s; }
// .animation-delay-4000 { animation-delay: 4s; }