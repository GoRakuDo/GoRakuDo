/**
 * Minimal Console Logger
 * Simplified logging utility following minimalist principles
 */

export interface LogGroup {
  title: string;
  startTime?: number;
}

export class ConsoleLogger {
  private static instance: ConsoleLogger;
  private currentGroup: LogGroup | null = null;
  private isBuildMode = false;

  constructor() {
    this.isBuildMode = this.detectBuildMode();
  }

  private detectBuildMode(): boolean {
    return (
      process.env.NODE_ENV === 'production' ||
      process.env.ASTRO_ENV === 'build' ||
      (typeof process !== 'undefined' && process.argv.includes('build'))
    );
  }

  static getInstance(): ConsoleLogger {
    if (!ConsoleLogger.instance) {
      ConsoleLogger.instance = new ConsoleLogger();
    }
    return ConsoleLogger.instance;
  }

  startGroup(title: string): void {
    if (this.currentGroup) {
      this.endGroup();
    }

    this.currentGroup = {
      title,
      startTime: performance.now(),
    };

    if (!this.isBuildMode) {
      console.log(`\n🚀 ${title}`);
    }
  }

  endGroup(): void {
    if (!this.currentGroup) return;

    const duration = this.currentGroup.startTime
      ? ` (${(performance.now() - this.currentGroup.startTime).toFixed(2)}ms)`
      : '';

    if (!this.isBuildMode) {
      console.log(`✅ ${this.currentGroup.title}${duration}\n`);
    }

    this.currentGroup = null;
  }

  log(message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    if (this.isBuildMode) return;

    const emoji = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' }[level];
    console.log(`${emoji} ${message}`);
  }

  logSummary(title: string, data: Record<string, unknown>): void {
    if (this.isBuildMode) return;

    console.log(`\n📊 ${title}:`);
    Object.entries(data).forEach(([key, value]) => {
      const formattedValue = typeof value === 'number' && value > 1000
        ? value.toLocaleString()
        : value;
      console.log(`   ${key}: ${formattedValue}`);
    });
  }

  setBuildMode(enabled: boolean): void {
    this.isBuildMode = enabled;
  }

  logContentPreview(title: string, content: string, maxLength = 150): void {
    if (this.isBuildMode) return;

    const preview = content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;

    console.log(`📝 ${title}:`);
    console.log(`   ${preview}`);
  }
}

// Export singleton instance
export const logger = ConsoleLogger.getInstance();