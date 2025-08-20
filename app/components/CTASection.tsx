import React from 'react';
import Link from 'next/link';

interface CTAButton {
  text: string;
  href: string;
  variant: 'primary' | 'secondary';
  external?: boolean;
}

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttons?: CTAButton[];
  backgroundVariant?: 'gradient' | 'solid' | 'pattern';
  showStats?: boolean;
}

const defaultButtons: CTAButton[] = [
  {
    text: 'Get Started Free',
    href: '/contact',
    variant: 'primary'
  },
  {
    text: 'View Demo',
    href: '#demo',
    variant: 'secondary'
  }
];

export default function CTASection({
  title = "Ready to Transform Your Business?",
  subtitle = "Join thousands of companies already using our platform",
  description = "Start your free trial today and see the difference our solution can make for your business. No credit card required, cancel anytime.",
  buttons = defaultButtons,
  backgroundVariant = 'gradient',
  showStats = true
}: CTASectionProps) {
  const getBackgroundClasses = () => {
    switch (backgroundVariant) {
      case 'gradient':
        return 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800';
      case 'solid':
        return 'bg-gray-900';
      case 'pattern':
        return 'bg-gray-900 relative overflow-hidden';
      default:
        return 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800';
    }
  };

  const renderButton = (button: CTAButton, index: number) => {
    const baseClasses = "px-8 py-4 font-semibold rounded-lg transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-4";
    
    const variantClasses = button.variant === 'primary'
      ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl focus:ring-white/30"
      : "border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:ring-white/30";

    const buttonElement = (
      <button className={`${baseClasses} ${variantClasses}`}>
        {button.text}
      </button>
    );

    if (button.external) {
      return (
        <a key={index} href={button.href} target="_blank" rel="noopener noreferrer">
          {buttonElement}
        </a>
      );
    }

    return (
      <Link key={index} href={button.href}>
        {buttonElement}
      </Link>
    );
  };

  return (
    <section className={`py-20 text-white ${getBackgroundClasses()}`}>
      {/* Pattern overlay for pattern variant */}
      {backgroundVariant === 'pattern' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Main Content */}
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {title}
            </h2>
            <p className="text-xl sm:text-2xl mb-6 text-white/90">
              {subtitle}
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {buttons.map((button, index) => renderButton(button, index))}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/70">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Stats */}
          {showStats && (
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">10K+</div>
                <div className="text-white/70">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="text-white/70">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-white/70">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-white/70">Support</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}