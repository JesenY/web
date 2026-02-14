// 获取手机号输入字段的引用
const phoneNumberInput = document.getElementById('phone-number');

// 设置手机号的最大位数
const MAX_PHONE_NUMBER_LENGTH = 11;

// 监听键盘事件
phoneNumberInput.addEventListener('keypress', (event) => {
  // 获取当前输入的手机号
  const phoneNumber = event.target.value;

  // 如果输入的手机号位数已达到最大值，则阻止用户继续输入
  if (phoneNumber.length >= MAX_PHONE_NUMBER_LENGTH) {
    event.preventDefault();
  }
});
