## 算法

### 无重复的最长子串
1. 'abcabcbb' 'abc'
2. 'bbbbb' 'b'
3. 'pwwkew' 'wke'

```
function getMax(str) {
  let result = ''
  let sub = ''

  for (let i = 0; i < str.length; i++) {
    const now = str.charAt(i)
    const index = sub.indexOf(now)
    if (index !== -1) {
      sub = sub.substr(index + 1)
    }
    sub += now
    if (sub.length > result.length) {
      result = sub
    }
  }

  return result
}
```

### 最长回文字符串 
1. 1212134 12121
2. babad bab
3. cbbd bb
4. ac a

```
function getMaxReverseStr(str) {
  let result = ''

  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j < str.length + 1; j++) {
      const sub = str.substring(i, j)
      const reverseSub = sub.split('').reverse().join('')
      if (sub === reverseSub && sub.length > result.length) {
        result = sub
      }
    }
  }

  return result
}
```

### 求两个字符串中的最大公共子串
```
function getMaxPublicStr(str1, str2) {
  const maxStr = str1.length > str2.length ? str1 : str2
  const minStr = str1.length <= str2.length ? str1 : str2

  const minLength = minStr.length
  const result = ''

  for (let i = 0; i < minLength; i++) {
    for (let j = i + 1; j < minLength; j++) {
      const sub = maxStr.substring(i, j)
      if (minStr.indexOf(sub) > -1 && sub.length > result) {
        result = sub
      }
    }
  }

  return result
}

function getMaxPublicStr1(str1, str2) {
  const temp = []
  let step = 0
  let index = 0
  const str1Length = str1.length
  const str2Length = str2.length
  
  for (let i = 0; i < str1Length; i++) {
    temp[i] = []
    for (let j = 0; j < str2Length; j++) {
      if (str1.charAt(i) === str2.charAt(j)) {
        const prevCount = temp?.[i - 1]?.[j - 1] || 0
        temp[i][j] = prevCount + 1
      } else {
        temp[i][j] = 0
      }

      const current = temp[i][j]
      if (step < current) {
        step = current
        index = j
      }
    }
  }

  return str1.substr(index - step + 1, step)
}
```
### 找到字符串中的数字和科学计数法

### 找出字符串中()中的内容以及是否合法

### 两个有序数组进行按顺序合并 
```
function combine(arr1, arr2) {
  const result = new Array().fill(arr1.length + arr2.length)
  let length1 = arr1.length - 1
  let length2 = arr2.length - 1
  let resultIndex = result.length - 1

  while(length1 >= 0 && length2 >= 0) {
    if (arr1[length1] > arr2[length2]) {
      result[resultIndex] = arr1[length1]
      length1--
    } else {
      result[resultIndex] = arr2[length2]
      length2--
    }
    resultIndex--
  }

  if (length1 > 0) {
    while (length1 >= 0) {
      result[resultIndex] = arr1[length1]
      length1--
      resultIndex--
    }
  }
  if (length2 > 0) {
    while (length2 >= 0) {
      result[resultIndex] = arr2[length2]
      length2--
      resultIndex--
    }
  }

  return result
}
```