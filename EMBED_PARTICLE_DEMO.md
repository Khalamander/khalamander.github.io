# Embedding Particle Simulation Demo

This guide shows how to embed your React/TypeScript particle simulation into your portfolio.

## 🚀 **Step-by-Step Setup:**

### **Step 1: Build Your React App**
```bash
# Navigate to your particle simulation project
cd /path/to/your/emergent-particle-life-simulation

# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

### **Step 2: Copy Built Files**
After building, you'll have a `dist` folder. Copy its contents to your portfolio:

```bash
# Create the particle-demo folder in your portfolio
mkdir -p /Users/khaledalikhan/Desktop/Projects/Portfolio/particle-demo

# Copy the built files
cp -r /path/to/your/emergent-particle-life-simulation/dist/* /Users/khaledalikhan/Desktop/Projects/Portfolio/particle-demo/
```

### **Step 3: Test the Integration**
1. Open your portfolio: `index.html`
2. Click on the "External Link" button for the Particle Life project
3. It should open your React simulation in a new tab

## 📁 **Final Structure:**
```
Portfolio/
├── index.html
├── styles.css
├── script.js
├── particle-demo/              # Your React app
│   ├── index.html              # Built React app
│   ├── assets/
│   │   ├── index-[hash].js     # React bundle
│   │   └── index-[hash].css    # React styles
│   └── ...
└── screenshots/
```

## 🔧 **Troubleshooting:**

### **If the demo doesn't load:**
1. Check that all files were copied correctly
2. Make sure the `particle-demo` folder is in the same directory as `index.html`
3. Check browser console for any errors

### **If paths are broken:**
Your React app might have absolute paths. You may need to:
1. Set `base: './'` in your Vite config
2. Or rebuild with relative paths

### **Vite Config Fix (if needed):**
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: './',  // Add this line for relative paths
  build: {
    outDir: 'dist'
  }
});
```

## 🎯 **Benefits of This Approach:**

✅ **Integrated Experience**: Demo opens from your portfolio  
✅ **No External Dependencies**: Everything hosted together  
✅ **Professional Look**: Seamless navigation  
✅ **Easy Updates**: Just rebuild and copy files  

## 🚀 **Deployment:**

When you deploy to GitHub Pages:
1. The `particle-demo` folder will be included
2. The external link will work on the live site
3. Everything stays in one repository

## 📝 **Next Steps:**

1. Build your React app
2. Copy files to `particle-demo/` folder
3. Test the integration
4. Deploy everything to GitHub Pages

Your portfolio will now have a live, interactive demo of your particle simulation! 🎨
