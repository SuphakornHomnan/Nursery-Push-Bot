exports.checkDay = (day) => {
  if (day === 'Sun' || day === 'Sat') {
    return false
  } else {
    return true
  }
}
