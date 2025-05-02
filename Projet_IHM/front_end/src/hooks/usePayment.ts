import { useState } from 'react';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

interface ProcessPaymentParams {
  productId: string;
  amount: number;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export const useProcessPayment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const processPayment = async (data: ProcessPaymentParams) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/payment', data);
      
      toast({
        title: 'Payment successful',
        description: `$${data.amount} payment processed`,
      });
      
      return response.data;
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: axios.isAxiosError(error) 
          ? error.response?.data?.message || 'Payment processing error'
          : 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { processPayment, isLoading };
};