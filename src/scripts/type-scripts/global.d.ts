// Global TypeScript declarations for GoRakuDo
declare global {

  interface Window {
    clientLogger: {
      log: (
        message: string,
        level?: 'info' | 'success' | 'warning' | 'error'
      ) => void;
      startGroup: (title: string) => void;
      endGroup: (title: string) => void;
    };
    searchLoadingManager?: import('./docs/index/global').SearchLoadingManager;
    searchEngine?: import('./docs/index/global').ModernSearchEngine;
    contentConfig?: {
      getCategories: () => unknown[];
      getTags: () => unknown[];
    };
    allPosts?: Array<{
      id: string;
      title: string;
      description: string;
      slug: string;
      data?: {
        title?: string;
        description?: string;
        tags?: string[];
      };
    }>;
    Fuse?: {
      search: (query: string) => unknown[];
    };
  }
}

// Vue module declaration removed - no Vue components in use

export { };
