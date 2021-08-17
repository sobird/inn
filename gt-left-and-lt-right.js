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

let nums = [21, 11, 45, 56, 9, 66, 77, 89, 78, 68, 100, 120, 111]
let res = getMidNum(nums);

console.log(res);
