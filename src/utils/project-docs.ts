export const getProjectDocSlug = (id: string): string => (id.split('/').pop() ?? id).replace(/\.mdx$/, '');
