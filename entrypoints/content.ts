export default defineContentScript({
  matches: ["https://canvas.hu.nl/*"],
  runAt: "document_end",
  allFrames: true,
  main() {
    console.log("🚀 Portflow Extended: Content script loaded!")
    console.log("📍 Current URL:", window.location.href)

    // Add a visible banner to confirm the script is running
    const banner = document.createElement("div")
    banner.textContent = "🚀 Portflow Extended is ACTIVE!"
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px;
      text-align: center;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-family: system-ui, -apple-system, sans-serif;
    `
    document.body.prepend(banner)

    // Remove banner after 3 seconds
    setTimeout(() => {
      banner.style.transition = "opacity 0.5s"
      banner.style.opacity = "0"
      setTimeout(() => banner.remove(), 500)
    }, 3000)
  },
})
