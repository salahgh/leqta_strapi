/**
 * Cookie Consent Seed Data
 * Law 18-07 Compliant cookie consent content for all locales
 */

export interface CookieConsentData {
    base: {
        title: string;
        description: string;
        lawReferenceTitle: string;
        lawReferenceDescription: string;
        acceptAllButtonText: string;
        rejectAllButtonText: string;
        savePreferencesButtonText: string;
        managePreferencesText: string;
        privacyPolicyLinkText: string;
        alwaysActiveText: string;
        rightsNotice: string;
        necessaryCookiesTitle: string;
        necessaryCookiesDescription: string;
        analyticsCookiesTitle: string;
        analyticsCookiesDescription: string;
        marketingCookiesTitle: string;
        marketingCookiesDescription: string;
    };
    translations: {
        [locale: string]: Partial<CookieConsentData['base']>;
    };
}

export const cookieConsentData: CookieConsentData = {
    base: {
        // English (default locale)
        title: "We Value Your Privacy",
        description: "We use cookies and tracking technologies (Google Analytics, Meta Pixel, TikTok Pixel) to analyze website traffic and improve our services. You can accept, reject, or manage your preferences.",
        lawReferenceTitle: "Law 18-07 Compliance:",
        lawReferenceDescription: "In accordance with Algerian Law No. 18-07 on the protection of personal data, we require your explicit consent before processing any personal information.",
        acceptAllButtonText: "Accept All",
        rejectAllButtonText: "Reject All",
        savePreferencesButtonText: "Save Preferences",
        managePreferencesText: "Manage cookie preferences",
        privacyPolicyLinkText: "Read our Privacy Policy",
        alwaysActiveText: "Always Active",
        rightsNotice: "You have the right to withdraw your consent at any time. For more information about your rights under Law 18-07, please visit our Privacy Policy.",
        necessaryCookiesTitle: "Necessary Cookies",
        necessaryCookiesDescription: "These cookies are essential for the website to function properly. They enable basic features like page navigation and secure access.",
        analyticsCookiesTitle: "Analytics Cookies (Google Analytics)",
        analyticsCookiesDescription: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
        marketingCookiesTitle: "Marketing Cookies (Meta Pixel, TikTok Pixel)",
        marketingCookiesDescription: "These cookies are used to track visitors across websites to display relevant advertisements based on your interests."
    },
    translations: {
        fr: {
            title: "Nous Respectons Votre Vie Privée",
            description: "Nous utilisons des cookies et des technologies de suivi (Google Analytics, Meta Pixel, TikTok Pixel) pour analyser le trafic du site et améliorer nos services. Vous pouvez accepter, refuser ou gérer vos préférences.",
            lawReferenceTitle: "Conformité à la Loi 18-07 :",
            lawReferenceDescription: "Conformément à la loi algérienne n° 18-07 sur la protection des données personnelles, nous exigeons votre consentement explicite avant de traiter toute information personnelle.",
            acceptAllButtonText: "Tout Accepter",
            rejectAllButtonText: "Tout Refuser",
            savePreferencesButtonText: "Enregistrer les Préférences",
            managePreferencesText: "Gérer les préférences de cookies",
            privacyPolicyLinkText: "Lire notre Politique de Confidentialité",
            alwaysActiveText: "Toujours Actif",
            rightsNotice: "Vous avez le droit de retirer votre consentement à tout moment. Pour plus d'informations sur vos droits en vertu de la Loi 18-07, veuillez consulter notre Politique de Confidentialité.",
            necessaryCookiesTitle: "Cookies Nécessaires",
            necessaryCookiesDescription: "Ces cookies sont essentiels au bon fonctionnement du site. Ils permettent des fonctionnalités de base comme la navigation et l'accès sécurisé.",
            analyticsCookiesTitle: "Cookies Analytiques (Google Analytics)",
            analyticsCookiesDescription: "Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site en collectant et en rapportant des informations de manière anonyme.",
            marketingCookiesTitle: "Cookies Marketing (Meta Pixel, TikTok Pixel)",
            marketingCookiesDescription: "Ces cookies sont utilisés pour suivre les visiteurs sur les sites web afin d'afficher des publicités pertinentes en fonction de vos intérêts."
        },
        ar: {
            title: "نحن نقدر خصوصيتك",
            description: "نستخدم ملفات تعريف الارتباط وتقنيات التتبع (Google Analytics، Meta Pixel، TikTok Pixel) لتحليل حركة الموقع وتحسين خدماتنا. يمكنك القبول أو الرفض أو إدارة تفضيلاتك.",
            lawReferenceTitle: "الامتثال للقانون 18-07:",
            lawReferenceDescription: "وفقًا للقانون الجزائري رقم 18-07 المتعلق بحماية البيانات الشخصية، نطلب موافقتك الصريحة قبل معالجة أي معلومات شخصية.",
            acceptAllButtonText: "قبول الكل",
            rejectAllButtonText: "رفض الكل",
            savePreferencesButtonText: "حفظ التفضيلات",
            managePreferencesText: "إدارة تفضيلات ملفات تعريف الارتباط",
            privacyPolicyLinkText: "اقرأ سياسة الخصوصية",
            alwaysActiveText: "نشط دائمًا",
            rightsNotice: "لديك الحق في سحب موافقتك في أي وقت. لمزيد من المعلومات حول حقوقك بموجب القانون 18-07، يرجى زيارة سياسة الخصوصية.",
            necessaryCookiesTitle: "ملفات تعريف الارتباط الضرورية",
            necessaryCookiesDescription: "هذه الملفات ضرورية لعمل الموقع بشكل صحيح. تتيح الميزات الأساسية مثل التنقل والوصول الآمن.",
            analyticsCookiesTitle: "ملفات تعريف الارتباط التحليلية (Google Analytics)",
            analyticsCookiesDescription: "تساعدنا هذه الملفات على فهم كيفية تفاعل الزوار مع موقعنا من خلال جمع المعلومات والإبلاغ عنها بشكل مجهول.",
            marketingCookiesTitle: "ملفات تعريف الارتباط التسويقية (Meta Pixel، TikTok Pixel)",
            marketingCookiesDescription: "تُستخدم هذه الملفات لتتبع الزوار عبر المواقع لعرض إعلانات ذات صلة بناءً على اهتماماتك."
        }
    }
};
