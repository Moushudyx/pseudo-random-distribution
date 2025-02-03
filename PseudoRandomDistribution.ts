export function PseudoRandomDistribution(p = 0.5) {
  function getCFromP(p = 1) {
    if (p <= 0) return 0
    if (p >= 1) return 1
    // 备选方案：硬编码一个中间值用于降低计算量
    // if (p === 2 / 3) return 0.5;
    // let [down, up] = p < 2 / 3 ? [0, 0.5] : [0.5, 1]
    let [down, up] = [0, 1]
    let mid = 1
    let tempP = 1
    let tempPLast = 1
    let step = 100
    // 这里是一个 C-like 语言的梗: --> 操作符
    while (step-- > 0) {
      mid = (down + up) / 2
      tempP = getPFromC(mid)
      if (Math.abs(tempPLast - tempP) < 0.00005) break
      if (tempP > p) up = mid
      else down = mid
    }
    return mid
  }
  function getPFromC(c = 1) {
    let sum = 0 // 为了方便计算，这里的 sum 是最终数值的倒数
    let prod = 0 // 这里存的是已经计算过的命中比例
    let cur = 0 // 当前比例
    let max = Math.ceil(1 / c)
    for (let n = 1; n <= max; n++) {
      cur = Math.min(1, n * c) * (1 - prod)
      prod += cur
      sum += n * cur
    }
    return 1 / sum
  }
  const C = getCFromP(p)
  console.log(`[PseudoRandomDistribution] p: ${p}, c: ${C}`)
  let current = C
  return function getRandomDistribution() {
    const res = Math.random() < current
    if (res) current = C
    else current += C
    return res
  }
}

// 测试代码
var getRandomDistribution_25 = PseudoRandomDistribution(0.25)
var getRandomDistribution_50 = PseudoRandomDistribution(0.5)
var getRandomDistribution_75 = PseudoRandomDistribution(0.75)
var getRandomDistribution_90 = PseudoRandomDistribution(0.9)
var arr = Array(1e3).fill(0)
var arr_25 = arr.map(() => Number(getRandomDistribution_25()))
var arr_50 = arr.map(() => Number(getRandomDistribution_50()))
var arr_75 = arr.map(() => Number(getRandomDistribution_75()))
var arr_90 = arr.map(() => Number(getRandomDistribution_90()))
console.log(arr_25, arr_25.reduce((sum, curr) => sum + curr, 0))
console.log(arr_50, arr_50.reduce((sum, curr) => sum + curr, 0))
console.log(arr_75, arr_75.reduce((sum, curr) => sum + curr, 0))
console.log(arr_90, arr_90.reduce((sum, curr) => sum + curr, 0))
