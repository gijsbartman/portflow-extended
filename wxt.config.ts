import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Portflow Extended",
    description: "A production-grade extension to enhance Portflow features.",
    version: "0.1.0",
    permissions: ["storage", "tabs"],
  },
})
