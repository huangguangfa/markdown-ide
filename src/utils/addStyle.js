export const addStyle = (url, id) => {
  if (!document.getElementById(id)) {
      const styleElement = document.createElement('link')
      styleElement.id = id
      styleElement.rel = 'stylesheet'
      styleElement.type = 'text/css'
      styleElement.href = url
      document.getElementsByTagName('head')[0].appendChild(styleElement)
  }
}
