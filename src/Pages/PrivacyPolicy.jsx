import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Users, Lock, Cookie, Scale, AlertTriangle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const sections = [
        {
            id: 'introduction',
            title: 'Introduction',
            icon: FileText,
            content: `We at Amacar LLC (hereinafter referred to as "Amacar," "we," "our," or "us"), are responsible for protecting the privacy of any individuals who visit our website, use our services, or otherwise interact with us. This Privacy Policy describes how we collect, share, and safeguard your information when you visit our platform, use our services, or interact with us online. By using our platform, you consent to the practices described in this Privacy Policy.`
        },
        {
            id: 'information-collection',
            title: 'Information We Collect',
            icon: Eye,
            content: `The following three types of information will be collected from you:

a. Personal Information
This type of information is the ones you will provide directly to us when using our platform, such as:
- Full name
- Email address
- Contact number
- Complete address
- Information of Vehicle (model, year, make, VIN, license plate number, and photos)

b. Automatically Collected Information
When you interact with our platform, we may automatically collect:
- IP address
- Browser type
- Device information
- Usage data (e.g., pages visited, time spent on pages)
- Cookies and tracking technologies

c. Information from Third Parties
We may collect information about you from third parties, such as participating dealerships and analytics providers, to enhance our services and functionality.`
        },
        {
            id: 'how-we-use',
            title: 'How We Use Your Information',
            icon: Users,
            content: `We use the information we collect for the following purposes:

Service Delivery: To provide vehicle appraisals, manage your account, and facilitate live auctions.
Dealer Communication: To share your information with participating dealerships for bidding and communication purposes.
Customer Support: To respond to your inquiries and resolve issues.
Improvements and Analytics: To improve our platform's functionality, performance, and user experience.
Legal Compliance: To comply with applicable laws, regulations, and legal processes.`
        },
        {
            id: 'sharing-information',
            title: 'Sharing Your Information',
            icon: Users,
            content: `We share your personal information with:

a. Participating Dealerships
Your information is shared with dealerships registered on our platform to facilitate appraisals, auctions, and vehicle transactions. This includes:
- Full name
- Contact information
- Address
- Vehicle details and photos

b. Third-Party Service Providers
We may engage third-party providers, such as CRM tools (e.g., Salesforce), analytics providers, and IT support, to help us operate our platform and deliver services.

c. Legal Requirements
We may disclose your information if required by law or if we believe such action is necessary to comply with a legal obligation or protect the rights, property, or safety of Amacar, our users, or others.

d. Consent-Based Sharing
We may share your information with third parties not listed above if you provide explicit consent.`
        },
        {
            id: 'user-rights',
            title: 'User Rights',
            icon: Scale,
            content: `You have the following rights regarding your personal information:

a. Access and Portability
Under laws like the California Consumer Privacy Act (CCPA) [Cal. Civ. Code § 1798.100 et seq.] and General Data Protection Regulation (GDPR) [Art. 15], you can request access to the personal data we hold about you and receive it in a portable format.

b. Correction
You may request corrections to any inaccuracies in your information as provided under GDPR [Art. 16] or applicable laws.

c. Deletion
You can request the deletion of your data, subject to legal and operational limitations, as outlined in CCPA [Cal. Civ. Code § 1798.105] or GDPR [Art. 17].

d. Opt-Out
You can opt out of marketing communications and withdraw consent for data sharing by:
- Clicking the "Unsubscribe" link in emails.
- Adjusting your account settings.
- Contacting us at info@amacar.com.`
        },
        {
            id: 'data-security',
            title: 'Data Security',
            icon: Lock,
            content: `We take reasonable measures to protect your data against unauthorized access, alteration, and disclosure. This includes:

- Encrypted transmission of sensitive data
- Role-based access controls for dealership representatives
- Authentication processes for authorized platform users

While we strive to protect your information, no system is 100% secure, and we cannot guarantee absolute security.`
        },
        {
            id: 'cookies-tracking',
            title: 'Cookies and Tracking Technologies',
            icon: Cookie,
            content: `We use cookies and similar technologies to enhance your experience:

a. Types of Cookies
- Necessary Cookies: Essential for core website functions, such as authentication.
- Performance Cookies: Help analyze website traffic and improve functionality.
- Functional Cookies: Remember your preferences and login details.
- Third-Party Cookies: Enable features like social sharing and targeted advertisements.

b. Managing Cookies
You can manage or disable cookies through your browser settings. Note that disabling cookies may affect website functionality.`
        },
        {
            id: 'compliance',
            title: 'Compliance with Privacy Laws',
            icon: Shield,
            content: `Amacar complies with the following laws and regulations to protect your privacy:

- California Consumer Privacy Act (CCPA): Provides California residents with rights regarding data access, deletion, and opting out of data sales.
- General Data Protection Regulation (GDPR): Governs data protection and privacy for individuals in the European Union, including rights to access, correct, and delete data.
- Children's Online Privacy Protection Act (COPPA): Ensures that no data is knowingly collected from children under 13.
- Federal Trade Commission (FTC) Guidelines: Ensures fairness and transparency in data collection and usage in the U.S.

California and EU users may exercise their additional rights as stipulated in these laws.`
        },
        {
            id: 'children-privacy',
            title: "Children's Privacy",
            icon: AlertTriangle,
            content: `Our platform is intended for users aged 18 and older. We do not knowingly collect information from children under the age of 18. If we discover that we have inadvertently collected information from a child, we will delete it promptly to comply with COPPA [15 U.S.C. § 6501-6506].`
        },
        {
            id: 'updates',
            title: 'Updates to This Privacy Policy',
            icon: FileText,
            content: `We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the "Effective Date" will be updated accordingly. We will notify users via email or through a prominent notice on our platform if changes are significant.`
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                {/* Header */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-12"
                >
                    <div className="flex items-center mb-6">
                        <Link
                            to="/"
                            className="mr-4 p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
                                <p className="text-slate-600 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {sections.map((section, index) => {
                        const IconComponent = section.icon;
                        return (
                            <motion.div
                                key={section.id}
                                variants={itemVariants}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <IconComponent className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                        {section.content}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Contact Information */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Us</h3>
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                                </p>
                                <div className="space-y-2">
                                    <p className="text-slate-700">
                                        <strong>Company:</strong> Amacar LLC
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
