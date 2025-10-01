/// <reference path="../.astro/types.d.ts" />

// ========================================
// Astro Component Declarations
// ========================================

declare module '*.astro' {
 const Component: any;
 export default Component;
}

declare module '*.json' {
 const value: any;
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
 const BaseLayout: any;
 export default BaseLayout;
}

declare module '../../../components/content/ChannelCard.astro' {
 const ChannelCard: any;
 export default ChannelCard;
}

declare module '../../../data/youtube-channels.json' {
 const channels: YouTubeChannel[];
 export default channels;
}
