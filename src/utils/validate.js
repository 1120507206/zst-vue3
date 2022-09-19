/**
 * 判断是否是外链
 * @param {string} path
 * @returns {Boolean}
 * @author LiQingSong
 */
export const isExternal = (path) => /^(https?:|mailto:|tel:)/.test(path);
//#region 表单验证相关
export function name(rule, value, callback) {
  if (!/^[\w\u4E00-\u9FA5]{1,10}$/.test(value)) {
    callback(new Error('用户名仅支持汉字、数字、英文字母组合'));
  } else {
    callback();
  }
}
export function password(rule, value, callback) {
  if (!/^[\w\d\S]{6,20}$/.test(value)) {
    callback(new Error('密码长度为6-20,仅支持英文字母、数字、特殊字符(不包含空格)'));
  } else {
    callback();
  }
}
export function chineseName(rule, value, callback) {
  if (!/^[\u4E00-\u9FA5]{2,6}$/.test(value)) {
    callback(new Error('请输入正确的姓名'));
  } else {
    callback();
  }
}
export function region(rule, value, callback) {
  if (!/^[\u4E00-\u9FA5]{1,20}$/.test(value)) {
    callback(new Error('民族格式不正确'));
  } else {
    callback();
  }
}
export function email(rule, value, callback) {
  /* eslint-disable no-useless-escape */
  if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
    if (!rule.required && value === '') {
      callback();
      return;
    }
    callback(new Error('电子邮箱格式不正确'));
  } else {
    callback();
  }
}
export function fixedPhone(rule, value, callback) {
  if (!(/(^[0-9]{3,4}-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/g.test(value))) {
    callback(new Error('固定电话格式不正确'));
  } else {
    callback();
  }
}
export function phone(rule, value, callback) {
  if (!/^1[2-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号码'));
  } else {
    callback();
  }
}
export function postalCode(rule, value, callback) {
  if (!/^\d{6}$/.test(value)) {
    callback(new Error('请输入正确的邮政编码'));
  } else {
    callback();
  }
}
export function idCard(rules, value, callback) {
  if (/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)
        || /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(value)) {
    callback();
  } else {
    callback(new Error('身份证格式有误'));
  }
}
export function idCardFormat(rules, value, callback) {
  const area = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
  };
  if (!area[Number(value.slice(0, 2))]) {
    callback(new Error('身份证地区非法'));
    return;
  }
  if (value.length === 15) {
    let reg;
    const year = parseInt(value.slice(6, 2), 10) + 1900;
    if (year % 4 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      // 闰年
      reg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; // 测试出生日期的合法性
    } else {
      // 平年
      reg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; // 测试出生日期的合法性
    }
    if (reg.test(value)) {
      callback();
      return;
    }
    callback(new Error('身份证号码出生日期超出范围或含有非法字符'));
    return;
  }
  if (value.length === 18) {
    let reg;
    const year = parseInt(value.slice(6, 4), 10);
    if (year % 4 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      // 闰年
      reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|29|30|31)\d{3}[0-9Xx]$/;
    } else {
      // 平年
      reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    }
    if (reg.test(value)) {
      // 校验码判断
      const coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 系数
      const checkCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']; // 校验码对照表
      const idCardNumArr = value.split('');
      const sum = idCardNumArr.reduce((acc, cur, index) => {
        let num = acc;
        if (index !== 17) {
          num += parseInt(cur, 10) * coefficient[index];
        }
        return num;
      }, 0);
      if (idCardNumArr[17].toUpperCase() !== checkCode[sum % 11].toUpperCase()) {
        callback(new Error('身份证号格式不正确'));
      } else {
        callback();
      }
      return;
    }
    callback(new Error('身份证号码出生日期超出范围或含有非法字符'));
    return;
  }
  callback(new Error('身份证格式错误'));
}
export function trim(rule, value, callback) {
  const str = String(value);
  if (str.trim().length !== str.length) {
    callback(new Error('前后不能有空格'));
  } else {
    callback();
  }
}
export function positiveInt(rules, value, callback) {
  if (!/^([1-9][0-9]*)$/.test(value)) {
    if (!rules.required && value === '') {
      callback();
      return;
    }
    callback(new Error('请输入正整数'));
  } else {
    callback();
  }
}
//#endregion
// # sourceMappingURL=validate.js.map
