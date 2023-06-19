import { color } from '@sb/webapp-core/theme';

export const StripeIframeStyles = {
  base: {
    color: '#0f1729',
    fontFamily: 'var(--font-sans)',
    fontSmoothing: 'antialiased',
    fontSize: '14px',
    lineHeight: '38px',
    fontWeight: '400',
    '::placeholder': { color: '#65758b' },
    border: `1px solid red`,
    padding: '10px',
  },
  invalid: { color: color.input.invalid, iconColor: color.input.invalid },
};

export const StripeIframeClasses = {
  base: 'h-10 w-full transition-all duration-200 ease-in rounded-md border border-input bg-transparent px-3 text-primary text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
};
