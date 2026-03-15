import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

Your final folder structure should look like this:
```
axiom-systems/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── AxiomSystems.jsx