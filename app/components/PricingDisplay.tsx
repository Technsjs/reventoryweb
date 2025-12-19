'use client';

import { useEffect, useState } from 'react';

interface Pricing {
  standard: string;
  pro: string;
  currency: string;
}

const pricingByCountry: Record<string, Pricing> = {
  US: { standard: '$2.99', pro: '$4.99', currency: 'USD' },
  NG: { standard: '₦2,000', pro: '₦5,000', currency: 'NGN' },
  default: { standard: '$2.99', pro: '$4.99', currency: 'USD' },
};

interface PricingDisplayProps {
  plan: 'standard' | 'pro';
}

export default function PricingDisplay({ plan }: PricingDisplayProps) {
  const [price, setPrice] = useState<string>('₦2,000');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect country from IP
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code || 'US';
        
        // Set pricing based on country
        if (countryCode === 'NG') {
          setPrice(plan === 'standard' ? pricingByCountry.NG.standard : pricingByCountry.NG.pro);
        } else {
          setPrice(plan === 'standard' ? pricingByCountry.US.standard : pricingByCountry.US.pro);
        }
      } catch (error) {
        // Fallback to Nigeria pricing (primary market)
        setPrice(plan === 'standard' ? pricingByCountry.NG.standard : pricingByCountry.NG.pro);
      } finally {
        setLoading(false);
      }
    };

    detectCountry();
  }, [plan]);

  if (loading) {
    return <span className="text-zinc-400">{plan === 'standard' ? '₦2,000' : '₦5,000'}</span>;
  }

  return <>{price}</>;
}
