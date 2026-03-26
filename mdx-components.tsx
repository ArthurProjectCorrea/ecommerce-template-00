import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mb-4 scroll-m-20 text-2xl font-bold tracking-tight text-balance">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-2 scroll-m-20 text-xl font-semibold tracking-tight text-balance first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 scroll-m-20 text-lg font-semibold tracking-tight text-balance">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 mb-1 scroll-m-20 text-base font-semibold tracking-tight text-balance">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-sm leading-normal not-first:mt-3">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="text-muted-foreground mt-4 border-l-2 pl-4 text-sm italic">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul className="my-4 ml-6 list-disc text-sm [&>li]:mt-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal text-sm [&>li]:mt-1">{children}</ol>
    ),
    li: ({ children }) => <li className="mt-1">{children}</li>,
    code: ({ children }) => (
      <code className="bg-muted relative rounded px-[0.2rem] py-[0.1rem] font-mono text-xs font-semibold">
        {children}
      </code>
    ),
    a: ({ href, children }) => (
      <Link
        href={href || '#'}
        className="hover:text-primary text-sm font-medium underline underline-offset-4 transition-colors"
      >
        {children}
      </Link>
    ),
    ...components,
  };
}
