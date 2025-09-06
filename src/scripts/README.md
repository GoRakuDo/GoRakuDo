# GoRakuDo Scripts Organization

## 📁 Directory Structure

```
src/scripts/
├── ui/                   # User interface and interaction scripts
│   ├── docs-pagination.js
│   └── settings-manager.js
├── core/                 # Core functionality and page-specific scripts
│   ├── hompage-script.js
│   ├── post-script.js
│   └── upgrade-browsermu.js
└── index.js             # Main entry point and exports
```

## 🎯 Script Categories

### **UI Scripts** (`ui/`)

- **docs-pagination.js**: Pagination functionality for docs listing page
- **settings-manager.js**: Settings management and persistence

### **Core Scripts** (`core/`)

- **hompage-script.js**: Homepage-specific functionality (wave animations, modals)
- **post-script.js**: Post page functionality (markdown rendering, navigation)
- **upgrade-browsermu.js**: Browser compatibility checker and upgrade prompts

## 🚀 Usage

### **Import from Index**

```javascript
import { DocsPagination, SettingsManager, HomepageScript } from '@/scripts';
```

### **Dynamic Loading**

```javascript
import { loadScript } from '@/scripts';

// Load specific script
const uiScript = await loadScript(
  'ui',
  'docs-pagination'
);
```

### **Auto-Initialization**

```javascript
import { initializeScripts } from '@/scripts';

// Auto-initialize based on current page
initializeScripts();
```

## 📊 Performance Features

### **Aggressive Loading**

- Default aggressive loading enabled
- Reduced thresholds for faster response
- Immediate enhancement loading
- Resource preloading for critical assets


### **Monitoring**

- Real-time performance metrics
- Core Web Vitals tracking
- Long task detection
- Resource loading optimization

## 🔧 Configuration

### **Astro Config Integration**

Scripts are integrated with Astro's build system for optimal bundling:

```javascript
// Manual chunk splitting for performance
manualChunks: {
  "scripts-ui": ["./src/scripts/ui/docs-pagination.js"],
  "scripts-core": ["./src/scripts/core/hompage-script.js", "./src/scripts/core/post-script.js"],
}
```

### **Build Optimization**

- Tree-shaking for unused code removal
- Code splitting for better caching
- Minification for smaller bundle sizes
- Source map optimization

## 🛡️ Safety Features

### **Error Handling**

- Comprehensive try-catch blocks
- Graceful fallbacks for missing elements
- Console logging for debugging
- Performance monitoring for errors

### **Browser Compatibility**

- Modern browser feature detection
- Progressive enhancement
- Fallback strategies for older browsers
- Upgrade prompts for unsupported browsers

## 📈 Performance Targets

### **Production**

- **Target Load Time**: 30ms
- **FCP Target**: 1000ms
- **LCP Target**: 1500ms
- **FID Target**: 100ms
- **CLS Target**: 0.1

### **Localhost**

- **Target Load Time**: 10ms
- **FCP Target**: 500ms
- **LCP Target**: 750ms
- **FID Target**: 50ms
- **CLS Target**: 0.05

## 🔄 Migration Notes

### **From `public/scripts/` to `src/scripts/`**

- ✅ All scripts migrated and categorized
- ✅ Import paths updated in all .astro files
- ✅ Astro configuration updated
- ✅ Build system optimized
- ✅ Old scripts directory removed

### **Path Updates**

- `public/scripts/` → `src/scripts/`
- Organized by category for better maintainability
- Index file for easy imports
- Dynamic loading support

## 🎯 Future Enhancements

### **Planned Features**

- TypeScript migration for better type safety
- Module federation for micro-frontend support
- Service worker integration for offline functionality
- Advanced caching strategies

### **Performance Improvements**

- Web Workers for heavy computations
- Intersection Observer optimization
- Request animation frame optimization
- Memory leak prevention

---

**Last Updated**: 2024-12-19  
**Status**: ✅ Migration Complete  
**Build Time**: 4.56s  
**Performance**: Optimized for sub-30ms production and sub-10ms localhost
