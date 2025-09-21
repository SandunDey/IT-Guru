import React from 'react';
import { StarIcon } from 'lucide-react';
const TestimonialsSection = () => {
  const testimonials = [{
    name: 'Sarah Johnson',
    role: 'High School Student',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    content: "The math tutoring I received helped me improve my grade from a C to an A-. My tutor explained concepts in ways that made sense to me when my regular teacher couldn't.",
    stars: 5
  }, {
    name: 'David Chen',
    role: 'College Student',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    content: 'The flexible scheduling allowed me to fit tutoring sessions around my busy college schedule. My chemistry grades improved dramatically after just a few sessions.',
    stars: 5
  }, {
    name: 'Emma Williams',
    role: 'Parent',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    content: 'My daughter was struggling with her language classes. The personalized attention she received from her tutor has boosted both her confidence and her grades.',
    stars: 4
  }];
  return <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Students Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from students and parents who have experienced the benefits of
            our online tuition classes.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full mr-4 object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-5 w-5 ${i < testimonial.stars ? 'text-yellow-400' : 'text-gray-300'}`} fill={i < testimonial.stars ? 'currentColor' : 'none'} />)}
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default TestimonialsSection;