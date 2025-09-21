import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Shield, Scale, Users, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '@/components/SEO/Seo';
import { seoData } from '@/config/seoConfig';

const TermsOfService = () => {
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
            content: `This website is operated by Amacar LLC ("Amacar," "we," "us," or "our"). The terms "we," "us," and "our" refer to Amacar LLC. The use of our website is subject to the following Terms of Use ("Terms"), as amended from time to time. These Terms are governed by applicable laws, including but not limited to the California Consumer Privacy Act (CCPA), General Data Protection Regulation (GDPR), Children's Online Privacy Protection Act (COPPA), Federal Trade Commission (FTC) Act, and other relevant state, federal, and international laws.

The Terms are to be read together with any terms, conditions, or disclaimers provided in the pages of our website. Please review the Terms carefully. These Terms apply to all users of our website, including, without limitation, browsers, customers, merchants, vendors, and contributors of content. By accessing and using this website, you accept and agree to comply with the Terms and our Privacy Policy. If you do not agree to these Terms or our Privacy Policy, you are not authorized to access our website, use any of our services, or place an order on our website.`
        },
        {
            id: 'use-of-website',
            title: 'Use of Our Website',
            icon: Users,
            content: `You agree to use our website for legitimate purposes and not for any illegal or unauthorized purpose, including, without limitation, in violation of any intellectual property, privacy, or consumer protection laws. By agreeing to these Terms, you represent and warrant that you are at least the age of majority in your state or province of residence and legally capable of entering into a binding contract.

You agree not to use our website to conduct any activity that would constitute a civil or criminal offense or violate any law, including but not limited to the Computer Fraud and Abuse Act (CFAA) and relevant anti-spam laws, such as the CAN-SPAM Act. You also agree not to attempt to interfere with our website's network or security features or gain unauthorized access to our systems.

You agree to provide accurate personal information, such as your email address, mailing address, and other contact details, to complete transactions or contact you as needed. You agree to promptly update your account information. By providing this information, you authorize us to collect and use it in accordance with our Privacy Policy and applicable laws such as the CCPA and GDPR.`
        },
        {
            id: 'ownership-content',
            title: 'Ownership of Content',
            icon: Shield,
            content: `a. Intellectual Property Rights
Amacar LLC owns all intellectual property rights to the Website's design, layout, logos, proprietary technology, and other features. All content provided on the Website, including text, images, graphics, videos, and software, is protected by copyright, trademark, and other intellectual property laws.

b. User-Generated Content
Users who upload content to the Website, including vehicle listings, descriptions, and images, retain ownership of their content. By submitting content to the Website, you grant Amacar a worldwide, non-exclusive, royalty-free, perpetual, and irrevocable license to use, reproduce, display, distribute, and modify your content in connection with providing and promoting our services.

c. Copyright Protection
Content such as vehicle images, descriptions, videos, and Website code is protected under applicable copyright laws. Unauthorized use of this content, including copying or redistributing it for purposes unrelated to Amacar's platform, is prohibited and may result in legal action.

d. Trademarks
The trademarks, logos, and service marks displayed on the Website, including "Amacar," are owned by Amacar LLC. Users are prohibited from using these trademarks without prior written permission. Unauthorized use may result in legal action.`
        },
        {
            id: 'products-services',
            title: 'Products or Services',
            icon: Scale,
            content: `Amacar operates an online vehicle appraisal and auction platform that connects individual vehicle sellers ("Users") with verified dealerships ("Dealers"). Users can list their vehicles for auction, and Dealers have the opportunity to bid on those vehicles. If the User accepts the highest bid, the sale of the vehicle is facilitated directly between the User and the Dealer.

Amacar's role is strictly limited to providing the online appraisal and auction platform. Amacar does not participate in, mediate, or have any involvement in the final transaction or agreements between the User and the Dealer, including but not limited to price negotiation, payment terms, transfer of ownership, or any disputes arising from the sale. All final transactions and agreements are solely between the User and the Dealer.`
        },
        {
            id: 'user-rights',
            title: 'User Rights and Responsibilities',
            icon: Users,
            content: `a. Account Creation and Use
To access certain features of the Platform, Users must create an account by providing accurate information (name, email, contact details, vehicle details, etc.). Users are responsible for maintaining the confidentiality of their login credentials and agree to notify Amacar immediately of any unauthorized use.

b. Prohibited Actions
- Upload personal documents (such as driver's license, insurance, registration, etc.) or any content not directly related to the vehicle auction process.
- Provide false or misleading information regarding the vehicle's condition, VIN#, or any other details to manipulate auction bids.
- Attempt to tamper with, hack, or exploit the Platform for unfair advantage, including using bots or other automated tools.
- Engage in "fake bidding," where no genuine intent to purchase exists, or manipulate bidding behavior.`
        },
        {
            id: 'disclaimer',
            title: 'Disclaimer and Limitation of Liability',
            icon: AlertTriangle,
            content: `Our website is provided "as is" without warranties, representations, or conditions of any kind, either express or implied. This includes, without limitation, warranties of merchantability, fitness for a particular purpose, and non-infringement.

We do not guarantee that the website will be error-free, uninterrupted, or secure. Use of the website is at your sole risk. We are not responsible for any damages, including indirect or incidental damages, arising from your use of our website.

In jurisdictions that do not allow the exclusion of certain warranties or limitations of liability, our liability is limited to the maximum extent permitted by law.`
        },
        {
            id: 'arbitration',
            title: 'Arbitration and Dispute Resolution',
            icon: Scale,
            content: `a. Binding Arbitration
Any dispute, claim, or controversy arising out of or relating to these Terms, your use of our website, or any transaction or interaction with dealers (collectively, "Disputes") will be resolved exclusively through binding arbitration between you and the dealers, rather than in court, except as otherwise provided below. This includes, but is not limited to, Disputes arising out of or relating to contract, tort, statutory claims, or any other legal theory. The Federal Arbitration Act (FAA) governs the interpretation and enforcement of this arbitration agreement.

b. Arbitration Procedures
Arbitration will be conducted by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, as modified by these Terms. The arbitration will take place in the county where you reside, or another mutually agreed location, and will be conducted in English. The arbitrator's decision will be binding and final, and judgment on the award rendered by the arbitrator may be entered in any court with jurisdiction.

c. Class Action Waiver
You and the dealers agree that any Disputes will be resolved on an individual basis and not as part of a class, consolidated, or representative action. The arbitrator may not consolidate claims of more than one party or otherwise preside over any form of a representative or class proceeding.`
        },
        {
            id: 'governing-law',
            title: 'Governing Law',
            icon: Scale,
            content: `These Terms are governed by the laws of the State of California without regard to its conflict of law provisions, as well as applicable federal laws. Any disputes arising out of or relating to these Terms will be resolved exclusively in the courts located in California, except as otherwise required by arbitration.`
        }
    ];

    return (
        <>
            <Seo title={seoData.terms.title} description={seoData.terms.description} />
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
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
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
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <IconComponent className="w-5 h-5 text-orange-600" />
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

                        {/* Additional Information */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">Important Notice</h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        These Terms of Service constitute the entire agreement between you and Amacar LLC regarding your use of the website and supersede any prior agreements. We may revise and update these Terms from time to time in our sole discretion. All changes are effective immediately when we post them, and apply to all access to and use of the Website thereafter.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default TermsOfService;
