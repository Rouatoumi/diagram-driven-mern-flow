import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useProcessPayment } from '../../hooks/usePayment';
import { Product } from ''; // Assuming you have a Product type

interface PaymentFormProps {
  product: Product;
  onPaymentSuccess?: () => void;
}

interface PaymentData {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export const PaymentForm = ({ product, onPaymentSuccess }: PaymentFormProps) => {
  const { processPayment, isLoading } = useProcessPayment();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentData>();

  const onSubmit = async (data: PaymentData) => {
    try {
      await processPayment({
        productId: product._id,
        amount: product.currentPrice,
        ...data,
      });
      onPaymentSuccess?.();
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          {...register('cardNumber', {
            required: 'Card number is required',
            pattern: {
              value: /^\d{16}$/,
              message: 'Invalid card number (16 digits required)',
            },
          })}
          placeholder="4242 4242 4242 4242"
        />
        {errors.cardNumber && (
          <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            {...register('expiry', {
              required: 'Expiry date is required',
              pattern: {
                value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                message: 'Use MM/YY format',
              },
            })}
            placeholder="MM/YY"
          />
          {errors.expiry && (
            <p className="text-sm text-red-500">{errors.expiry.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="password"
            {...register('cvv', {
              required: 'CVV is required',
              pattern: {
                value: /^\d{3,4}$/,
                message: '3 or 4 digit code required',
              },
            })}
            placeholder="123"
          />
          {errors.cvv && (
            <p className="text-sm text-red-500">{errors.cvv.message}</p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : `Pay $${product.currentPrice.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};