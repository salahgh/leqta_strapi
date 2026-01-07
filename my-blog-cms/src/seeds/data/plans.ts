export const plansData = [
    {
        title: 'Basic Plan',
        title_ar: 'الخطة الأساسية',
        title_fr: 'Forfait de Base',
        description: 'Ideal for brands needing a simple, fast production for a small batch of video content.',
        description_ar: 'مثالية للعلامات التجارية التي تحتاج إلى إنتاج بسيط وسريع لدفعة صغيرة من محتوى الفيديو.',
        description_fr: 'Idéal pour les marques ayant besoin d\'une production simple et rapide pour un petit lot de contenu vidéo.',
        price: '126,900 DZD',
        price_ar: '126,900 دج',
        price_fr: '126 900 DZD',
        isCustomPricing: false,
        buttonText: 'Get Started',
        buttonText_ar: 'ابدأ الآن',
        buttonText_fr: 'Commencer',
        buttonLink: '/contact',
        featured: false,
        order: 1,
        sections: [
            {
                title: "What's Included",
                title_ar: 'ما هو مشمول',
                title_fr: 'Ce qui est inclus',
                points: [
                    { text: 'Filming of 5 content pieces', text_ar: 'تصوير 5 محتويات', text_fr: 'Tournage de 5 contenus', included: true },
                    { text: '1 full day of shooting', text_ar: 'يوم كامل من التصوير', text_fr: '1 journée complète de tournage', included: true },
                    { text: 'Basic editing for all 5 videos', text_ar: 'مونتاج أساسي لجميع الفيديوهات الخمسة', text_fr: 'Montage de base pour les 5 vidéos', included: true },
                    { text: 'Cutting, transitions, color correction', text_ar: 'قص، انتقالات، تصحيح الألوان', text_fr: 'Découpe, transitions, correction colorimétrique', included: true },
                    { text: 'Music/logo overlay', text_ar: 'موسيقى/شعار', text_fr: 'Overlay musique/logo', included: true },
                    { text: 'Advanced motion graphics', text_ar: 'رسومات متحركة متقدمة', text_fr: 'Motion graphics avancés', included: false },
                    { text: 'Drone footage', text_ar: 'تصوير بالدرون', text_fr: 'Prise de vue par drone', included: false },
                ]
            },
            {
                title: 'Equipment Included',
                title_ar: 'المعدات المشمولة',
                title_fr: 'Équipement inclus',
                points: [
                    { text: 'Professional Camera', text_ar: 'كاميرا احترافية', text_fr: 'Caméra Professionnelle', included: true },
                    { text: 'Stabilizer (Gimbal + Tripod)', text_ar: 'مثبت (جيمبال + حامل ثلاثي)', text_fr: 'Stabilisateur (Gimbal + Trépied)', included: true },
                    { text: 'Softbox Light + RGB Tube Light', text_ar: 'إضاءة سوفت بوكس + إضاءة RGB', text_fr: 'Softbox Light + RGB Tube Light', included: true },
                    { text: 'Wireless Microphone Kit (2 transmitters)', text_ar: 'مجموعة ميكروفون لاسلكية (2 مرسل)', text_fr: 'Kit Microphone Sans Fil (2 émetteurs)', included: true },
                ]
            }
        ]
    },
    {
        title: 'Professional Plan',
        title_ar: 'الخطة الاحترافية',
        title_fr: 'Forfait Professionnel',
        description: 'Perfect for growing brands with regular content needs and higher production quality requirements.',
        description_ar: 'مثالية للعلامات التجارية النامية ذات احتياجات المحتوى المنتظمة ومتطلبات جودة الإنتاج الأعلى.',
        description_fr: 'Parfait pour les marques en croissance avec des besoins réguliers en contenu et des exigences de qualité de production plus élevées.',
        price: '299,900 DZD',
        price_ar: '299,900 دج',
        price_fr: '299 900 DZD',
        isCustomPricing: false,
        buttonText: 'Get Started',
        buttonText_ar: 'ابدأ الآن',
        buttonText_fr: 'Commencer',
        buttonLink: '/contact',
        featured: true,
        order: 2,
        sections: [
            {
                title: "What's Included",
                title_ar: 'ما هو مشمول',
                title_fr: 'Ce qui est inclus',
                points: [
                    { text: 'Filming of 10 content pieces', text_ar: 'تصوير 10 محتويات', text_fr: 'Tournage de 10 contenus', included: true },
                    { text: '2 full days of shooting', text_ar: 'يومين كاملين من التصوير', text_fr: '2 journées complètes de tournage', included: true },
                    { text: 'Advanced editing for all videos', text_ar: 'مونتاج متقدم لجميع الفيديوهات', text_fr: 'Montage avancé pour toutes les vidéos', included: true },
                    { text: 'Motion graphics & animations', text_ar: 'رسومات متحركة وتأثيرات', text_fr: 'Motion graphics et animations', included: true },
                    { text: 'Color grading & sound design', text_ar: 'تدرج الألوان وتصميم الصوت', text_fr: 'Étalonnage couleur et design sonore', included: true },
                    { text: 'Subtitling in 2 languages', text_ar: 'ترجمة بلغتين', text_fr: 'Sous-titrage en 2 langues', included: true },
                    { text: 'Drone footage', text_ar: 'تصوير بالدرون', text_fr: 'Prise de vue par drone', included: false },
                ]
            },
            {
                title: 'Equipment Included',
                title_ar: 'المعدات المشمولة',
                title_fr: 'Équipement inclus',
                points: [
                    { text: 'Cinema Camera', text_ar: 'كاميرا سينمائية', text_fr: 'Caméra Cinéma', included: true },
                    { text: 'Professional Gimbal + Slider', text_ar: 'جيمبال احترافي + سلايدر', text_fr: 'Gimbal Professionnel + Slider', included: true },
                    { text: 'Professional Lighting Kit', text_ar: 'مجموعة إضاءة احترافية', text_fr: 'Kit d\'éclairage professionnel', included: true },
                    { text: 'Wireless Lavalier + Boom Mic', text_ar: 'ميكروفون لاسلكي + بوم', text_fr: 'Micro Cravate Sans Fil + Perche', included: true },
                    { text: 'Teleprompter', text_ar: 'تيليبرومبتر', text_fr: 'Téléprompteur', included: true },
                ]
            }
        ]
    },
    {
        title: 'Premium Plan',
        title_ar: 'الخطة المميزة',
        title_fr: 'Forfait Premium',
        description: 'For brands with larger content needs, creative ambitions, or advanced technical requirements. This plan is 100% customized to your brand, objectives, and creative vision.',
        description_ar: 'للعلامات التجارية ذات احتياجات المحتوى الأكبر، الطموحات الإبداعية، أو المتطلبات التقنية المتقدمة. هذه الخطة مخصصة 100% لعلامتك التجارية وأهدافك ورؤيتك الإبداعية.',
        description_fr: 'Pour les marques ayant des besoins de contenu plus importants, des ambitions créatives ou des exigences techniques avancées. Ce forfait est 100% personnalisé selon votre marque, vos objectifs et votre vision créative.',
        price: null,
        isCustomPricing: true,
        customPricingText: 'Get Your Custom Quote',
        customPricingText_ar: 'احصل على عرض سعر مخصص',
        customPricingText_fr: 'Obtenez votre devis personnalisé',
        buttonText: 'Contact Us',
        buttonText_ar: 'تواصل معنا',
        buttonText_fr: 'Contactez-nous',
        buttonLink: '/contact',
        featured: false,
        order: 3,
        sections: [
            {
                title: "What's Included",
                title_ar: 'ما هو مشمول',
                title_fr: 'Ce qui est inclus',
                points: [
                    { text: 'Unlimited content pieces', text_ar: 'محتوى غير محدود', text_fr: 'Contenus illimités', included: true },
                    { text: 'Multi-day filming sessions', text_ar: 'جلسات تصوير متعددة الأيام', text_fr: 'Sessions de tournage multi-jours', included: true },
                    { text: 'Storyboard development & scripting', text_ar: 'تطوير القصة المصورة والسيناريو', text_fr: 'Développement de storyboard et scénarisation', included: true },
                    { text: 'Advanced editing & VFX', text_ar: 'مونتاج متقدم ومؤثرات بصرية', text_fr: 'Montage avancé et VFX', included: true },
                    { text: 'Brand animation package', text_ar: 'حزمة الرسوم المتحركة للعلامة التجارية', text_fr: 'Package d\'animation de marque', included: true },
                    { text: 'Drone & aerial footage', text_ar: 'تصوير جوي وبالدرون', text_fr: 'Prise de vue aérienne et drone', included: true },
                    { text: 'Multi-camera setup', text_ar: 'إعداد متعدد الكاميرات', text_fr: 'Configuration multi-caméras', included: true },
                ]
            },
            {
                title: 'Additional Services',
                title_ar: 'خدمات إضافية',
                title_fr: 'Services additionnels',
                points: [
                    { text: 'Dedicated project manager', text_ar: 'مدير مشروع مخصص', text_fr: 'Chef de projet dédié', included: true },
                    { text: 'Priority support', text_ar: 'دعم ذو أولوية', text_fr: 'Support prioritaire', included: true },
                    { text: 'Unlimited revisions', text_ar: 'تعديلات غير محدودة', text_fr: 'Révisions illimitées', included: true },
                    { text: 'Social media optimization', text_ar: 'تحسين لوسائل التواصل الاجتماعي', text_fr: 'Optimisation pour les réseaux sociaux', included: true },
                    { text: 'Monthly content calendar', text_ar: 'تقويم محتوى شهري', text_fr: 'Calendrier de contenu mensuel', included: true },
                ]
            }
        ]
    }
];
