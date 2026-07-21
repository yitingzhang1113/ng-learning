// ============================================================================
//  你的题单数据 —— 整张图完全由这里生成。
//
//  结构:严格对齐 labuladong 课程的路线(数组/链表两大分支),
//        题目就是课程里的题单,另外补了课程没有的三个 pattern:
//        区间 Intervals、位运算 Bitwise、模拟 Simulation(在「其他算法」里)。
//
//  三种节点:
//    milestone 里程碑(独立卡片,如 数组/链表/二叉树)
//    group     分组盒(如 数组操作/基础数据结构),里面装 topic 卡片
//    topic     具体板块卡片(必须写 group: '所属分组id')
//
//  ▸ 加题目 → 找到板块的 problems,用 p(英文名, 中文名, 难度, leetcode-slug) 加一行。
//  ▸ 加板块 → 复制一个 { kind:'topic', ... },写上 group 指向某个分组。
//  ▸ 难度用 'Easy' / 'Medium' / 'Hard';链接都是美国站 leetcode.com。
// ============================================================================

import { GUIDES } from './guides.js'

export const DIFF = {
  Easy: { zh: '简单', color: '#2bb3ad' },
  Medium: { zh: '中等', color: '#e6a23c' },
  Hard: { zh: '困难', color: '#ef4444' },
}
export const STATUS_DOT = { done: '#22a447', doing: '#e6a23c', none: '#d0d7de' }

// ── 柔和配色:每个大板块一个色系(bg 底色 / border 描边 / accent 强调色 / label 标题色)──
// 想换颜色改这里即可;节点上写 theme: 'blue' 这样引用。
export const THEMES = {
  blue: { bg: '#EDF5FF', border: '#C2DBF5', accent: '#6FA8DC', label: '#3D7AB5' },      // 淡蓝 · 数组
  sky: { bg: '#EBF7FB', border: '#C0E2EE', accent: '#63B8D6', label: '#3492B4' },       // 淡天青 · 双指针技巧
  mint: { bg: '#EAF8F0', border: '#BFE6D0', accent: '#5FBF8F', label: '#379767' },      // 薄荷绿 · 基础数据结构
  pink: { bg: '#FDF1F6', border: '#F3CDDF', accent: '#E48FB6', label: '#C4638F' },      // 淡粉 · 链表一族
  peach: { bg: '#FFF4EC', border: '#F6D6C0', accent: '#EFA173', label: '#D07A45' },     // 淡杏 · 二叉树与遍历
  lavender: { bg: '#F4F1FD', border: '#D9CFF2', accent: '#9D89D8', label: '#7660BE' },  // 淡紫 · 高级数据结构
  cream: { bg: '#FFFAE9', border: '#EFE1B4', accent: '#D9B44A', label: '#A98B2D' },     // 淡奶油 · 两种视角
  aqua: { bg: '#E9F8F7', border: '#BEE7E3', accent: '#54BDB4', label: '#2F968E' },      // 淡青绿 · BFS/最短路径
  sage: { bg: '#F2F7ED', border: '#D5E4C6', accent: '#93B873', label: '#6C9549' },      // 淡抹茶 · 其他算法
  gray: { bg: '#F6F7F9', border: '#DDE1E6', accent: '#9AA4B0', label: '#5B6570' },      // 浅灰 · 根节点
}

// hot: true(单星)或数字(几颗星,标注高频程度)
const p = (en, zh, diff, slug, hot) => ({
  en, zh, diff, url: `https://leetcode.com/problems/${slug}/`,
  ...(hot ? { hot } : {}),
})
// 会员题(🔒 需要 LeetCode 订阅才能看):lock(p(...))
const lock = (problem) => ({ ...problem, locked: true })

