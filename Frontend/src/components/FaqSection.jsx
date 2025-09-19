import React, { useState } from "react";
import { ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon } from "lucide-react";

const FaqSection = () => {
  // open first item by default; use null if you want all collapsed
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      question: "How do online tuition classes work?",
      answer:
        "Our online classes are conducted through our interactive virtual classroom platform. You'll join a live video session where you can see and hear your tutor, view shared materials, and participate in discussions. All you need is a computer or tablet with internet connection.",
    },
    {
      question: "What subjects do you offer?",
      answer:
        "We offer a wide range of subjects including Mathematics, Sciences (Physics, Chemistry, Biology), Languages, Humanities, Computer Science, Music, Test Preparation, and Arts. Check our subjects section for a complete list.",
    },
    {
      question: "How qualified are your tutors?",
      answer:
        "All our tutors are highly qualified professionals with advanced degrees in their fields and extensive teaching experience. We have a rigorous selection process to ensure only the best educators join our platform.",
    },
    {
      question: "Can I schedule classes at any time?",
      answer:
        "Yes, we offer flexible scheduling. You can book sessions based on your availability and the tutor's schedule. We have tutors available across different time zones to accommodate students worldwide.",
    },
    {
      question: "What if I miss a scheduled class?",
      answer:
        "If you need to miss a class, please give at least 24 hours notice to reschedule without penalty. For last-minute cancellations, our policy varies by subscription plan. All classes are recorded and available for review if you cannot attend.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a free 30-minute introductory session with a tutor of your choice so you can experience our platform and teaching quality before committing to a subscription plan.",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to common questions about our online tuition services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-panel-${index}`;
            return (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-5 text-left"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUpIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-blue-600" />
                  )}
                </button>

                {isOpen && (
                  <div id={contentId} className="p-5 pt-0 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 font-medium">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
