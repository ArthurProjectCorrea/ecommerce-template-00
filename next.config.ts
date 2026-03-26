import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    authInterrupts: true,
  },
};

const withMDX = createMDX({
  // Adicione plugins aqui se necessário
});

export default withMDX(nextConfig);
