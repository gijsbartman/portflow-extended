import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "wxt"

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: "Portflow Extended",
    description: "A production-grade extension to enhance Portflow features.",
    version: "0.0.1",
    permissions: ["storage"],
    host_permissions: [
      "https://canvas.hu.nl/accounts/1/external_tools/1134",
      "https://portfolio.drieam.app/*",
    ],
    web_accessible_resources: [
      {
        resources: ["interceptor.js"],
        matches: ["https://portfolio.drieam.app/*"],
      },
    ],
  },
})
