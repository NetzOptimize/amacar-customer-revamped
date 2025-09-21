import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, User, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const PasswordResetRequestModal = ({ isOpen, onClose, onModalClose }) => {
    const navigate = useNavigate();

    const handleGoToProfile = () => {
        navigate('/profile');
        onClose();
        // Call the callback function when modal closes
        if (onModalClose) {
            onModalClose();
        }
    };

    const handleContinueToDashboard = () => {
        onClose();
        // Call the callback function when modal closes
        if (onModalClose) {
            onModalClose();
        }
    };

    const handleDialogClose = (open) => {
        if (!open) {
            onClose();
            // Call the callback function when modal closes
            if (onModalClose) {
                onModalClose();
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-md rounded-2xl shadow-xl p-0 overflow-hidden bg-white">
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
                    <DialogHeader>
                        <div className="flex items-center justify-center mb-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 15,
                                    delay: 0.2
                                }}
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
                            >
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </motion.div>
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center text-slate-900 mb-2">
                            Registration Successful!
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-600">
                            You have been successfully registered. Please complete your profile setup.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-semibold text-amber-800 mb-1">
                                        Important Security Notice
                                    </h3>
                                    <p className="text-sm text-amber-700">
                                        For your account security, please change your password as soon as possible.
                                        You can do this in your profile settings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 space-y-3"
                    >
                        <button
                            onClick={handleGoToProfile}
                            className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                        >
                            <span>Go to Profile</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleContinueToDashboard}
                            className="cursor-pointer w-full text-slate-600 hover:text-slate-800 font-medium py-2 px-6 rounded-xl transition-colors duration-200"
                        >
                            Continue to Dashboard
                        </button>
                    </motion.div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PasswordResetRequestModal;
