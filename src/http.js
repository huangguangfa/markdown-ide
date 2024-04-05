export async function uploadImg(file, { bizCode, token, userId }) {
  try {
    const formData = new FormData()
    formData.append('bizCode', bizCode)
    formData.append('num', 1)
    formData.append('token', token)
    formData.append('x-uid', userId)
    formData.append('file', file)
    const response = await fetch('router/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('图片上传失败')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    throw error
  }
}
