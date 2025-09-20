'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Loader2, AlertCircle, CheckCircle2, PhoneCall, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface HealthCallButtonProps {
  assistantId?: string;
}

export default function HealthCallButton({ assistantId }: HealthCallButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('+917738705798'); // Default number
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);

  // Validate phone number in E.164 format
  const validatePhoneNumber = (number: string) => {
    // Basic E.164 validation: + followed by numbers only
    const isValid = /^\+[0-9]{10,15}$/.test(number);
    setIsValidNumber(isValid);
    return isValid;
  };

  // Handle phone number change
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);

    // Only validate if there's input
    if (value.trim()) {
      validatePhoneNumber(value);
    } else {
      setIsValidNumber(true); // Reset validation for empty field
    }
  };

  // Format phone number to E.164
  const formatToE164 = (number: string) => {
    // Remove all non-digit characters except the + at the beginning
    let formatted = number.replace(/[^\d+]/g, '');

    // Ensure it starts with a +
    if (!formatted.startsWith('+')) {
      formatted = '+' + formatted;
    }

    return formatted;
  };

  const initiateCall = async () => {
    try {
      // Format and validate the phone number first
      const formattedNumber = formatToE164(phoneNumber);
      if (!validatePhoneNumber(formattedNumber)) {
        setErrorMessage('Please enter a valid phone number in international format (e.g., +917738705798)');
        toast.error("Invalid Phone Number", {
          description: "Please enter a valid international phone number with country code.",
        });
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      console.log('Starting health consultation call to:', formattedNumber, 'with assistant:', assistantId);

      // Show initiating call toast
      toast.loading("Initiating Health Consultation", {
        description: "Please wait while we connect your health consultation call...",
      });

      const response = await fetch('/api/health-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedNumber,
          assistantId: assistantId,
        }),
      });

      const data = await response.json();
      console.log('API response:', data);

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to initiate health consultation call';
        console.error('Error response:', errorMsg);
        console.error('Full error data:', data);
        console.error('Response status:', response.status);
        setErrorMessage(errorMsg);

        // Show error toast with more details
        toast.error("Call Failed", {
          description: `${errorMsg} (Status: ${response.status})`,
        });

        throw new Error(errorMsg);
      }

      // Handle successful response
      console.log('Health consultation call initiated successfully:', data);

      // Clear any previous error
      setErrorMessage(null);

      // Check if the response has an id property
      if (data && data.id) {
        // Store call ID and show success dialog
        setCallId(data.id);
        setShowSuccessDialog(true);

        // Also show toast for non-disruptive notification
        toast.success("Health Consultation Call Initiated!", {
          description: `Your health consultant will call you shortly. Call ID: ${data.id.substring(0, 8)}...`,
        });
      } else {
        console.warn('Call initiated but no ID was returned:', data);
        // Show success dialog without ID
        setCallId(null);
        setShowSuccessDialog(true);

        toast.success("Health Consultation Call Initiated!", {
          description: "Your health consultant will call you shortly.",
        });
      }
    } catch (error) {
      console.error('Error initiating health consultation call:', error);
      const msg = error instanceof Error ? error.message : 'Failed to initiate health consultation call. Please try again.';
      setErrorMessage(msg);

      // Show error toast if not already shown
      toast.error("Error", {
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-slate-700 font-medium">
            Phone Number
          </Label>
          <div className="relative">
            <Input
              id="phoneNumber"
              type="text"
              placeholder="+917738705798"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              disabled={isLoading}
              className={`pl-3 pr-10 py-3 bg-white border-2 ${!isValidNumber ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-[#5C5FFF] focus:border-[#5C5FFF]'} rounded-xl`}
            />
            {!isValidNumber && (
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>

          {!isValidNumber && (
            <p className="mt-1 text-sm text-red-500">
              Please enter a valid international phone number with country code
            </p>
          )}

          <p className="text-xs text-slate-500">
            Format: Include country code with + (e.g., +917738705798)
          </p>
        </div>

        <Button
          onClick={initiateCall}
          disabled={isLoading || !isValidNumber}
          className="w-full bg-[#5C5FFF] hover:bg-[#5C5FFF]/90 text-white font-medium transition-colors py-3 rounded-xl text-base"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting to Health Consultant...
            </>
          ) : (
            <>
              <Stethoscope className="mr-2 h-4 w-4" />
              Start Health Consultation
            </>
          )}
        </Button>

        {errorMessage && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md border-2 border-[#5C5FFF] bg-white shadow-xl rounded-2xl">
          <DialogHeader>
            <div className="mx-auto bg-[#5C5FFF]/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-9 w-9 text-[#5C5FFF]" />
            </div>
            <DialogTitle className="text-center text-xl text-slate-900">Health Consultation Call Initiated!</DialogTitle>
            <DialogDescription className="text-center text-slate-600">
              Your AI Health Consultant will call you shortly at {phoneNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-3 p-4 bg-[#5C5FFF]/5 rounded-xl">
            <div className="flex justify-center items-center gap-2">
              <PhoneCall className="h-5 w-5 text-[#5C5FFF]" />
              <p className="text-[#5C5FFF] font-medium">Get ready to answer your phone</p>
            </div>

            {callId && (
              <div className="bg-white border-2 border-[#5C5FFF]/20 p-3 rounded-xl text-center">
                <p className="text-xs text-slate-500">Call Reference ID:</p>
                <p className="font-mono text-sm text-slate-900 break-all">{callId}</p>
              </div>
            )}

            <p className="text-sm text-[#5C5FFF]/80 text-center">
              Please answer the incoming call to start your health consultation session
            </p>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-[#5C5FFF] hover:bg-[#5C5FFF]/90 text-white transition-colors rounded-xl"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
