import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cookie, Settings, BarChart3, Target, Shield, AlertTriangle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiesPolicy = () => {
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
            content: `This website uses cookies. By continuing to browse the site, you are agreeing to our use of cookies. This Cookies Policy explains what cookies are, how we use them, and how you can manage them when you use Amacar's platform.`
        },
        {
            id: 'what-are-cookies',
            title: 'What Are Cookies?',
            icon: Cookie,
            content: `Cookies are small text files containing a string of characters that can be placed on your computer or mobile device to uniquely identify your browser or device. Cookies allow a website or service to recognize if your computer or device has visited the website or service before. They can be used to improve your browsing experience by helping you navigate between pages efficiently, remembering your preferences, and ensuring that marketing you see online is more relevant to you and your interests.`
        },
        {
            id: 'types-of-cookies',
            title: 'Types of Cookies We Use',
            icon: Settings,
            content: `We use the following types of cookies on Amacar's platform to enhance your experience and provide essential services:

1. Strictly Necessary Cookies
These cookies are essential to enable you to navigate the platform and use its features, such as accessing secure areas of the Website. Without these cookies, certain services cannot be provided. Examples include:
- Remembering your session and keeping you logged in.
- Ensuring secure payment processes during vehicle auctions or transactions.

2. Performance Cookies
Performance cookies collect information about how you use our platform, such as which pages you visit most frequently. This helps us:
- Understand how the platform is used.
- Identify and fix errors.
- Optimize the Website's performance to deliver a better user experience.
These cookies do not collect information that identifies you personally; all data is aggregated and anonymous.

3. Functionality Cookies
Functionality cookies allow us to remember the choices you make and provide enhanced features tailored to you. Examples include:
- Remembering your login details or preferences.
- Saving your vehicle appraisal information for future visits.
- Customizing the platform to reflect your preferences, such as language settings or notification preferences.
The data collected by functionality cookies may be anonymized and is not used to track your activity on other websites.

4. Targeting Cookies
Targeting cookies are used to deliver advertisements more relevant to you and your interests. They also help us:
- Limit the number of times you see an advertisement.
- Measure the effectiveness of advertising campaigns.
These cookies are placed by third-party advertising networks on our behalf with Amacar's permission. They may remember that your device has visited our platform and track your browsing activity across other websites or services.`
        },
        {
            id: 'third-party-cookies',
            title: 'Third-Party Cookies',
            icon: BarChart3,
            content: `We may use third-party service providers that set cookies on our behalf to deliver services, such as analytics and advertising. Examples include:

- Google Analytics: Tracks website usage to help us understand how users interact with the platform and improve functionality.
- Advertising Networks: Serve personalized ads based on your browsing activity.

These third parties may use their cookies in accordance with their privacy policies, which we encourage you to review.`
        },
        {
            id: 'control-delete-cookies',
            title: 'How to Control and Delete Cookies',
            icon: Shield,
            content: `Most internet browsers are initially set up to automatically accept cookies. However, you can manage cookies in several ways, depending on your preferences:

1. Adjusting Browser Settings
You can change your browser settings to:
- Block cookies.
- Alert you when cookies are sent to your device.
- Delete cookies already stored on your device.
Refer to your browser's instructions or help screen for specific guidance. Popular browsers such as Chrome, Firefox, Safari, and Edge offer easy-to-follow instructions for managing cookies.

2. Managing Third-Party Cookies
To manage cookies placed by third parties, visit their websites and review their cookie policies. Many advertising networks also allow you to opt out of targeted advertising through their platforms.

3. Impact of Disabling Cookies
If you disable cookies, some features and services on Amacar's platform may not function correctly. For example, you may be unable to:
- Stay logged in during a session.
- Save your vehicle listings or preferences.
- Participate fully in auctions or other services.

4. Multi-Device Management
If you use multiple devices to access the platform (e.g., smartphone, tablet, laptop), you must adjust the cookie settings on each device to reflect your preferences.`
        },
        {
            id: 'updates',
            title: 'Updates to This Cookies Policy',
            icon: FileText,
            content: `We may update this Cookies Policy from time to time to reflect changes in technology, legal requirements, or the services we provide. When we do, we will revise the "Effective Date" at the top of this policy and notify you where appropriate.`
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
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                                <Cookie className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Cookies Policy</h1>
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
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <IconComponent className="w-5 h-5 text-green-600" />
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

                    {/* Cookie Management Guide */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Cookie Management Guide</h3>
                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4 border border-green-200">
                                        <h4 className="font-semibold text-slate-800 mb-2">Chrome</h4>
                                        <p className="text-sm text-slate-600">Settings → Privacy and security → Cookies and other site data</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-green-200">
                                        <h4 className="font-semibold text-slate-800 mb-2">Firefox</h4>
                                        <p className="text-sm text-slate-600">Options → Privacy & Security → Cookies and Site Data</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-green-200">
                                        <h4 className="font-semibold text-slate-800 mb-2">Safari</h4>
                                        <p className="text-sm text-slate-600">Preferences → Privacy → Manage Website Data</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-green-200">
                                        <h4 className="font-semibold text-slate-800 mb-2">Edge</h4>
                                        <p className="text-sm text-slate-600">Settings → Cookies and site permissions → Cookies and site data</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Cookie className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Us</h3>
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    If you have any questions about our use of cookies or this Cookies Policy, please contact us:
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

export default CookiesPolicy;
