import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, LogOut} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./button";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
    const [isSuccess, setIsSuccess] = useState(false);
  
    const handleConfirm = async () => {
      try {
        await onConfirm();
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 1500); // Close after success animation
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-xl border border-slate-200">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {isSuccess ? (
              <div className="flex flex-col items-center gap-4 py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <CheckCircle2 className="h-16 w-16 text-orange-500" />
                </motion.div>
                <h2 className="text-xl font-semibold text-slate-800">Logout Successful</h2>
                <p className="text-sm text-slate-600">You have been logged out.</p>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <LogOut className="h-5 w-5 text-orange-500" />
                    Confirm Logout
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600">
                    Are you sure you want to log out? You will need to log in again to access your account.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="cursor-pointer rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="cursor-pointer rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                    onClick={handleConfirm}
                  >
                    Logout
                  </Button>
                </DialogFooter>
              </>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }