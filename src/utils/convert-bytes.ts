function convertBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  let size = ''

  if (bytes < k) {
    size = bytes + ' Bytes'
  } else if (bytes >= k && bytes < k * k) {
    size = (bytes / k).toFixed(dm) + ' KB'
  } else if (bytes >= k * k && bytes < k * k * k) {
    size = (bytes / (k * k)).toFixed(dm) + ' MB'
  } else {
    size = (bytes / (k * k * k)).toFixed(dm) + ' GB'
  }

  return size
}

export default convertBytes
