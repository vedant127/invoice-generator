import { useState } from 'react';
import api from '@/lib/api';

export function usePaymentLink() {
  const [loading, setLoading] = useState(false);

  const createPaymentLink = async (invoiceId: string) => {
    setLoading(true);
    try {
      const res = await api.post(`/api/v1/invoices/${invoiceId}/payment-link`);
      if (res.data.url) {
        return res.data.url;
      }
    } catch (err: any) {
      console.error('Failed to create payment link:', err);
      const errorMsg = err.response?.data?.detail || err.message;
      alert(`Failed to generate payment link: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return { createPaymentLink, loading };
}
