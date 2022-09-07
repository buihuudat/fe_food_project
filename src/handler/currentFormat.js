const currentFormat = (amount) => {
  const money = new Intl.NumberFormat(
    'vi-VN', 
    { style: 'currency', currency: 'VND' }).format(amount);
  return money
}

export default currentFormat