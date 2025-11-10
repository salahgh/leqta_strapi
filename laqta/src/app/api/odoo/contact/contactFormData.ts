export interface ContactFormData {
    // Personal Information
    fullName: string;
    email: string;
    phoneNumber: string;
    industry?: string;
    otherIndustry?: string;

    // Company Information
    companyName?: string;
    jobTitle?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;

    // Project Information
    projectType?: string;
    budget?: string;
    timeline?: string;
    projectDescription?: string;
    goals?: string;
}
