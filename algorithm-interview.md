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