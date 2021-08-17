/**
 * 以时间复杂度 O(n) 从长度为n的数组中找出所有比左边大比右边小的元素
 * 
 * 题目：以时间复杂度 O(n) 从长度为n的数组中找出同时满足以下两个条件的所有元素：
 * （1）该元素比放在它左边所有的元素都要大；
 * （2）该元素比放在它右边所有的元素都要小；
 * 
 * 解题思路：
 * （1）倒序遍历（从右往左），找到当前index右边所有元素中的最小值
 * （2）正序遍历（从左往右），判断当前元素是否为它左边所有元素的最大值，如果满足条件，在判断当前index右边的最小值比较，小于右边最小值，则元素符合条件。
 * 
 * sobird<i@sobird.me> at 2021/08/17 11:42:15 created.
 */

function getMidNum(nums) {
  let res = [];
  let len = nums.length;
  // nums[i]右边的最小值（包括nums[i]本身）
  let rMinArr = Array(len);
  // 记录nums[i]左边的最大值（包括nums[i]本身）
  let lMax = nums[0];
  // 记录下最后一个元素
  rMinArr[len - 1] = nums[len - 1];
  // 从倒数第二个数遍历
  for(let i = len - 2; i > 0; i--) {
    rMinArr[i] = nums[i] < rMinArr[i + 1] ? nums[i] : rMinArr[i + 1]; 
  }

  for(let i = 1; i < len - 1; i++) {
    if(nums[i] > lMax) {
      lMax = nums[i];

      if(nums[i] < rMinArr[i + 1]) {
        res.push(nums[i]);
      }
    }
  }
  return res;
}

// 单调栈
function getMidNum(nums) {
  let res = [];
  let maxn = -Infinity;

  for(let i = 0; i < nums.length; i++) {
    while(res.length !== 0 && res[res.length - 1] >= nums[i]) {
      res.pop();
    }

    if(nums[i] > maxn) {
      res.push(nums[i]);
    }

    maxn = Math.max(maxn, nums[i]);
  }
  return res;
}

let nums = [21, 11, 45, 56, 9, 66, 77, 89, 78, 68, 100, 120, 111]
let res = getMidNum(nums);
console.log(res);

/**
 * 单调栈：
 * 单调栈是一种特殊的栈，如果出栈的元素是单调增的，那就是单调递增栈，如果出栈的元素是单调减的，那就是单调递减栈。
 * 这里用 [a,b,c] 表示一个栈。 其中 左侧为栈底，右侧为栈顶。
 * [1,2,3,4] 就是一个单调递减栈
 * [3,2,1] 就是一个单调递增栈
 * [1,3,2] 就不是一个合法的单调栈
 * 
 * Next Greater Element
 */

function nextGreaterElement(nums) {
  let res = [];
  let tmp = [];

  for(let i = nums.length - 1; i >=0; i--) {
    console.log(tmp);

    while(tmp.length !== 0 && tmp[tmp.length - 1] <= nums[i]) {
      tmp.pop();
    }

    console.log(tmp);

    res[i] = tmp.length === 0 ? -1 : tmp[tmp.length - 1];
    tmp.push(nums[i]);
  }

  return res;
}

console.log('nextGreaterElement', nextGreaterElement([2,1,2,4,3]));