export const NODES = [
  // ───────── 根 ─────────
  { id: 'root', kind: 'milestone', theme: 'gray', zh: '数据结构与算法', en: 'Data Structures & Algorithms', problems: [] },

  // ═════════ 数组分支 ═════════
  {
    id: 'array', kind: 'milestone', theme: 'blue', zh: '数组', en: 'Array',
    // 不放题目,放基础教程(labuladong 数据结构精讲)。任何节点都可以这样加 tutorials。
    tutorials: [
      { zh: '本章导读', en: 'Chapter Intro', url: 'https://labuladong.online/zh/algo/intro/data-structure-basic/' },
      { zh: '时间空间复杂度入门', en: 'Time & Space Complexity Basics', url: 'https://labuladong.online/zh/algo/intro/complexity-basic/' },
      { zh: '数组(顺序存储)基本原理', en: 'Array (Sequential Storage) Basics', url: 'https://labuladong.online/zh/algo/data-structure-basic/array-basic/' },
      { zh: '动态数组代码实现', en: 'Dynamic Array Implementation', url: 'https://labuladong.online/zh/algo/data-structure-basic/array-implement/' },
    ],
    problems: [],
  },

  // 分组:数组操作
  { id: 'arrayops', kind: 'group', theme: 'blue', zh: '数组操作', en: 'Array Operations', cols: 1 },
  {
    id: 'prefixsum', kind: 'topic', group: 'arrayops', zh: '前缀和', en: 'Prefix Sum',
    // 教程链接 + Python 代码模板(每个板块都可以这样写 tutorials / templates)
    tutorials: [
      { zh: '小而美的算法技巧:前缀和数组', en: 'Prefix Sum Array', url: 'https://labuladong.online/zh/algo/data-structure/prefix-sum/' },
    ],
    templates: [
      {
        zh: '一维前缀和', en: '1D Prefix Sum',
        code: `class NumArray:
    # 前缀和数组
    def __init__(self, nums: List[int]):
        # 输入一个数组,构造前缀和
        # preSum[0] = 0,便于计算累加和
        self.preSum = [0] * (len(nums) + 1)
        # 计算 nums 的累加和
        for i in range(1, len(self.preSum)):
            self.preSum[i] = self.preSum[i - 1] + nums[i - 1]

    # 查询闭区间 [left, right] 的累加和
    def sumRange(self, left: int, right: int) -> int:
        return self.preSum[right + 1] - self.preSum[left]`,
      },
      {
        zh: '二维前缀和', en: '2D Prefix Sum',
        code: `class NumMatrix:
    # preSum[i][j] 记录矩阵 [0, 0, i-1, j-1] 的元素和
    def __init__(self, matrix: List[List[int]]):
        m = len(matrix)
        n = len(matrix[0])
        if m == 0 or n == 0:
            return
        # 构造前缀和矩阵
        self.preSum = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                # 计算每个矩阵 [0, 0, i, j] 的元素和
                self.preSum[i][j] = (self.preSum[i - 1][j] + self.preSum[i][j - 1] +
                                     matrix[i - 1][j - 1] - self.preSum[i - 1][j - 1])

    # 计算子矩阵 [x1, y1, x2, y2] 的元素和
    def sumRegion(self, x1: int, y1: int, x2: int, y2: int) -> int:
        # 目标矩阵之和由四个相邻矩阵运算获得
        return (self.preSum[x2 + 1][y2 + 1] - self.preSum[x1][y2 + 1] -
                self.preSum[x2 + 1][y1] + self.preSum[x1][y1])`,
      },
    ],
    problems: [
      p('Matrix Block Sum', '矩阵区域和', 'Medium', 'matrix-block-sum'),
      p('Find Pivot Index', '寻找数组的中心下标', 'Easy', 'find-pivot-index'),
      p('Product of Array Except Self', '除自身以外数组的乘积', 'Medium', 'product-of-array-except-self'),
      p('Product of the Last K Numbers', '最后 K 个数的乘积', 'Medium', 'product-of-the-last-k-numbers'),
      p('Contiguous Array', '连续数组', 'Medium', 'contiguous-array'),
      p('Continuous Subarray Sum', '连续的子数组和', 'Medium', 'continuous-subarray-sum'),
      p('Subarray Sum Equals K', '和为 K 的子数组', 'Medium', 'subarray-sum-equals-k'),
      p('Longest Well-Performing Interval', '表现良好的最长时间段', 'Medium', 'longest-well-performing-interval'),
    ],
  },
  {
    id: 'diffarray', kind: 'topic', group: 'arrayops', zh: '差分数组', en: 'Difference Array',
    problems: [
      p('Corporate Flight Bookings', '航班预订统计', 'Medium', 'corporate-flight-bookings'),
      p('Car Pooling', '拼车', 'Medium', 'car-pooling'),
    ],
  },
  {
    // 大厂高频,替换掉原来的「二维数组」板块。题目按套路分成 5 个小组,
    // 只在这个板块自己的窗口里当小标题展示,不额外占路线图节点。
    id: 'simulation', kind: 'topic', group: 'arrayops', zh: '数组模拟', en: 'Array Simulation',
    problemGroups: [
      { zh: '数值与进位模拟', en: 'Numeric & Carry Simulation', count: 5 },
      { zh: '矩阵边界与坐标模拟', en: 'Matrix Boundary & Coordinate Simulation', count: 4 },
      { zh: '方向与路径模拟', en: 'Direction & Path Simulation', count: 3 },
      { zh: '原地状态更新', en: 'In-place State Update', count: 2 },
      { zh: '复杂规则与格式化', en: 'Complex Rules & Formatting', count: 1 },
    ],
    problems: [
      // 1. 数值与进位模拟
      p('Add Strings', '字符串相加', 'Easy', 'add-strings', true),
      p('Add Binary', '二进制求和', 'Easy', 'add-binary', true),
      p('Plus One', '加一', 'Easy', 'plus-one'),
      p('Add to Array-Form of Integer', '数组形式的整数加法', 'Easy', 'add-to-array-form-of-integer'),
      p('Multiply Strings', '字符串相乘', 'Medium', 'multiply-strings'),
      // 2. 矩阵边界与坐标模拟
      p('Spiral Matrix', '螺旋矩阵', 'Medium', 'spiral-matrix', true),
      p('Spiral Matrix II', '螺旋矩阵 II', 'Medium', 'spiral-matrix-ii'),
      p('Rotate Image', '旋转图像', 'Medium', 'rotate-image', true),
      p('Diagonal Traverse', '对角线遍历', 'Medium', 'diagonal-traverse'),
      // 3. 方向与路径模拟
      p('Walking Robot Simulation', '模拟行走机器人', 'Medium', 'walking-robot-simulation'),
      p('Where Will the Ball Fall', '球会落何处', 'Medium', 'where-will-the-ball-fall'),
      p('Zigzag Conversion', 'Z 字形变换', 'Medium', 'zigzag-conversion'),
      // 4. 原地状态更新
      p('Set Matrix Zeroes', '矩阵置零', 'Medium', 'set-matrix-zeroes', true),
      p('Game of Life', '生命游戏', 'Medium', 'game-of-life', true),
      // 5. 复杂规则与格式化
      p('Text Justification', '文本左右对齐', 'Hard', 'text-justification', true),
    ],
  },

  // 分组:双指针技巧
  { id: 'twopointer', kind: 'group', theme: 'sky', zh: '双指针技巧', en: 'Two Pointers', cols: 1 },
  {
    // 题目按套路分成 2 个小组,只在这个板块自己的窗口里当小标题展示,不额外占路线图节点。
    // 详细笔记写在 tutorials 里的 Notion 链接,这个模块的题暂时不用逐题加笔记。
    id: 'arr2p', kind: 'topic', group: 'twopointer', zh: '双指针', en: 'Two Pointers',
    tutorials: [
      { zh: '双指针技巧笔记', en: 'Two Pointers Notes', url: 'https://app.notion.com/p/Two-Pointers-23a191764d5181a6b8f9f0d8998049dd?source=copy_link' },
    ],
    problemGroups: [
      { zh: '快慢指针', en: 'Fast & Slow Pointers', count: 7 },
      { zh: '左右指针', en: 'Left & Right Pointers', count: 10 },
    ],
    problems: [
      // 1. 快慢指针
      p('Remove Duplicates from Sorted Array', '删除有序数组中的重复项', 'Easy', 'remove-duplicates-from-sorted-array'),
      p('Remove Element', '移除元素', 'Easy', 'remove-element'),
      p('Remove Duplicates from Sorted Array II', '删除有序数组中的重复项 II', 'Medium', 'remove-duplicates-from-sorted-array-ii'),
      p('Remove Duplicates from Sorted List', '删除排序链表中的重复元素', 'Easy', 'remove-duplicates-from-sorted-list'),
      p('Move Zeroes', '移动零', 'Easy', 'move-zeroes'),
      p('Merge Strings Alternately', '交替合并字符串', 'Easy', 'merge-strings-alternately'),
      p('Merge Sorted Array', '合并两个有序数组', 'Easy', 'merge-sorted-array'),
      // 2. 左右指针
      p('Two Sum II - Input Array Is Sorted', '两数之和 II - 输入有序数组', 'Medium', 'two-sum-ii-input-array-is-sorted'),
      p('3Sum', '三数之和', 'Medium', '3sum'),
      p('4Sum', '四数之和', 'Medium', '4sum'),
      p('Reverse String', '反转字符串', 'Easy', 'reverse-string'),
      p('Valid Palindrome', '验证回文串', 'Easy', 'valid-palindrome'),
      p('Valid Palindrome II', '验证回文串 II', 'Easy', 'valid-palindrome-ii'),
      p('Rotate Array', '轮转数组', 'Medium', 'rotate-array'),
      p('Container With Most Water', '盛最多水的容器', 'Medium', 'container-with-most-water'),
      p('Boats to Save People', '救生艇', 'Medium', 'boats-to-save-people'),
      p('Trapping Rain Water', '接雨水', 'Hard', 'trapping-rain-water'),
    ],
  },
  {
    // 题目按套路分成 4 个小组,只在这个板块自己的窗口里当小标题展示,不额外占路线图节点。
    id: 'sliding', kind: 'topic', group: 'twopointer', zh: '滑动窗口', en: 'Sliding Window',
    problemGroups: [
      { zh: '定长窗口', en: 'Fixed-size Window', count: 3 },
      { zh: '最长合法窗口', en: 'Longest Valid Window', count: 4 },
      { zh: '最短合法窗口', en: 'Minimum Valid Window', count: 2 },
      { zh: '计数与增强窗口', en: 'Counting & Advanced', count: 4 },
    ],
    problems: [
      // 1. 定长窗口
      p('Contains Duplicate II', '存在重复元素 II', 'Easy', 'contains-duplicate-ii'),
      p('Find All Anagrams in a String', '找到字符串中所有字母异位词', 'Medium', 'find-all-anagrams-in-a-string', true),
      p('Permutation in String', '字符串的排列', 'Medium', 'permutation-in-string', true),
      // 2. 最长合法窗口
      p('Longest Substring Without Repeating Characters', '无重复字符的最长子串', 'Medium', 'longest-substring-without-repeating-characters', true),
      p('Longest Repeating Character Replacement', '替换后的最长重复字符', 'Medium', 'longest-repeating-character-replacement', true),
      p('Fruit Into Baskets', '水果成篮', 'Medium', 'fruit-into-baskets', true),
      p('Max Consecutive Ones III', '最大连续 1 的个数 III', 'Medium', 'max-consecutive-ones-iii', true),
      // 3. 最短合法窗口
      p('Minimum Size Subarray Sum', '长度最小的子数组', 'Medium', 'minimum-size-subarray-sum', true),
      p('Minimum Window Substring', '最小覆盖子串', 'Hard', 'minimum-window-substring', true),
      // 4. 计数与增强窗口
      p('Subarray Product Less Than K', '乘积小于 K 的子数组', 'Medium', 'subarray-product-less-than-k'),
      p('Sliding Window Maximum', '滑动窗口最大值', 'Hard', 'sliding-window-maximum', true),
      p('Best Time to Buy and Sell Stock', '买卖股票的最佳时机', 'Easy', 'best-time-to-buy-and-sell-stock'),
      p('Find K Closest Elements', '找到 K 个最接近的元素', 'Medium', 'find-k-closest-elements'),
    ],
  },
  {
    // 题目按套路分成 4 个小组,只在这个板块自己的窗口里当小标题展示,不额外占路线图节点。
    id: 'binsearch', kind: 'topic', group: 'twopointer', zh: '二分搜索', en: 'Binary Search',
    problemGroups: [
      { zh: '基础查找与边界', en: 'Basic Search & Boundaries', count: 4 },
      { zh: '特殊有序数组', en: 'Special Sorted Arrays', count: 6 },
      { zh: '二分答案', en: 'Binary Search on Answer', count: 5 },
      { zh: '第 K 小与高级二分', en: 'Kth Smallest & Advanced', count: 2 },
    ],
    problems: [
      // 1. 基础查找与边界
      p('Binary Search', '二分查找', 'Easy', 'binary-search', 3),
      p('Search Insert Position', '搜索插入位置', 'Easy', 'search-insert-position', 3),
      p('Find First and Last Position of Element in Sorted Array', '在排序数组中查找元素的第一个和最后一个位置', 'Medium', 'find-first-and-last-position-of-element-in-sorted-array', 3),
      p('Sqrt(x)', 'x 的平方根', 'Easy', 'sqrtx', 2),
      // 2. 特殊有序数组
      p('Search a 2D Matrix', '搜索二维矩阵', 'Medium', 'search-a-2d-matrix', 3),
      p('Search in Rotated Sorted Array', '搜索旋转排序数组', 'Medium', 'search-in-rotated-sorted-array', 3),
      p('Find Minimum in Rotated Sorted Array', '寻找旋转排序数组中的最小值', 'Medium', 'find-minimum-in-rotated-sorted-array', 3),
      p('Search in Rotated Sorted Array II', '搜索旋转排序数组 II', 'Medium', 'search-in-rotated-sorted-array-ii', 2),
      p('Time Based Key Value Store', '基于时间的键值存储', 'Medium', 'time-based-key-value-store', 3),
      p('Find in Mountain Array', '山脉数组中查找目标值', 'Hard', 'find-in-mountain-array', 2),
      // 3. 二分答案 Binary Search on Answer
      p('Koko Eating Bananas', '爱吃香蕉的珂珂', 'Medium', 'koko-eating-bananas', 3),
      p('Capacity To Ship Packages Within D Days', '在 D 天内送达包裹的能力', 'Medium', 'capacity-to-ship-packages-within-d-days', 3),
      p('Minimum Number of Days to Make m Bouquets', '制作 m 束花所需的最少天数', 'Medium', 'minimum-number-of-days-to-make-m-bouquets', 2),
      p('Split Array Largest Sum', '分割数组的最大值', 'Hard', 'split-array-largest-sum', 3),
      p('Maximum Running Time of N Computers', '同时运行 N 台电脑的最长时间', 'Medium', 'maximum-running-time-of-n-computers', 2),
      // 4. 第 K 小与高级二分
      p('Kth Smallest Element in a Sorted Matrix', '有序矩阵中第 K 小的元素', 'Medium', 'kth-smallest-element-in-a-sorted-matrix', 2),
      p('Median of Two Sorted Arrays', '寻找两个正序数组的中位数', 'Hard', 'median-of-two-sorted-arrays', 3),
    ],
  },
  {
    id: 'random', kind: 'topic', group: 'twopointer', zh: '随机算法', en: 'Randomized',
    problems: [
      p('Random Pick with Weight', '按权重随机选择', 'Medium', 'random-pick-with-weight'),
      p('Shuffle an Array', '打乱数组', 'Medium', 'shuffle-an-array'),
    ],
  },

  // 分组:数组题型与策略(区间/模拟/贪心 从「其他算法」迁移而来 + 新增 排序与选择)
  { id: 'arraypatterns', kind: 'group', theme: 'blue', zh: '数组题型与策略', en: 'Array Patterns & Strategies', cols: 2 },
  {
    id: 'sortselect', kind: 'topic', group: 'arraypatterns', zh: '排序与选择', en: 'Sorting & Selection',
    problems: [
      p('Sort List', '排序链表', 'Medium', 'sort-list'),
      p('Sort Array By Parity', '按奇偶排序数组', 'Easy', 'sort-array-by-parity'),
      p('Largest Number', '最大数', 'Medium', 'largest-number'),
      p('H-Index', 'H 指数', 'Medium', 'h-index'),
      p('Wiggle Sort II', '摆动排序 II', 'Medium', 'wiggle-sort-ii'),
      p('Array Partition', '数组拆分', 'Easy', 'array-partition'),
    ],
  },
  {
    id: 'interval', kind: 'topic', group: 'arraypatterns', zh: '区间问题', en: 'Intervals',
    problems: [
      p('Insert Interval', '插入区间', 'Medium', 'insert-interval'),
      p('Interval List Intersections', '区间列表的交集', 'Medium', 'interval-list-intersections'),
      p('Remove Covered Intervals', '删除被覆盖区间', 'Medium', 'remove-covered-intervals'),
      p('Minimum Number of Arrows to Burst Balloons', '用最少数量的箭引爆气球', 'Medium', 'minimum-number-of-arrows-to-burst-balloons'),
      p('Video Stitching', '视频拼接', 'Medium', 'video-stitching'),
      p('Employee Free Time', '员工空闲时间', 'Hard', 'employee-free-time'),
    ],
  },
  {
    id: 'greedy', kind: 'topic', group: 'arraypatterns', zh: '贪心策略', en: 'Greedy',
    problems: [
      p('Jump Game', '跳跃游戏', 'Medium', 'jump-game'),
      p('Jump Game II', '跳跃游戏 II', 'Medium', 'jump-game-ii'),
      p('Gas Station', '加油站', 'Medium', 'gas-station'),
      p('Non-overlapping Intervals', '无重叠区间', 'Medium', 'non-overlapping-intervals'),
      p('Merge Intervals', '合并区间', 'Medium', 'merge-intervals'),
      p('Meeting Rooms II', '会议室 II', 'Medium', 'meeting-rooms-ii'),
    ],
  },

  // 分组:基础数据结构
  { id: 'basicds', kind: 'group', theme: 'mint', zh: '基础数据结构', en: 'Basic Data Structures', cols: 2 },
  {
    id: 'circulararray', kind: 'topic', group: 'basicds', zh: '循环数组', en: 'Circular Array',
    problems: [
      p('Design Circular Deque', '设计循环双端队列', 'Medium', 'design-circular-deque'),
      p('Design Circular Queue', '设计循环队列', 'Medium', 'design-circular-queue'),
    ],
  },
  {
    id: 'stackqueue', kind: 'topic', group: 'basicds', zh: '栈与队列', en: 'Stack & Queue',
    problems: [
      p('Simplify Path', '简化路径', 'Medium', 'simplify-path'),
      p('Valid Parentheses', '有效的括号', 'Easy', 'valid-parentheses'),
      p('Evaluate Reverse Polish Notation', '逆波兰表达式求值', 'Medium', 'evaluate-reverse-polish-notation'),
      p('Decode String', '字符串解码', 'Medium', 'decode-string'),
      p('Min Stack', '最小栈', 'Medium', 'min-stack'),
      p('Number of Recent Calls', '最近的请求次数', 'Easy', 'number-of-recent-calls'),
      p('Time Needed to Buy Tickets', '买票需要的时间', 'Easy', 'time-needed-to-buy-tickets'),
      p('Online Stock Span', '股票价格跨度(单调栈)', 'Medium', 'online-stock-span'),
      p('Remove K Digits', '移掉 K 位数字(单调栈)', 'Medium', 'remove-k-digits'),
      p('Car Fleet', '车队(单调栈)', 'Medium', 'car-fleet'),
      p('Largest Rectangle in Histogram', '柱状图中最大的矩形(单调栈)', 'Hard', 'largest-rectangle-in-histogram'),
    ],
  },
  {
    id: 'hash', kind: 'topic', group: 'basicds', zh: '哈希', en: 'Hash Table',
    problems: [
      p('Two Sum', '两数之和', 'Easy', 'two-sum'),
      p('Longest Consecutive Sequence', '最长连续序列', 'Medium', 'longest-consecutive-sequence'),
      p('Word Pattern', '单词规律', 'Easy', 'word-pattern'),
      p('Copy List with Random Pointer', '随机链表的复制', 'Medium', 'copy-list-with-random-pointer'),
      p('Valid Anagram', '有效的字母异位词', 'Easy', 'valid-anagram'),
      p('Group Anagrams', '字母异位词分组', 'Medium', 'group-anagrams'),
      p('First Unique Character in a String', '字符串中的第一个唯一字符', 'Easy', 'first-unique-character-in-a-string'),
      p('Majority Element', '多数元素', 'Easy', 'majority-element'),
    ],
  },
  {
    id: 'design', kind: 'topic', group: 'basicds', zh: '设计 · OOD', en: 'Design · OOD',
    problems: [
      p('LRU Cache', 'LRU 缓存', 'Medium', 'lru-cache'),
      p('My Calendar I', '我的日程安排表 I', 'Medium', 'my-calendar-i'),
      p('Reveal Cards In Increasing Order', '按递增顺序显示卡牌', 'Medium', 'reveal-cards-in-increasing-order'),
      p('Number of Students Unable to Eat Lunch', '无法吃午餐的学生数量', 'Easy', 'number-of-students-unable-to-eat-lunch'),
      p('Insert Delete GetRandom O(1)', 'O(1) 时间插入、删除和获取随机元素', 'Medium', 'insert-delete-getrandom-o1'),
      p('Time Based Key-Value Store', '基于时间的键值存储', 'Medium', 'time-based-key-value-store'),
      p('LFU Cache', 'LFU 缓存', 'Hard', 'lfu-cache'),
      p('Max Stack', '最大栈', 'Hard', 'max-stack'),
    ],
    // 💡 停车场 / 电梯这类没有 LeetCode 链接的经典 OOD,写在卡片的「笔记」里。
  },

  // ═════════ 链表分支 ═════════
  {
    // 题目按套路分成 4 个小组,只在这个板块自己的窗口里当小标题展示,不额外占路线图节点。
    // Reverse Linked List / Reverse Nodes in K-Group 在「递归」板块也有(反转技巧本来就是递归的经典例子);
    // Copy List with Random Pointer 在「哈希」板块也有(拷贝技巧用到了哈希表)—— 两边都保留,方便各自打卡。
    id: 'linkedlist', kind: 'milestone', theme: 'pink', zh: '链表', en: 'Linked List',
    problemGroups: [
      { zh: '链表反转与区间操作', en: 'Reversal & Range Operations', count: 3 },
      { zh: '链表合并', en: 'Merging', count: 2 },
      { zh: '链表删除与重排', en: 'Deletion & Reordering', count: 2 },
      { zh: '特殊链表与深拷贝', en: 'Special Lists & Deep Copy', count: 1 },
    ],
    problems: [
      // 1. 链表反转与区间操作
      p('Reverse Linked List', '反转链表', 'Easy', 'reverse-linked-list', 3),
      p('Reverse Linked List II', '反转链表 II', 'Medium', 'reverse-linked-list-ii', 3),
      p('Reverse Nodes in K-Group', 'K 个一组翻转链表', 'Hard', 'reverse-nodes-in-k-group', 3),
      // 2. 链表合并
      p('Merge Two Sorted Lists', '合并两个有序链表', 'Easy', 'merge-two-sorted-lists', 3),
      p('Merge K Sorted Lists', '合并 K 个升序链表', 'Hard', 'merge-k-sorted-lists', 3),
      // 3. 链表删除与重排
      p('Reorder List', '重排链表', 'Medium', 'reorder-list', 3),
      p('Remove Nth Node From End of List', '删除链表的倒数第 N 个结点', 'Medium', 'remove-nth-node-from-end-of-list', 3),
      // 4. 特殊链表与深拷贝
      p('Copy List with Random Pointer', '随机链表的复制', 'Medium', 'copy-list-with-random-pointer', 3),
    ],
  },
  {
    id: 'lltwopointer', kind: 'milestone', theme: 'pink', zh: '链表双指针', en: 'Linked List Two Pointers',
    problems: [
      p('Merge Two Sorted Lists', '合并两个有序链表', 'Easy', 'merge-two-sorted-lists'),
      p('Partition List', '分隔链表', 'Medium', 'partition-list'),
      p('Merge K Sorted Lists', '合并 K 个升序链表', 'Hard', 'merge-k-sorted-lists'),
      p('Remove Nth Node From End of List', '删除链表的倒数第 N 个结点', 'Medium', 'remove-nth-node-from-end-of-list'),
      p('Middle of the Linked List', '链表的中间结点', 'Easy', 'middle-of-the-linked-list'),
      p('Linked List Cycle II', '环形链表 II', 'Medium', 'linked-list-cycle-ii'),
      p('Intersection of Two Linked Lists', '相交链表', 'Easy', 'intersection-of-two-linked-lists'),
      p('Linked List Cycle', '环形链表', 'Easy', 'linked-list-cycle'),
    ],
  },
  {
    // 单链表递归是进阶技巧:面试时可以展示递归思路,但笔试时用标准的指针操作即可。
    id: 'recursion', kind: 'milestone', theme: 'pink', zh: '递归', en: 'Recursion',
    tutorials: [
      { zh: '递归专题', en: 'Recursion I', url: 'https://leetcode.com/explore/learn/card/recursion-i/' },
      { zh: '单链表的花式反转方法汇总', en: 'Fancy Ways to Reverse a Singly Linked List', url: 'https://labuladong.online/zh/algo/data-structure/reverse-linked-list-recursion/' },
      { zh: '如何判断回文链表', en: 'How to Check a Palindrome Linked List', url: 'https://labuladong.online/zh/algo/data-structure/palindrome-linked-list/' },
    ],
    problemGroups: [
      { zh: '单链表递归', en: 'Singly Linked List Recursion', count: 4 },
      { zh: '其他递归', en: 'Other Recursion', count: 8 },
    ],
    problems: [
      // 1. 单链表递归
      p('Reverse Linked List', '反转链表', 'Easy', 'reverse-linked-list', 3),
      p('Swap Nodes in Pairs', '两两交换链表中的节点', 'Medium', 'swap-nodes-in-pairs', 3),
      p('Reverse Nodes in k-Group', 'K 个一组翻转链表', 'Hard', 'reverse-nodes-in-k-group', 3),
      p('Palindrome Linked List', '回文链表', 'Easy', 'palindrome-linked-list', 3),
      // 2. 其他递归
      p('Reverse String', '反转字符串', 'Easy', 'reverse-string', 1),
      p('Fibonacci Number', '斐波那契数', 'Easy', 'fibonacci-number', 1),
      p("Pascal's Triangle II", '杨辉三角 II', 'Easy', 'pascals-triangle-ii', 1),
      p('Pow(x, n)', 'Pow(x, n)', 'Medium', 'powx-n', 3),
      p('Climbing Stairs', '爬楼梯', 'Easy', 'climbing-stairs', 3),
      p('Maximum Depth of Binary Tree', '二叉树的最大深度', 'Easy', 'maximum-depth-of-binary-tree', 3),
      p('Unique Binary Search Trees II', '不同的二叉搜索树 II', 'Medium', 'unique-binary-search-trees-ii', 2),
      p('K-th Symbol in Grammar', '第 K 个语法符号', 'Medium', 'k-th-symbol-in-grammar', 2),
    ],
  },
  {
    id: 'binarytree', kind: 'milestone', theme: 'peach', zh: '二叉树', en: 'Binary Tree',
    problems: [
      p('Binary Tree Preorder Traversal', '二叉树的前序遍历', 'Easy', 'binary-tree-preorder-traversal'),
      p('Binary Tree Inorder Traversal', '二叉树的中序遍历', 'Easy', 'binary-tree-inorder-traversal'),
      p('Binary Tree Postorder Traversal', '二叉树的后序遍历', 'Easy', 'binary-tree-postorder-traversal'),
      p('Binary Tree Level Order Traversal', '二叉树的层序遍历', 'Medium', 'binary-tree-level-order-traversal'),
      p('Maximum Depth of Binary Tree', '二叉树的最大深度', 'Easy', 'maximum-depth-of-binary-tree'),
      p('Minimum Depth of Binary Tree', '二叉树的最小深度', 'Easy', 'minimum-depth-of-binary-tree'),
    ],
  },

  // 分组:高级数据结构
  { id: 'advds', kind: 'group', theme: 'lavender', zh: '高级数据结构', en: 'Advanced Data Structures', cols: 2 },
  {
    id: 'bst', kind: 'topic', group: 'advds', zh: '二叉搜索树', en: 'BST',
    problems: [
      p('Search in a Binary Search Tree', '二叉搜索树中的搜索', 'Easy', 'search-in-a-binary-search-tree'),
      p('Insert into a Binary Search Tree', '二叉搜索树中的插入操作', 'Medium', 'insert-into-a-binary-search-tree'),
      p('Delete Node in a BST', '删除二叉搜索树中的节点', 'Medium', 'delete-node-in-a-bst'),
      p('Validate Binary Search Tree', '验证二叉搜索树', 'Medium', 'validate-binary-search-tree'),
      p('Kth Smallest Element in a BST', '二叉搜索树中第 K 小的元素', 'Medium', 'kth-smallest-element-in-a-bst'),
      p('Convert BST to Greater Tree', '把二叉搜索树转换为累加树', 'Medium', 'convert-bst-to-greater-tree'),
      p('Binary Search Tree to Greater Sum Tree', '从二叉搜索树到更大和树', 'Medium', 'binary-search-tree-to-greater-sum-tree'),
      p('Unique Binary Search Trees', '不同的二叉搜索树', 'Medium', 'unique-binary-search-trees'),
      p('Unique Binary Search Trees II', '不同的二叉搜索树 II', 'Medium', 'unique-binary-search-trees-ii'),
    ],
  },
  {
    id: 'heap', kind: 'topic', group: 'advds', zh: '堆', en: 'Heap',
    problems: [
      p('Merge k Sorted Lists', '合并 K 个升序链表', 'Hard', 'merge-k-sorted-lists'),
      p('Kth Smallest Element in a Sorted Matrix', '有序矩阵中第 K 小的元素', 'Medium', 'kth-smallest-element-in-a-sorted-matrix'),
      p('Design Twitter', '设计推特', 'Medium', 'design-twitter'),
      p('Kth Largest Element in an Array', '数组中的第 K 个最大元素', 'Medium', 'kth-largest-element-in-an-array'),
      p('Kth Largest Element in a Stream', '数据流中的第 K 大元素', 'Easy', 'kth-largest-element-in-a-stream'),
      p('Top K Frequent Elements', '前 K 个高频元素', 'Medium', 'top-k-frequent-elements'),
      p('Find Median from Data Stream', '数据流的中位数(双堆)', 'Hard', 'find-median-from-data-stream'),
      p('Sliding Window Median', '滑动窗口中位数(双堆)', 'Hard', 'sliding-window-median'),
      p('IPO', 'IPO(双堆)', 'Hard', 'ipo'),
    ],
  },
  {
    id: 'trie', kind: 'topic', group: 'advds', zh: '字典树', en: 'Trie',
    problems: [
      p('Implement Trie (Prefix Tree)', '实现 Trie(前缀树)', 'Medium', 'implement-trie-prefix-tree'),
      p('Implement Trie II (Prefix Tree)', '实现前缀树 II', 'Medium', 'implement-trie-ii-prefix-tree'),
    ],
  },
  {
    // 题目按套路分成 5 个小组,只在这个板块自己的窗口里当小标题展示,不额外占路线图节点。
    // 有几道题(冗余连接 / 图有效树 / 连通分量数目)既是环检测的经典例子,也是并查集的经典例子,
    // 按你给的大纲在两个小组里都保留了一份,方便从两个角度分别打卡/记笔记。
    id: 'graph', kind: 'topic', group: 'advds', zh: '图', en: 'Graph',
    problemGroups: [
      { zh: '图的建模、入度与出度', en: 'Modeling, In-degree & Out-degree', count: 2 },
      { zh: '拓扑排序与依赖关系', en: 'Topological Sort & Dependencies', count: 4 },
      { zh: '连通性、环与判树', en: 'Connectivity, Cycles & Tree Check', count: 3 },
      { zh: '并查集', en: 'Union-Find', count: 4 },
      { zh: '最小生成树', en: 'Minimum Spanning Tree', count: 2 },
    ],
    problems: [
      // 1. 图的建模、入度与出度
      p('Find the Town Judge', '找到小镇的法官', 'Easy', 'find-the-town-judge', 2),
      p('Verifying an Alien Dictionary', '验证外星语词典', 'Easy', 'verifying-an-alien-dictionary', 1),
      // 2. 拓扑排序与依赖关系
      p('Course Schedule', '课程表(环检测)', 'Medium', 'course-schedule', 3),
      p('Course Schedule II', '课程表 II(拓扑排序)', 'Medium', 'course-schedule-ii', 3),
      p('Course Schedule IV', '课程表 IV', 'Medium', 'course-schedule-iv', 2),
      p('Minimum Height Trees', '最小高度树', 'Medium', 'minimum-height-trees', 2),
      // 3. 连通性、环与判树
      lock(p('Graph Valid Tree', '图有效树', 'Medium', 'graph-valid-tree', 3)),
      lock(p('Number of Connected Components in an Undirected Graph', '无向图中连通分量的数目', 'Medium', 'number-of-connected-components-in-an-undirected-graph', 3)),
      p('Redundant Connection', '冗余连接', 'Medium', 'redundant-connection', 3),
      // 4. 并查集 Union-Find
      p('Redundant Connection', '冗余连接', 'Medium', 'redundant-connection', 3),
      p('Accounts Merge', '账户合并', 'Medium', 'accounts-merge', 3),
      lock(p('Number of Connected Components in an Undirected Graph', '无向图中连通分量的数目', 'Medium', 'number-of-connected-components-in-an-undirected-graph', 3)),
      lock(p('Graph Valid Tree', '图有效树', 'Medium', 'graph-valid-tree', 3)),
      // 5. 最小生成树 Minimum Spanning Tree
      lock(p('Connecting Cities With Minimum Cost', '最低成本联通所有城市', 'Medium', 'connecting-cities-with-minimum-cost', 3)),
      p('Min Cost to Connect All Points', '连接所有点的最小费用', 'Medium', 'min-cost-to-connect-all-points', 3),
    ],
  },

  // 二叉树 → 两种遍历
  {
    // 深刻理解「遍历」和「分解问题」两种递归思维模式,将代码准确地写到前中后序位置,是写对递归算法的关键。
    // 「遍历」是 DFS/回溯算法的原型,「分解问题」是动态规划/分治算法的原型。
    id: 'recursivetraversal', kind: 'milestone', theme: 'peach', zh: '递归遍历', en: 'Recursive Traversal',
    tutorials: [
      { zh: '二叉树心法(思路篇)', en: 'Binary Tree in Action (Traversal)', url: 'https://labuladong.online/zh/algo/data-structure/binary-tree-part1/' },
      { zh: '二叉树心法(构造篇)', en: 'Binary Tree in Action (Construction)', url: 'https://labuladong.online/zh/algo/data-structure/binary-tree-part2/' },
      { zh: '二叉树心法(序列化篇)', en: 'Binary Tree in Action (Serialization)', url: 'https://labuladong.online/zh/algo/data-structure/serialize-and-deserialize-binary-tree/' },
      { zh: '拓展:最近公共祖先系列解题框架', en: 'Lowest Common Ancestor All in One', url: 'https://labuladong.online/zh/algo/practice-in-action/lowest-common-ancestor-summary/' },
      { zh: '一个视角 + 两种思维模式搞定递归', en: 'One Perspective + Two Thinking Modes for Recursion', url: 'https://labuladong.online/zh/algo/essential-technique/understand-recursion/' },
    ],
    problemGroups: [
      { zh: '运用「遍历」思维解题', en: 'Solve with "Traversal" Thinking', count: 4 },
      { zh: '运用「分解问题」思维解题', en: 'Solve with "Decompose Problem" Thinking', count: 2 },
    ],
    problems: [
      // 1. 运用「遍历」思维解题
      p('Binary Tree Paths', '二叉树的所有路径(遍历)', 'Easy', 'binary-tree-paths'),
      p('Sum Root to Leaf Numbers', '求根节点到叶节点数字之和(遍历)', 'Medium', 'sum-root-to-leaf-numbers'),
      p('Binary Tree Right Side View', '二叉树的右视图(遍历)', 'Medium', 'binary-tree-right-side-view'),
      p('Sum of Root To Leaf Binary Numbers', '从根到叶的二进制数之和(遍历)', 'Easy', 'sum-of-root-to-leaf-binary-numbers'),
      // 2. 运用「分解问题」思维解题
      p('Construct Binary Tree from Preorder and Inorder Traversal', '从前序与中序遍历构造二叉树(分解)', 'Medium', 'construct-binary-tree-from-preorder-and-inorder-traversal'),
      p('Construct Binary Tree from Inorder and Postorder Traversal', '从中序与后序遍历构造二叉树(分解)', 'Medium', 'construct-binary-tree-from-inorder-and-postorder-traversal'),
    ],
  },
  {
    id: 'levelorder', kind: 'milestone', theme: 'peach', zh: '层序遍历', en: 'Level Order Traversal',
    problems: [
      p('Binary Tree Zigzag Level Order Traversal', '二叉树的锯齿形层序遍历', 'Medium', 'binary-tree-zigzag-level-order-traversal'),
      p('Binary Tree Level Order Traversal II', '二叉树的层序遍历 II', 'Medium', 'binary-tree-level-order-traversal-ii'),
      p('Average of Levels in Binary Tree', '二叉树的层平均值', 'Easy', 'average-of-levels-in-binary-tree'),
      p('Find Largest Value in Each Tree Row', '在每个树行中找最大值', 'Medium', 'find-largest-value-in-each-tree-row'),
    ],
  },

  // 分组:遍历视角
  { id: 'traversalview', kind: 'group', theme: 'cream', zh: '遍历视角', en: 'Traverse View', cols: 1 },
  {
    id: 'backtrack', kind: 'topic', group: 'traversalview', zh: '回溯算法', en: 'Backtracking',
    problems: [
      p('Subsets', '子集', 'Medium', 'subsets'),
      p('Permutations', '全排列', 'Medium', 'permutations'),
      p('Combinations', '组合', 'Medium', 'combinations'),
      p('Combination Sum', '组合总和', 'Medium', 'combination-sum'),
      p('Generate Parentheses', '括号生成', 'Medium', 'generate-parentheses'),
      p('Non-decreasing Subsequences', '非递减子序列', 'Medium', 'non-decreasing-subsequences'),
      p('Unique Paths III', '不同路径 III', 'Hard', 'unique-paths-iii'),
      p('Palindrome Partitioning', '分割回文串', 'Medium', 'palindrome-partitioning'),
      p('Restore IP Addresses', '复原 IP 地址', 'Medium', 'restore-ip-addresses'),
      p('Letter Combinations of a Phone Number', '电话号码的字母组合', 'Medium', 'letter-combinations-of-a-phone-number'),
      p('Word Search', '单词搜索', 'Medium', 'word-search'),
    ],
  },
  {
    // 题目按套路分成 2 个小组,只在这个板块自己的窗口里当小标题展示,不额外占路线图节点。
    id: 'dfs', kind: 'topic', group: 'traversalview', zh: '深度优先搜索', en: 'DFS',
    problemGroups: [
      { zh: '网格 DFS:岛屿、边界与连通区域', en: 'Grid DFS: Islands, Borders & Connected Regions', count: 9 },
      { zh: '图 DFS:遍历、复制与路径搜索', en: 'Graph DFS: Traversal, Cloning & Path Search', count: 2 },
    ],
    problems: [
      // 1. 网格 DFS
      p('Number of Islands', '岛屿数量', 'Medium', 'number-of-islands', 3),
      p('Max Area of Island', '岛屿的最大面积', 'Medium', 'max-area-of-island', 3),
      p('Island Perimeter', '岛屿的周长', 'Easy', 'island-perimeter', 2),
      p('Surrounded Regions', '被围绕的区域', 'Medium', 'surrounded-regions', 3),
      p('Pacific Atlantic Water Flow', '太平洋大西洋水流问题', 'Medium', 'pacific-atlantic-water-flow', 3),
      p('Number of Closed Islands', '统计封闭岛屿的数目', 'Medium', 'number-of-closed-islands', 2),
      p('Number of Enclaves', '飞地的数量', 'Medium', 'number-of-enclaves', 2),
      p('Count Sub Islands', '统计子岛屿', 'Medium', 'count-sub-islands', 2),
      lock(p('Number of Distinct Islands', '不同岛屿的数量', 'Medium', 'number-of-distinct-islands', 2)),
      // 2. 图 DFS
      p('Clone Graph', '克隆图', 'Medium', 'clone-graph', 3),
      p('Evaluate Division', '除法求值', 'Medium', 'evaluate-division', 3),
    ],
  },

  // 分组:子问题视角
  { id: 'subproblem', kind: 'group', theme: 'cream', zh: '子问题视角', en: 'Subproblem View', cols: 1 },
  {
    id: 'divide', kind: 'topic', group: 'subproblem', zh: '分治算法', en: 'Divide & Conquer',
    problems: [
      p('Different Ways to Add Parentheses', '为运算表达式设计优先级', 'Medium', 'different-ways-to-add-parentheses'),
      p('Sort an Array', '排序数组(归并/快排)', 'Medium', 'sort-an-array'),
      p('Count of Smaller Numbers After Self', '计算右侧小于当前元素的个数', 'Hard', 'count-of-smaller-numbers-after-self'),
    ],
  },
  {
    id: 'dp', kind: 'topic', group: 'subproblem', zh: '动态规划', en: 'Dynamic Programming',
    problems: [
      p('Coin Change', '零钱兑换', 'Medium', 'coin-change'),
      p('Longest Increasing Subsequence', '最长递增子序列', 'Medium', 'longest-increasing-subsequence'),
      p('Climbing Stairs', '爬楼梯', 'Easy', 'climbing-stairs'),
      p('Coin Change II', '零钱兑换 II', 'Medium', 'coin-change-ii'),
      p('Word Break', '单词拆分', 'Medium', 'word-break'),
      p('House Robber', '打家劫舍', 'Medium', 'house-robber'),
      p('House Robber II', '打家劫舍 II', 'Medium', 'house-robber-ii'),
      p('House Robber III', '打家劫舍 III', 'Medium', 'house-robber-iii'),
      p('Edit Distance', '编辑距离', 'Medium', 'edit-distance'),
      p('Maximum Subarray', '最大子数组和', 'Medium', 'maximum-subarray'),
      p('Longest Common Subsequence', '最长公共子序列', 'Medium', 'longest-common-subsequence'),
      p('Unique Paths', '不同路径', 'Medium', 'unique-paths'),
      p('Minimum Path Sum', '最小路径和', 'Medium', 'minimum-path-sum'),
      p('Longest Valid Parentheses', '最长有效括号', 'Hard', 'longest-valid-parentheses'),
      p('Best Time to Buy and Sell Stock', '买卖股票的最佳时机', 'Easy', 'best-time-to-buy-and-sell-stock'),
    ],
  },

  // 层序遍历 → BFS → 最短路径
  {
    // 题目按套路分成 2 个小组,只在这个板块自己的窗口里当小标题展示,不额外占路线图节点。
    id: 'bfs', kind: 'milestone', theme: 'aqua', zh: '广度优先搜索', en: 'BFS',
    problemGroups: [
      { zh: '单源 BFS:分层遍历与无权最短路', en: 'Single-source BFS: Layered Traversal & Unweighted Shortest Path', count: 6 },
      { zh: '多源 BFS:同步扩散与最近距离', en: 'Multi-source BFS: Simultaneous Spread & Nearest Distance', count: 5 },
    ],
    problems: [
      // 1. 单源 BFS
      p('All Nodes Distance K in Binary Tree', '二叉树中所有距离为 K 的结点', 'Medium', 'all-nodes-distance-k-in-binary-tree', 3),
      p('Shortest Path in Binary Matrix', '二进制矩阵中的最短路径', 'Medium', 'shortest-path-in-binary-matrix', 3),
      p('Open the Lock', '打开转盘锁', 'Medium', 'open-the-lock', 3),
      p('Word Ladder', '单词接龙', 'Hard', 'word-ladder', 3),
      p('Keys and Rooms', '钥匙和房间', 'Medium', 'keys-and-rooms', 1),
      p('Nearest Exit from Entrance in Maze', '迷宫中离入口最近的出口', 'Medium', 'nearest-exit-from-entrance-in-maze', 1),
      // 2. 多源 BFS
      lock(p('Walls and Gates', '墙与门', 'Medium', 'walls-and-gates', 3)),
      p('Rotting Oranges', '腐烂的橘子', 'Medium', 'rotting-oranges', 3),
      p('01 Matrix', '01 矩阵', 'Medium', '01-matrix', 3),
      p('As Far from Land as Possible', '离陆地最远的距离', 'Medium', 'as-far-from-land-as-possible', 3),
      p('Shortest Bridge', '最短的桥', 'Medium', 'shortest-bridge', 3),
    ],
  },
  {
    id: 'shortestpath', kind: 'milestone', theme: 'aqua', zh: '最短路径', en: 'Shortest Path',
    problems: [
      p('Network Delay Time', '网络延迟时间(Dijkstra)', 'Medium', 'network-delay-time'),
      p('Path With Minimum Effort', '最小体力消耗路径', 'Medium', 'path-with-minimum-effort'),
      p('Path with Maximum Probability', '概率最大的路径', 'Medium', 'path-with-maximum-probability'),
      p('Cheapest Flights Within K Stops', 'K 站中转内最便宜的航班', 'Medium', 'cheapest-flights-within-k-stops'),
    ],
  },

  // ═════════ 其他算法(独立一块;含新增的 区间/位运算/模拟) ═════════
  { id: 'others', kind: 'group', theme: 'sage', zh: '其他算法', en: 'Others', cols: 2 },
  {
    id: 'math', kind: 'topic', group: 'others', zh: '数学', en: 'Math',
    problems: [
      p('Factorial Trailing Zeroes', '阶乘后的零', 'Medium', 'factorial-trailing-zeroes'),
      p('Single Number', '只出现一次的数字', 'Easy', 'single-number'),
      p('Count Primes', '计数质数', 'Medium', 'count-primes'),
      p('Super Pow', '超级次方', 'Medium', 'super-pow'),
      p("Pascal's Triangle", '杨辉三角', 'Easy', 'pascals-triangle'),
      p('First Missing Positive', '缺失的第一个正数', 'Hard', 'first-missing-positive'),
    ],
  },
  {
    id: 'bitwise', kind: 'topic', group: 'others', zh: '位运算', en: 'Bit Manipulation',
    problems: [
      p('Number of 1 Bits', '位 1 的个数', 'Easy', 'number-of-1-bits'),
      p('Counting Bits', '比特位计数', 'Easy', 'counting-bits'),
      p('Missing Number', '丢失的数字', 'Easy', 'missing-number'),
      p('Sum of Two Integers', '两整数之和', 'Medium', 'sum-of-two-integers'),
      p('Single Number II', '只出现一次的数字 II', 'Medium', 'single-number-ii'),
      p('Single Number III', '只出现一次的数字 III', 'Medium', 'single-number-iii'),
      p('Bitwise AND of Numbers Range', '数字范围按位与', 'Medium', 'bitwise-and-of-numbers-range'),
    ],
  },
  {
    id: 'cyclicsort', kind: 'topic', group: 'others', zh: '循环排序', en: 'Cyclic Sort',
    // 原地把数字 i 归位到下标 i 的套路;41 缺失的第一个正数(在数学里)也是这一族。
    problems: [
      p('Find All Numbers Disappeared in an Array', '找到所有数组中消失的数字', 'Easy', 'find-all-numbers-disappeared-in-an-array'),
      p('Find All Duplicates in an Array', '数组中重复的数据', 'Medium', 'find-all-duplicates-in-an-array'),
      p('Set Mismatch', '错误的集合', 'Easy', 'set-mismatch'),
    ],
  },
  {
    id: 'geometry', kind: 'topic', group: 'others', zh: '几何', en: 'Geometry',
    problems: [
      p('Check If It Is a Straight Line', '缀点成线', 'Easy', 'check-if-it-is-a-straight-line'),
      p('Rectangle Overlap', '矩形重叠', 'Easy', 'rectangle-overlap'),
      p('Minimum Time Visiting All Points', '访问所有点的最小时间', 'Easy', 'minimum-time-visiting-all-points'),
      p('Valid Square', '有效的正方形', 'Medium', 'valid-square'),
      p('Rectangle Area', '矩形面积', 'Medium', 'rectangle-area'),
      p('Max Points on a Line', '直线上最多的点数', 'Hard', 'max-points-on-a-line'),
    ],
  },
]

