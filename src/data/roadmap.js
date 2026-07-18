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

const p = (en, zh, diff, slug) => ({ en, zh, diff, url: `https://leetcode.com/problems/${slug}/` })

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
    id: 'matrix', kind: 'topic', group: 'arrayops', zh: '二维数组', en: '2D Array',
    problems: [
      p('Rotate Image', '旋转图像', 'Medium', 'rotate-image'),
      p('Spiral Matrix', '螺旋矩阵', 'Medium', 'spiral-matrix'),
      p('Spiral Matrix II', '螺旋矩阵 II', 'Medium', 'spiral-matrix-ii'),
      p('Reverse Words in a String', '反转字符串中的单词', 'Medium', 'reverse-words-in-a-string'),
    ],
  },

  // 分组:双指针技巧
  { id: 'twopointer', kind: 'group', theme: 'sky', zh: '双指针技巧', en: 'Two Pointers', cols: 1 },
  {
    id: 'arr2p', kind: 'topic', group: 'twopointer', zh: '数组双指针', en: 'Array Two Pointers',
    problems: [
      p('Remove Duplicates from Sorted Array II', '删除有序数组中的重复项 II', 'Medium', 'remove-duplicates-from-sorted-array-ii'),
      p('Valid Palindrome', '验证回文串', 'Easy', 'valid-palindrome'),
      p('Sort Colors', '颜色分类', 'Medium', 'sort-colors'),
      p('Merge Sorted Array', '合并两个有序数组', 'Easy', 'merge-sorted-array'),
      p('Squares of a Sorted Array', '有序数组的平方', 'Easy', 'squares-of-a-sorted-array'),
      p('Sort the Matrix Diagonally', '将矩阵按对角线排序', 'Medium', 'sort-the-matrix-diagonally'),
    ],
  },
  {
    id: 'sliding', kind: 'topic', group: 'twopointer', zh: '滑动窗口', en: 'Sliding Window',
    problems: [
      p('Minimum Operations to Reduce X to Zero', '将 x 减到 0 的最小操作数', 'Medium', 'minimum-operations-to-reduce-x-to-zero'),
      p('Subarray Product Less Than K', '乘积小于 K 的子数组', 'Medium', 'subarray-product-less-than-k'),
      p('Max Consecutive Ones III', '最大连续 1 的个数 III', 'Medium', 'max-consecutive-ones-iii'),
      p('Longest Repeating Character Replacement', '替换后的最长重复字符', 'Medium', 'longest-repeating-character-replacement'),
      p('Contains Duplicate II', '存在重复元素 II', 'Easy', 'contains-duplicate-ii'),
      p('Minimum Size Subarray Sum', '长度最小的子数组', 'Medium', 'minimum-size-subarray-sum'),
    ],
  },
  {
    id: 'binsearch', kind: 'topic', group: 'twopointer', zh: '二分搜索', en: 'Binary Search',
    problems: [
      p('Search a 2D Matrix', '搜索二维矩阵', 'Medium', 'search-a-2d-matrix'),
      p('Search a 2D Matrix II', '搜索二维矩阵 II', 'Medium', 'search-a-2d-matrix-ii'),
      p('Is Subsequence', '判断子序列', 'Easy', 'is-subsequence'),
      p('Number of Matching Subsequences', '匹配子序列的单词数', 'Medium', 'number-of-matching-subsequences'),
      p('Find K Closest Elements', '找到 K 个最接近的元素', 'Medium', 'find-k-closest-elements'),
      p('Search Insert Position', '搜索插入位置', 'Easy', 'search-insert-position'),
      p('Find Peak Element', '寻找峰值', 'Medium', 'find-peak-element'),
      p('Peak Index in a Mountain Array', '山脉数组的峰顶索引', 'Medium', 'peak-index-in-a-mountain-array'),
      p('Search in Rotated Sorted Array', '搜索旋转排序数组', 'Medium', 'search-in-rotated-sorted-array'),
      p('Search in Rotated Sorted Array II', '搜索旋转排序数组 II', 'Medium', 'search-in-rotated-sorted-array-ii'),
      p('Find Minimum in Rotated Sorted Array', '寻找旋转排序数组中的最小值', 'Medium', 'find-minimum-in-rotated-sorted-array'),
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
    id: 'simulation', kind: 'topic', group: 'arraypatterns', zh: '数组模拟', en: 'Array Simulation',
    problems: [
      p('Game of Life', '生命游戏', 'Medium', 'game-of-life'),
      p('Multiply Strings', '字符串相乘', 'Medium', 'multiply-strings'),
      p('Add Strings', '字符串相加', 'Easy', 'add-strings'),
      p('Zigzag Conversion', 'Z 字形变换', 'Medium', 'zigzag-conversion'),
      p('Count and Say', '外观数列', 'Medium', 'count-and-say'),
      p('Validate Stack Sequences', '验证栈序列', 'Medium', 'validate-stack-sequences'),
      p('Text Justification', '文本左右对齐', 'Hard', 'text-justification'),
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
  { id: 'linkedlist', kind: 'milestone', theme: 'pink', zh: '链表', en: 'Linked List', problems: [] },
  {
    id: 'fastslow', kind: 'milestone', theme: 'pink', zh: '快慢指针', en: 'Fast & Slow Pointers',
    problems: [
      p('Linked List Cycle', '环形链表', 'Easy', 'linked-list-cycle'),
      p('Linked List Cycle II', '环形链表 II', 'Medium', 'linked-list-cycle-ii'),
      p('Middle of the Linked List', '链表的中间结点', 'Easy', 'middle-of-the-linked-list'),
      p('Happy Number', '快乐数', 'Easy', 'happy-number'),
      p('Circular Array Loop', '环形数组是否存在循环', 'Medium', 'circular-array-loop'),
    ],
  },
  {
    id: 'lltwopointer', kind: 'milestone', theme: 'pink', zh: '链表双指针', en: 'Linked List Two Pointers',
    problems: [
      p('Remove Duplicates from Sorted List II', '删除排序链表中的重复元素 II', 'Medium', 'remove-duplicates-from-sorted-list-ii'),
      p('Find K Pairs with Smallest Sums', '查找和最小的 K 对数字', 'Medium', 'find-k-pairs-with-smallest-sums'),
      p('Add Two Numbers', '两数相加', 'Medium', 'add-two-numbers'),
      p('Add Two Numbers II', '两数相加 II', 'Medium', 'add-two-numbers-ii'),
      p('Find the Duplicate Number', '寻找重复数(快慢指针)', 'Medium', 'find-the-duplicate-number'),
    ],
  },
  {
    id: 'recursion', kind: 'milestone', theme: 'pink', zh: '递归', en: 'Recursion',
    problems: [
      p('Reverse Linked List', '反转链表', 'Easy', 'reverse-linked-list'),
      p('Swap Nodes in Pairs', '两两交换链表中的节点', 'Medium', 'swap-nodes-in-pairs'),
      p('Reverse Nodes in k-Group', 'K 个一组翻转链表', 'Hard', 'reverse-nodes-in-k-group'),
      p('Palindrome Linked List', '回文链表', 'Easy', 'palindrome-linked-list'),
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
    id: 'graph', kind: 'topic', group: 'advds', zh: '图', en: 'Graph',
    problems: [
      p('Clone Graph', '克隆图', 'Medium', 'clone-graph'),
      p('Is Graph Bipartite?', '判断二分图', 'Medium', 'is-graph-bipartite'),
      p('Possible Bipartition', '可能的二分法', 'Medium', 'possible-bipartition'),
      p('Course Schedule', '课程表(环检测)', 'Medium', 'course-schedule'),
      p('Course Schedule II', '课程表 II(拓扑排序)', 'Medium', 'course-schedule-ii'),
      p('Satisfiability of Equality Equations', '等式方程的可满足性(并查集)', 'Medium', 'satisfiability-of-equality-equations'),
      p('Connecting Cities With Minimum Cost', '最低成本联通所有城市(最小生成树)', 'Medium', 'connecting-cities-with-minimum-cost'),
      p('Min Cost to Connect All Points', '连接所有点的最小费用(最小生成树)', 'Medium', 'min-cost-to-connect-all-points'),
    ],
  },

  // 二叉树 → 两种遍历
  {
    id: 'recursivetraversal', kind: 'milestone', theme: 'peach', zh: '递归遍历', en: 'Recursive Traversal',
    problems: [
      p('Binary Tree Paths', '二叉树的所有路径(遍历)', 'Easy', 'binary-tree-paths'),
      p('Sum Root to Leaf Numbers', '求根节点到叶节点数字之和(遍历)', 'Medium', 'sum-root-to-leaf-numbers'),
      p('Binary Tree Right Side View', '二叉树的右视图(遍历)', 'Medium', 'binary-tree-right-side-view'),
      p('Sum of Root To Leaf Binary Numbers', '从根到叶的二进制数之和(遍历)', 'Easy', 'sum-of-root-to-leaf-binary-numbers'),
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
    id: 'dfs', kind: 'topic', group: 'traversalview', zh: '深度优先搜索', en: 'DFS',
    problems: [
      p('Number of Islands', '岛屿数量', 'Medium', 'number-of-islands'),
      p('Number of Closed Islands', '统计封闭岛屿的数目', 'Medium', 'number-of-closed-islands'),
      p('Number of Enclaves', '飞地的数量', 'Medium', 'number-of-enclaves'),
      p('Max Area of Island', '岛屿的最大面积', 'Medium', 'max-area-of-island'),
      p('Count Sub Islands', '统计子岛屿', 'Medium', 'count-sub-islands'),
      p('Number of Distinct Islands', '不同岛屿的数量', 'Medium', 'number-of-distinct-islands'),
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
    id: 'bfs', kind: 'milestone', theme: 'aqua', zh: '广度优先搜索', en: 'BFS',
    problems: [
      p('All Nodes Distance K in Binary Tree', '二叉树中所有距离为 K 的结点', 'Medium', 'all-nodes-distance-k-in-binary-tree'),
      p('Minimum Height Trees', '最小高度树', 'Medium', 'minimum-height-trees'),
      p('Keys and Rooms', '钥匙和房间', 'Medium', 'keys-and-rooms'),
      p('Nearest Exit from Entrance in Maze', '迷宫中离入口最近的出口', 'Medium', 'nearest-exit-from-entrance-in-maze'),
      p('Shortest Path in Binary Matrix', '二进制矩阵中的最短路径', 'Medium', 'shortest-path-in-binary-matrix'),
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
  ['linkedlist', 'fastslow'],
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
