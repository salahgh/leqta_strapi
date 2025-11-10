const faqs = [
  {
    question: "How does a subscription-based marketing service work?",
    answer: "With our model, you pay a flat monthly fee for continuous marketing support. No contracts, no hidden fees—just expert marketing services tailored to your business needs.",
    category: "subscription",
    featured: true,
    order: 1,
    publishedAt: new Date()
  },
  {
    question: "What's included in the subscription?",
    answer: "Our subscription includes comprehensive marketing strategy development, content creation, social media management, email marketing campaigns, SEO optimization, performance analytics, and dedicated account management. You'll have access to our full team of marketing experts.",
    category: "subscription",
    featured: true,
    order: 2,
    publishedAt: new Date()
  },
  {
    question: "Can I upgrade or change my plan?",
    answer: "Absolutely! You can upgrade, downgrade, or modify your plan at any time. Changes take effect at the start of your next billing cycle, and we'll work with you to ensure a smooth transition that meets your evolving business needs.",
    category: "plans",
    featured: false,
    order: 3,
    publishedAt: new Date()
  },
  {
    question: "How soon will I see results?",
    answer: "While every business is different, most clients start seeing initial improvements within 30-60 days. Significant results typically become apparent within 90 days. We provide regular reporting so you can track progress and see the impact of our work on your business growth.",
    category: "results",
    featured: true,
    order: 4,
    publishedAt: new Date()
  },
  {
    question: "How do I get started?",
    answer: "Getting started is simple! Schedule a free consultation call where we'll discuss your business goals and challenges. After that, we'll create a customized marketing strategy and you can choose the subscription plan that best fits your needs. We can have you up and running within a week.",
    category: "getting-started",
    featured: true,
    order: 5,
    publishedAt: new Date()
  },
  {
    question: "Can I change plans later?",
    answer: "Yes, you have complete flexibility to change your plan whenever needed. Whether you want to scale up during busy seasons or adjust your services based on business growth, we make it easy to modify your subscription without any penalties or long-term commitments.",
    category: "plans",
    featured: false,
    order: 6,
    publishedAt: new Date()
  }
];

const seedFaqs = async () => {
  try {
    const existingFaqs = await strapi.entityService.findMany('api::faq.faq');
    
    if (existingFaqs.length === 0) {
      console.log('Seeding FAQs...');
      
      for (const faq of faqs) {
        await strapi.entityService.create('api::faq.faq', {
          data: faq
        });
      }
      
      console.log('FAQs seeded successfully!');
    } else {
      console.log('FAQs already exist, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding FAQs:', error);
  }
};

module.exports = { seedFaqs };