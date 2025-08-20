import React from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

interface TestimonialBlockProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
}

// Default testimonials data
const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart Inc.',
    content: 'This platform has completely transformed how we handle our business operations. The intuitive interface and powerful features have saved us countless hours and significantly improved our productivity.',
    rating: 5,
    avatar: 'SJ'
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'Innovation Labs',
    content: 'Outstanding service and support! The team went above and beyond to ensure our implementation was smooth. The results speak for themselves - 40% increase in efficiency within the first month.',
    rating: 5,
    avatar: 'MC'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'CTO',
    company: 'Digital Solutions',
    content: 'The scalability and reliability of this solution is impressive. We\'ve grown from a small team to enterprise-level operations, and the platform has seamlessly adapted to our needs every step of the way.',
    rating: 5,
    avatar: 'ER'
  },
  {
    id: '4',
    name: 'David Thompson',
    role: 'Founder',
    company: 'StartupHub',
    content: 'Game-changer for our startup! The analytics and insights provided have helped us make data-driven decisions that directly contributed to our 200% growth this year.',
    rating: 5,
    avatar: 'DT'
  },
  {
    id: '5',
    name: 'Lisa Wang',
    role: 'Operations Director',
    company: 'Global Enterprises',
    content: 'Exceptional platform with world-class support. The automation features have streamlined our workflows and the ROI has exceeded our expectations. Highly recommended!',
    rating: 5,
    avatar: 'LW'
  },
  {
    id: '6',
    name: 'James Miller',
    role: 'VP of Engineering',
    company: 'CloudTech',
    content: 'The integration capabilities are fantastic. We were able to connect all our existing tools seamlessly. The documentation is comprehensive and the API is developer-friendly.',
    rating: 5,
    avatar: 'JM'
  }
];

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${
            index < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Avatar component
const Avatar = ({ initials, name }: { initials: string; name: string }) => {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-red-500 to-red-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600'
  ];
  
  const colorIndex = name.length % colors.length;
  
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${colors[colorIndex]}`}>
      {initials}
    </div>
  );
};

export default function TestimonialBlock({
  title = "What Our Customers Say",
  subtitle = "Don't just take our word for it - hear from some of our amazing customers who are building incredible things with our platform.",
  testimonials = defaultTestimonials
}: TestimonialBlockProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <Avatar initials={testimonial.avatar || testimonial.name.split(' ').map(n => n[0]).join('')} name={testimonial.name} />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">4.9★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}