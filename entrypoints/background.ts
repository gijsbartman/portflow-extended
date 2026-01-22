export default defineBackground(() => {
  console.log("Portflow Extended background script loaded", {
    id: browser.runtime.id,
  })
})
