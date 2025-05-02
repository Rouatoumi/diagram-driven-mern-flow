export interface Payment {
    _id: string;
    productId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    paymentMethod: string;
    transactionId: string;
    createdAt: Date;
    updatedAt: Date;
  } 