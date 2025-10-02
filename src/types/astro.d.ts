/// <reference path="../.astro/types.d.ts" />

// ========================================
// Astro Component Declarations
// ========================================

declare module '*.astro' {
 const Component: import('astro').AstroComponentFactory;
 export default Component;
}

declare module '*.json' {
 const value: unknown;
 export default value;
}

// ========================================
// YouTube Channel Data Types
// ========================================

export interface YouTubeChannel {
 channelCover: string;
 channelName: string;
 channelProfile: string;
 channelURL: string;
}

export interface ChannelCardProps {
 channelCover: string;
 channelName: string;
 channelProfile: string;
 channelURL: string;
}

// ========================================
// Component Module Declarations
// ========================================

declare module '../../../layouts/BaseLayout.astro' {
 const BaseLayout: import('astro').AstroComponentFactory;
 export default BaseLayout;
}

declare module '../../../components/content/ChannelCard.astro' {
 const ChannelCard: import('astro').AstroComponentFactory;
 export default ChannelCard;
}

declare module '../../../data/youtube-channels.json' {
 const channels: YouTubeChannel[];
 export default channels;
}
