import React from 'react';
import Title from './Title';
import FadeIn, { FadeInItem } from './FadeIn';

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Verified Buyer',
    content: "The quality is simply outstanding. The oversized hoodie I bought fits perfectly and the material feels incredibly premium.",
    rating: 5
  },
  {
    name: 'David K.',
    role: 'Verified Buyer',
    content: "DH Clothing has completely transformed my wardrobe. Their regular fit collections are my go-to for both work and weekends.",
    rating: 5
  },
  {
    name: 'Emily R.',
    role: 'Verified Buyer',
    content: "Fast shipping and elegant packaging. You really feel like you're buying a luxury product without the crazy markup.",
    rating: 5
  },
  {
    name: 'Aman Kumar',
    role: 'Verified Buyer',
    content: "I was skeptical at first, but their oversized hoodies are top-tier!",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16">
          <Title text1="WHAT THEY" text2="SAY" centered />
          <p className="text-neutral-600 text-lg sm:text-xl text-center max-w-2xl mt-4 font-medium">
            Don't just take our word for it. Here's what our customers have to say about their experience.
          </p>
        </div>

        <FadeIn stagger={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <FadeInItem key={idx}>
                <div className="bg-neutral-50 rounded-2xl p-8 h-full border border-neutral-100 hover:shadow-soft-lg transition-shadow duration-300">
                  <div className="flex gap-1 mb-6 text-brand-gold">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    ))}
                  </div>
                  <p className="text-brand-black text-lg font-display italic mb-8 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-brand-charcoal text-white flex items-center justify-center font-display font-medium text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-black">{testimonial.name}</p>
                      <p className="text-sm text-neutral-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default TestimonialsSection;
