# Three.js Journey

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

# Field Of View

FOV is

- Vertical vision angle
- in degrees
- also called `fov`

# Aspect ratio

The width of the render divided by the height of the render

# Near And Far

The third and fourth parameters called near and far, correspond to how close

Do not use extreme values like `0.0001` and `99999` to prevent z-fighting