// 把 guides.js 里的教程/模板合并到对应节点(节点内联写的优先)
NODES.forEach((n) => {
  const g = GUIDES[n.id]
  if (!g) return
  if (!n.tutorials && g.tutorials) n.tutorials = g.tutorials
  if (!n.templates && g.templates) n.templates = g.templates
})

// 连线:[from, to] 或 [from, to, 'dashed']。只连 milestone / group。
export const EDGES = [
  ['root', 'array', 'dashed'],
  ['root', 'linkedlist', 'dashed'],
  ['array', 'arrayops', 'dashed'],
  ['array', 'arraypatterns', 'dashed'],
  ['arrayops', 'twopointer'],
  ['arrayops', 'basicds'],
  ['linkedlist', 'basicds'],
  ['linkedlist', 'lltwopointer'],
  ['lltwopointer', 'recursion'],
  ['recursion', 'binarytree'],
  ['binarytree', 'advds'],
  ['binarytree', 'recursivetraversal'],
  ['binarytree', 'levelorder'],
  ['recursivetraversal', 'traversalview'],
  ['recursivetraversal', 'subproblem'],
  ['levelorder', 'bfs'],
  ['bfs', 'shortestpath'],
]

// 「其他算法」独立成块,放左下角。
export const FLOATING = ['others']
