// ============================================================================
//  各板块的「教程链接 + Python 代码模板」,按节点 id 组织,roadmap.js 会自动合并。
//  ▸ 加教程:tutorials 里加 { zh, en, url }
//  ▸ 加模板:templates 里加 { zh, en, code: `python代码` }
//  教程链接均为 labuladong.online 真实文章地址。
// ============================================================================

export const GUIDES = {
  // ── 差分数组 ──
  diffarray: {
    tutorials: [
      { zh: '小而美的算法技巧:差分数组', en: 'Difference Array', url: 'https://labuladong.online/zh/algo/data-structure/diff-array/' },
    ],
    templates: [
      {
        zh: '差分数组', en: 'Difference Array',
        code: `class Difference:
    # 差分数组工具类
    def __init__(self, nums: List[int]):
        assert len(nums) > 0
        self.diff = [0] * len(nums)
        # 根据初始数组构造差分数组
        self.diff[0] = nums[0]
        for i in range(1, len(nums)):
            self.diff[i] = nums[i] - nums[i - 1]

    # 给闭区间 [i, j] 增加 val(可以是负数)
    def increment(self, i: int, j: int, val: int) -> None:
        self.diff[i] += val
        if j + 1 < len(self.diff):
            self.diff[j + 1] -= val

    # 返回结果数组
    def result(self) -> List[int]:
        res = [0] * len(self.diff)
        res[0] = self.diff[0]
        for i in range(1, len(self.diff)):
            res[i] = res[i - 1] + self.diff[i]
        return res`,
      },
    ],
  },

  // ── 二维数组 ──
  matrix: {
    tutorials: [
      { zh: '二维数组的花式遍历技巧', en: '2D Array Traversal Tricks', url: 'https://labuladong.online/zh/algo/practice-in-action/2d-array-traversal-summary/' },
    ],
    templates: [
      {
        zh: '旋转图像(先转置再翻转)', en: 'Rotate Image',
        code: `def rotate(matrix: List[List[int]]) -> None:
    n = len(matrix)
    # 先沿主对角线转置
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # 再翻转每一行,即顺时针旋转 90 度
    for row in matrix:
        row.reverse()`,
      },
      {
        zh: '螺旋遍历(收缩边界)', en: 'Spiral Traversal',
        code: `def spiralOrder(matrix: List[List[int]]) -> List[int]:
    m, n = len(matrix), len(matrix[0])
    upper, lower = 0, m - 1
    left, right = 0, n - 1
    res = []
    # res.size == m * n 则遍历完整个数组
    while len(res) < m * n:
        if upper <= lower:  # 顶部从左向右
            res.extend(matrix[upper][left:right + 1])
            upper += 1
        if left <= right:   # 右侧从上向下
            for i in range(upper, lower + 1):
                res.append(matrix[i][right])
            right -= 1
        if upper <= lower:  # 底部从右向左
            res.extend(matrix[lower][left:right + 1][::-1])
            lower -= 1
        if left <= right:   # 左侧从下向上
            for i in range(lower, upper - 1, -1):
                res.append(matrix[i][left])
            left += 1
    return res`,
      },
    ],
  },

  // ── 数组双指针 ──
  arr2p: {
    tutorials: [
      { zh: '双指针技巧秒杀七道数组题目', en: 'Two Pointers for Arrays', url: 'https://labuladong.online/zh/algo/essential-technique/array-two-pointers-summary-2/' },
      { zh: '一个方法团灭 nSum 问题', en: 'One Function for All nSum', url: 'https://labuladong.online/zh/algo/practice-in-action/nsum/' },
    ],
    templates: [
      {
        zh: 'nSum 万能函数', en: 'Universal nSum',
        code: `def nSumTarget(nums: List[int], n: int, start: int, target: int) -> List[List[int]]:
    # nums 需要先排序!调用前 nums.sort()
    sz = len(nums)
    res = []
    if n < 2 or sz < n:
        return res
    if n == 2:  # base case:双指针
        lo, hi = start, sz - 1
        while lo < hi:
            s = nums[lo] + nums[hi]
            left, right = nums[lo], nums[hi]
            if s < target:
                while lo < hi and nums[lo] == left: lo += 1
            elif s > target:
                while lo < hi and nums[hi] == right: hi -= 1
            else:
                res.append([left, right])
                while lo < hi and nums[lo] == left: lo += 1
                while lo < hi and nums[hi] == right: hi -= 1
    else:  # n > 2:递归计算 (n-1)Sum
        i = start
        while i < sz:
            subs = nSumTarget(nums, n - 1, i + 1, target - nums[i])
            for sub in subs:
                res.append([nums[i]] + sub)
            while i < sz - 1 and nums[i] == nums[i + 1]: i += 1
            i += 1
    return res`,
      },
    ],
  },

  // ── 滑动窗口 ──
  sliding: {
    tutorials: [
      { zh: '滑动窗口算法核心代码模板', en: 'Sliding Window Framework', url: 'https://labuladong.online/zh/algo/essential-technique/sliding-window-framework-2/' },
    ],
    templates: [
      {
        zh: '滑动窗口框架', en: 'Sliding Window Framework',
        code: `def slidingWindow(s: str):
    # 用合适的数据结构记录窗口中的数据
    window = {}
    left, right = 0, 0
    while right < len(s):
        c = s[right]        # c 是将移入窗口的字符
        window[c] = window.get(c, 0) + 1
        right += 1          # 扩大窗口
        # ... 进行窗口内数据的一系列更新

        # 判断左侧窗口是否要收缩
        while left < right and window_needs_shrink:
            d = s[left]     # d 是将移出窗口的字符
            window[d] -= 1
            left += 1       # 缩小窗口
            # ... 进行窗口内数据的一系列更新`,
      },
    ],
  },

  // ── 二分搜索 ──
  binsearch: {
    tutorials: [
      { zh: '二分搜索算法核心代码模板', en: 'Binary Search Framework', url: 'https://labuladong.online/zh/algo/essential-technique/binary-search-framework/' },
      { zh: '实际运用二分搜索时的思维框架', en: 'Binary Search in Action', url: 'https://labuladong.online/zh/algo/frequency-interview/binary-search-in-action/' },
    ],
    templates: [
      {
        zh: '二分搜索框架(基本 + 左右边界)', en: 'Binary Search Framework',
        code: `# 基本二分:寻找一个数
def binary_search(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1  # 闭区间 [left, right]
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# 寻找左侧边界
def left_bound(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] < target:
            left = mid + 1
        else:               # nums[mid] >= target,收缩右边界
            right = mid - 1
    if left < 0 or left >= len(nums):
        return -1
    return left if nums[left] == target else -1

# 寻找右侧边界
def right_bound(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] <= target:  # nums[mid] <= target,收缩左边界
            left = mid + 1
        else:
            right = mid - 1
    if right < 0 or right >= len(nums):
        return -1
    return right if nums[right] == target else -1`,
      },
    ],
  },

  // ── 随机算法 ──
  random: {
    tutorials: [
      { zh: '带权重的随机选择算法', en: 'Weighted Random Pick', url: 'https://labuladong.online/zh/algo/frequency-interview/random-pick-with-weight/' },
      { zh: '谈谈游戏中的随机算法', en: 'Random Algorithms in Games', url: 'https://labuladong.online/zh/algo/frequency-interview/random-algorithm/' },
    ],
    templates: [
      {
        zh: '洗牌算法 + 带权随机', en: 'Shuffle & Weighted Pick',
        code: `import random
import bisect

# Fisher-Yates 洗牌:保证 n! 种排列等概率
def shuffle(nums: List[int]) -> List[int]:
    n = len(nums)
    for i in range(n):
        r = random.randint(i, n - 1)  # 从 [i, n-1] 随机选
        nums[i], nums[r] = nums[r], nums[i]
    return nums

# 带权重随机选择:前缀和 + 二分
class WeightedPick:
    def __init__(self, w: List[int]):
        self.preSum = [0]
        for x in w:
            self.preSum.append(self.preSum[-1] + x)

    def pickIndex(self) -> int:
        target = random.randint(1, self.preSum[-1])
        # 在前缀和中找左边界
        return bisect.bisect_left(self.preSum, target) - 1`,
      },
    ],
  },

  // ── 循环数组 ──
  circulararray: {
    templates: [
      {
        zh: '环形数组(取模实现)', en: 'Circular Array',
        code: `class CycleArray:
    # 用取模运算模拟环形数组,头尾插入删除都是 O(1)
    def __init__(self, size: int):
        self.arr = [0] * size
        self.size = size
        self.start = 0   # 指向第一个有效元素
        self.count = 0   # 有效元素个数

    def is_full(self) -> bool:
        return self.count == self.size

    def is_empty(self) -> bool:
        return self.count == 0

    def add_last(self, val) -> None:
        assert not self.is_full()
        end = (self.start + self.count) % self.size
        self.arr[end] = val
        self.count += 1

    def remove_first(self):
        assert not self.is_empty()
        val = self.arr[self.start]
        self.start = (self.start + 1) % self.size
        self.count -= 1
        return val`,
      },
    ],
  },

  // ── 栈与队列 ──
  stackqueue: {
    tutorials: [
      { zh: '单调栈算法模板解决三道例题', en: 'Monotonic Stack Template', url: 'https://labuladong.online/zh/algo/data-structure/monotonic-stack/' },
      { zh: '单调队列结构解决滑动窗口问题', en: 'Monotonic Queue', url: 'https://labuladong.online/zh/algo/data-structure/monotonic-queue/' },
    ],
    templates: [
      {
        zh: '单调栈模板(下一个更大元素)', en: 'Monotonic Stack',
        code: `def nextGreaterElement(nums: List[int]) -> List[int]:
    n = len(nums)
    res = [0] * n
    stack = []  # 存放元素(或索引)
    # 倒着往栈里放
    for i in range(n - 1, -1, -1):
        # 把矮个都踢出去,只留比 nums[i] 高的
        while stack and stack[-1] <= nums[i]:
            stack.pop()
        # 栈顶就是 nums[i] 身后的下一个更大元素
        res[i] = stack[-1] if stack else -1
        stack.append(nums[i])
    return res`,
      },
      {
        zh: '单调队列(滑动窗口最大值)', en: 'Monotonic Queue',
        code: `from collections import deque

class MonotonicQueue:
    # 单调递减队列:队头永远是最大值
    def __init__(self):
        self.q = deque()

    def push(self, n: int) -> None:
        # 把前面比自己小的都挤掉
        while self.q and self.q[-1] < n:
            self.q.pop()
        self.q.append(n)

    def max(self) -> int:
        return self.q[0]

    def pop(self, n: int) -> None:
        # n 可能已在 push 时被挤掉了
        if self.q and self.q[0] == n:
            self.q.popleft()`,
      },
    ],
  },

  // ── 哈希 ──
  hash: {
    tutorials: [
      { zh: '哈希表核心原理', en: 'HashMap Basics', url: 'https://labuladong.online/zh/algo/data-structure-basic/hashmap-basic/' },
    ],
    templates: [
      {
        zh: '哈希计数常用套路', en: 'Hash Counting Patterns',
        code: `from collections import Counter, defaultdict

# 1. 计数:判断字母异位词
def isAnagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)

# 2. 分组:字母异位词分组(排序后的串作为 key)
def groupAnagrams(strs: List[str]) -> List[List[str]]:
    groups = defaultdict(list)
    for s in strs:
        groups[''.join(sorted(s))].append(s)
    return list(groups.values())

# 3. 用 set 做 O(1) 存在性判断:最长连续序列
def longestConsecutive(nums: List[int]) -> int:
    s, res = set(nums), 0
    for x in s:
        if x - 1 in s:      # 只从序列起点开始数
            continue
        cur = x
        while cur + 1 in s:
            cur += 1
        res = max(res, cur - x + 1)
    return res`,
      },
    ],
  },

  // ── 设计 · OOD ──
  design: {
    tutorials: [
      { zh: '算法就像搭乐高:手撸 LRU 算法', en: 'Build LRU like Lego', url: 'https://labuladong.online/zh/algo/data-structure/lru-cache/' },
      { zh: '算法就像搭乐高:手撸 LFU 算法', en: 'Build LFU like Lego', url: 'https://labuladong.online/zh/algo/frequency-interview/lfu/' },
    ],
    templates: [
      {
        zh: 'LRU 缓存(哈希 + 双向链表 / OrderedDict)', en: 'LRU Cache',
        code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)   # 提升为最近使用
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)  # 淘汰最久未使用`,
      },
    ],
  },

  // ── 快慢指针 ──
  fastslow: {
    tutorials: [
      { zh: '双指针技巧秒杀七道链表题目(含快慢指针)', en: 'Two Pointers for Linked List', url: 'https://labuladong.online/zh/algo/essential-technique/linked-list-skills-summary/' },
    ],
    templates: [
      {
        zh: '快慢指针框架', en: 'Fast & Slow Pointers',
        code: `# 1. 判断链表是否有环
def hasCycle(head) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

# 2. 找环起点:相遇后 slow 回到头,同速前进再相遇即起点
def detectCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            slow = head
            while slow is not fast:
                slow, fast = slow.next, fast.next
            return slow
    return None

# 3. 找链表中点
def middleNode(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow`,
      },
    ],
  },

  // ── 链表双指针 ──
  lltwopointer: {
    tutorials: [
      { zh: '双指针技巧秒杀七道链表题目', en: 'Two Pointers for Linked List', url: 'https://labuladong.online/zh/algo/essential-technique/linked-list-skills-summary/' },
    ],
    templates: [
      {
        zh: '虚拟头结点 + 常用套路', en: 'Dummy Node Patterns',
        code: `# 1. 合并两个有序链表(虚拟头结点 dummy)
def mergeTwoLists(l1, l2):
    dummy = ListNode(-1)
    p = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            p.next, l1 = l1, l1.next
        else:
            p.next, l2 = l2, l2.next
        p = p.next
    p.next = l1 or l2
    return dummy.next

# 2. 删除倒数第 k 个节点:p1 先走 k 步,p1 p2 同行
def removeNthFromEnd(head, n: int):
    dummy = ListNode(-1, head)
    p1, p2 = head, dummy
    for _ in range(n):
        p1 = p1.next
    while p1:
        p1, p2 = p1.next, p2.next
    p2.next = p2.next.next
    return dummy.next

# 3. 判断两链表相交:走完自己走对方,同步则相遇
def getIntersectionNode(a, b):
    p1, p2 = a, b
    while p1 is not p2:
        p1 = p1.next if p1 else b
        p2 = p2.next if p2 else a
    return p1`,
      },
    ],
  },

  // ── 递归(链表反转) ──
  recursion: {
    tutorials: [
      { zh: '单链表的花式反转方法汇总', en: 'Reverse Linked List Recursively', url: 'https://labuladong.online/zh/algo/data-structure/reverse-linked-list-recursion/' },
    ],
    templates: [
      {
        zh: '反转链表(迭代 + 递归)', en: 'Reverse Linked List',
        code: `# 迭代反转整条链表
def reverseList(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    return prev

# 递归反转整条链表
def reverse(head):
    if head is None or head.next is None:
        return head
    last = reverse(head.next)
    head.next.next = head
    head.next = None
    return last

# K 个一组反转(迭代反转区间 [a, b) + 递归衔接)
def reverseKGroup(head, k: int):
    a = b = head
    for _ in range(k):
        if b is None:       # 不足 k 个,不反转
            return head
        b = b.next
    # 反转 [a, b) 之间的元素
    prev, cur = None, a
    while cur is not b:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    a.next = reverseKGroup(b, k)
    return prev`,
      },
    ],
  },

  // ── 二叉树 ──
  binarytree: {
    tutorials: [
      { zh: '二叉树基础及常见类型', en: 'Binary Tree Basics', url: 'https://labuladong.online/zh/algo/data-structure-basic/binary-tree-basic/' },
      { zh: '二叉树系列算法核心纲领', en: 'Binary Tree Summary', url: 'https://labuladong.online/zh/algo/essential-technique/binary-tree-summary/' },
    ],
    templates: [
      {
        zh: '递归遍历框架(前中后序)', en: 'Recursive Traversal',
        code: `def traverse(root) -> None:
    if root is None:
        return
    # 前序位置:刚进入节点
    traverse(root.left)
    # 中序位置:左子树遍历完
    traverse(root.right)
    # 后序位置:即将离开节点`,
      },
      {
        zh: '层序遍历框架', en: 'Level Order Traversal',
        code: `from collections import deque

def levelTraverse(root) -> None:
    if root is None:
        return
    q = deque([root])
    depth = 1
    while q:
        sz = len(q)
        # 遍历当前层的所有节点
        for _ in range(sz):
            cur = q.popleft()
            # 访问 cur,当前层数为 depth
            if cur.left:
                q.append(cur.left)
            if cur.right:
                q.append(cur.right)
        depth += 1`,
      },
    ],
  },

  // ── 递归遍历(两种思维) ──
  recursivetraversal: {
    tutorials: [
      { zh: '二叉树心法(思路篇)', en: 'Binary Tree in Action (Ideas)', url: 'https://labuladong.online/zh/algo/data-structure/binary-tree-part1/' },
      { zh: '二叉树系列算法核心纲领', en: 'Binary Tree Summary', url: 'https://labuladong.online/zh/algo/essential-technique/binary-tree-summary/' },
    ],
    templates: [
      {
        zh: '「遍历」vs「分解问题」两种思维', en: 'Traverse vs Decompose',
        code: `# 思维一:「遍历」— 用外部变量 + traverse 函数(回溯/DFS 原型)
class SolutionA:
    def maxDepth(self, root) -> int:
        self.depth = 0
        self.res = 0
        def traverse(node):
            if node is None:
                return
            self.depth += 1                  # 前序:进入节点
            self.res = max(self.res, self.depth)
            traverse(node.left)
            traverse(node.right)
            self.depth -= 1                  # 后序:离开节点
        traverse(root)
        return self.res

# 思维二:「分解问题」— 函数返回值定义子问题(动态规划原型)
class SolutionB:
    def maxDepth(self, root) -> int:
        if root is None:
            return 0
        # 整棵树深度 = 子树最大深度 + 1
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
      },
    ],
  },

  // ── 层序遍历 ──
  levelorder: {
    tutorials: [
      { zh: '二叉树的递归/层序遍历', en: 'Binary Tree Traversal Basics', url: 'https://labuladong.online/zh/algo/data-structure-basic/binary-tree-basic/' },
    ],
    templates: [
      {
        zh: '层序遍历(按层收集)', en: 'Level Order (Collect by Level)',
        code: `from collections import deque

def levelOrder(root) -> List[List[int]]:
    if root is None:
        return []
    res, q = [], deque([root])
    while q:
        sz = len(q)
        level = []
        for _ in range(sz):
            cur = q.popleft()
            level.append(cur.val)
            if cur.left:
                q.append(cur.left)
            if cur.right:
                q.append(cur.right)
        res.append(level)
    return res`,
      },
    ],
  },

  // ── 二叉搜索树 ──
  bst: {
    tutorials: [
      { zh: '二叉搜索树心法(特性篇)', en: 'BST in Action (In-order)', url: 'https://labuladong.online/zh/algo/data-structure/bst-part1/' },
      { zh: '二叉搜索树心法(基操篇)', en: 'BST in Action (Basic Ops)', url: 'https://labuladong.online/zh/algo/data-structure/bst-part2/' },
    ],
    templates: [
      {
        zh: 'BST 增删查框架', en: 'BST Operations',
        code: `# 查:利用左小右大,每次排除一半
def searchBST(root, target: int):
    if root is None:
        return None
    if root.val < target:
        return searchBST(root.right, target)
    if root.val > target:
        return searchBST(root.left, target)
    return root

# 增:找到空位插入
def insertIntoBST(root, val: int):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = insertIntoBST(root.left, val)
    else:
        root.right = insertIntoBST(root.right, val)
    return root

# BST 中序遍历 = 升序序列(特性核心)
def inorder(root, res: list) -> None:
    if root is None:
        return
    inorder(root.left, res)
    res.append(root.val)
    inorder(root.right, res)`,
      },
    ],
  },

  // ── 堆 ──
  heap: {
    tutorials: [
      { zh: '二叉堆详解实现优先级队列', en: 'Binary Heap & Priority Queue', url: 'https://labuladong.online/zh/algo/data-structure/binary-heap-priority-queue/' },
    ],
    templates: [
      {
        zh: 'heapq 常用套路(Top K / 双堆中位数)', en: 'heapq Patterns',
        code: `import heapq

# Top K:维护大小为 k 的小顶堆
def topKFrequent(nums: List[int], k: int) -> List[int]:
    from collections import Counter
    cnt = Counter(nums)
    heap = []
    for num, c in cnt.items():
        heapq.heappush(heap, (c, num))
        if len(heap) > k:
            heapq.heappop(heap)
    return [num for _, num in heap]

# 双堆求中位数:大顶堆存小半边,小顶堆存大半边
class MedianFinder:
    def __init__(self):
        self.small = []  # 大顶堆(取负模拟)
        self.large = []  # 小顶堆

    def addNum(self, num: int) -> None:
        if len(self.small) >= len(self.large):
            heapq.heappush(self.small, -num)
            heapq.heappush(self.large, -heapq.heappop(self.small))
        else:
            heapq.heappush(self.large, num)
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.large) > len(self.small):
            return self.large[0]
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (self.large[0] - self.small[0]) / 2`,
      },
    ],
  },

  // ── 字典树 ──
  trie: {
    tutorials: [
      { zh: 'Trie/字典树/前缀树原理及可视化', en: 'Trie Basics', url: 'https://labuladong.online/zh/algo/data-structure-basic/trie-map-basic/' },
      { zh: 'Trie 树代码实现', en: 'Trie Implementation', url: 'https://labuladong.online/zh/algo/data-structure/trie-implement/' },
    ],
    templates: [
      {
        zh: 'Trie 前缀树实现', en: 'Trie Implementation',
        code: `class TrieNode:
    def __init__(self):
        self.children = {}   # 字符 -> TrieNode
        self.isEnd = False   # 是否为单词结尾

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.isEnd = True

    def _find(self, prefix: str):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def search(self, word: str) -> bool:
        node = self._find(word)
        return node is not None and node.isEnd

    def startsWith(self, prefix: str) -> bool:
        return self._find(prefix) is not None`,
      },
    ],
  },

  // ── 图 ──
  graph: {
    tutorials: [
      { zh: '图结构的 DFS/BFS 遍历', en: 'Graph DFS/BFS Traversal', url: 'https://labuladong.online/zh/algo/data-structure-basic/graph-traverse-basic/' },
      { zh: '拓扑排序算法', en: 'Topological Sort', url: 'https://labuladong.online/zh/algo/data-structure/topological-sort/' },
      { zh: 'Union-Find 并查集算法', en: 'Union-Find', url: 'https://labuladong.online/zh/algo/data-structure/union-find/' },
      { zh: 'Kruskal 最小生成树算法', en: 'Kruskal MST', url: 'https://labuladong.online/zh/algo/data-structure/kruskal/' },
    ],
    templates: [
      {
        zh: '并查集(路径压缩)', en: 'Union-Find',
        code: `class UF:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self._count = n          # 连通分量个数

    def find(self, x: int) -> int:
        if self.parent[x] != x:  # 路径压缩
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, p: int, q: int) -> None:
        rp, rq = self.find(p), self.find(q)
        if rp == rq:
            return
        self.parent[rp] = rq
        self._count -= 1

    def connected(self, p: int, q: int) -> bool:
        return self.find(p) == self.find(q)

    def count(self) -> int:
        return self._count`,
      },
      {
        zh: '拓扑排序(BFS 入度法)', en: 'Topological Sort (BFS)',
        code: `from collections import deque

def topoSort(numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    graph = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for a, b in prerequisites:   # b -> a
        graph[b].append(a)
        indegree[a] += 1
    q = deque(i for i in range(numCourses) if indegree[i] == 0)
    res = []
    while q:
        cur = q.popleft()
        res.append(cur)
        for nxt in graph[cur]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                q.append(nxt)
    # len(res) < numCourses 说明有环
    return res if len(res) == numCourses else []`,
      },
    ],
  },

  // ── 回溯 ──
  backtrack: {
    tutorials: [
      { zh: '回溯算法解题套路框架', en: 'Backtracking Framework', url: 'https://labuladong.online/zh/algo/essential-technique/backtrack-framework/' },
    ],
    templates: [
      {
        zh: '回溯算法框架', en: 'Backtracking Framework',
        code: `result = []

def backtrack(路径, 选择列表):
    if 满足结束条件:
        result.append(路径[:])
        return
    for 选择 in 选择列表:
        # 做选择
        路径.append(选择)
        backtrack(路径, 选择列表)
        # 撤销选择
        路径.pop()`,
      },
      {
        zh: '子集 / 组合 / 排列(元素无重不可复选)', en: 'Subsets / Combinations / Permutations',
        code: `# 子集(组合):用 start 控制,不走回头路
def subsets(nums: List[int]) -> List[List[int]]:
    res, track = [], []
    def backtrack(start: int):
        res.append(track[:])          # 每个节点都是一个子集
        for i in range(start, len(nums)):
            track.append(nums[i])
            backtrack(i + 1)
            track.pop()
    backtrack(0)
    return res

# 排列:用 used 数组标记,穷举所有顺序
def permute(nums: List[int]) -> List[List[int]]:
    res, track = [], []
    used = [False] * len(nums)
    def backtrack():
        if len(track) == len(nums):
            res.append(track[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            track.append(nums[i])
            backtrack()
            track.pop()
            used[i] = False
    backtrack()
    return res`,
      },
    ],
  },

  // ── DFS ──
  dfs: {
    tutorials: [
      { zh: '一文秒杀所有岛屿题目', en: 'Solve All Island Problems', url: 'https://labuladong.online/zh/algo/frequency-interview/island-dfs-summary/' },
    ],
    templates: [
      {
        zh: '岛屿 DFS 框架(FloodFill)', en: 'Island DFS (Flood Fill)',
        code: `def numIslands(grid: List[List[str]]) -> int:
    m, n = len(grid), len(grid[0])
    res = 0

    # 从 (i, j) 开始,把相连的陆地全部淹掉
    def dfs(i: int, j: int) -> None:
        if i < 0 or j < 0 or i >= m or j >= n:
            return              # 越界
        if grid[i][j] == '0':
            return              # 已是海水
        grid[i][j] = '0'        # 淹掉,防止重复访问
        dfs(i + 1, j)
        dfs(i - 1, j)
        dfs(i, j + 1)
        dfs(i, j - 1)

    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                res += 1        # 发现新岛屿
                dfs(i, j)       # 整座岛淹掉
    return res`,
      },
    ],
  },

  // ── 分治 ──
  divide: {
    tutorials: [
      { zh: '从二叉树视角理解递归(分解问题思维)', en: 'Recursion via Binary Tree View', url: 'https://labuladong.online/zh/algo/essential-technique/binary-tree-summary/' },
    ],
    templates: [
      {
        zh: '归并排序(分治模板)', en: 'Merge Sort',
        code: `def sortArray(nums: List[int]) -> List[int]:
    if len(nums) <= 1:
        return nums
    mid = len(nums) // 2
    # 分:递归排序左右两半
    left = sortArray(nums[:mid])
    right = sortArray(nums[mid:])
    # 治:合并两个有序数组
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res`,
      },
    ],
  },

  // ── 动态规划 ──
  dp: {
    tutorials: [
      { zh: '动态规划解题套路框架', en: 'DP Framework', url: 'https://labuladong.online/zh/algo/essential-technique/dynamic-programming-framework/' },
    ],
    templates: [
      {
        zh: 'DP 框架(备忘录 + 自底向上)', en: 'DP Framework',
        code: `# 自顶向下:递归 + 备忘录(以凑零钱为例)
def coinChange(coins: List[int], amount: int) -> int:
    memo = {}
    def dp(n: int) -> int:
        if n == 0: return 0
        if n < 0: return -1
        if n in memo: return memo[n]
        res = float('inf')
        for coin in coins:          # 状态转移:择优
            sub = dp(n - coin)
            if sub != -1:
                res = min(res, sub + 1)
        memo[n] = res if res != float('inf') else -1
        return memo[n]
    return dp(amount)

# 自底向上:dp 数组迭代
def coinChange2(coins: List[int], amount: int) -> int:
    dp = [amount + 1] * (amount + 1)  # base case 外全部初始化为"不可能"
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != amount + 1 else -1`,
      },
    ],
  },

  // ── BFS ──
  bfs: {
    tutorials: [
      { zh: 'BFS 算法解题套路框架', en: 'BFS Framework', url: 'https://labuladong.online/zh/algo/essential-technique/bfs-framework/' },
    ],
    templates: [
      {
        zh: 'BFS 框架(最短步数)', en: 'BFS Framework',
        code: `from collections import deque

def bfs(start, target) -> int:
    q = deque([start])
    visited = {start}       # 避免走回头路
    step = 0                # 记录扩散的步数
    while q:
        sz = len(q)
        for _ in range(sz):
            cur = q.popleft()
            if cur == target:      # 判断是否到达终点
                return step
            for nxt in neighbors(cur):  # 相邻节点加入队列
                if nxt not in visited:
                    visited.add(nxt)
                    q.append(nxt)
        step += 1           # 一层扩散完,步数加一
    return -1`,
      },
    ],
  },

  // ── 最短路径 ──
  shortestpath: {
    tutorials: [
      { zh: 'Dijkstra 算法核心原理及实现', en: 'Dijkstra Algorithm', url: 'https://labuladong.online/zh/algo/data-structure/dijkstra/' },
      { zh: 'Dijkstra 拓展:带限制的最短路问题', en: 'Dijkstra with Restrictions', url: 'https://labuladong.online/zh/algo/data-structure/dijkstra-follow-up/' },
    ],
    templates: [
      {
        zh: 'Dijkstra 模板(优先级队列)', en: 'Dijkstra Template',
        code: `import heapq

def dijkstra(n: int, graph: List[List[tuple]], start: int) -> List[float]:
    # graph[u] = [(v, w), ...] 邻接表
    dist = [float('inf')] * n   # start 到各点的最短距离
    dist[start] = 0
    pq = [(0, start)]           # (距离, 节点)
    while pq:
        d, cur = heapq.heappop(pq)
        if d > dist[cur]:
            continue            # 已有更优路径,跳过
        for nxt, w in graph[cur]:
            nd = d + w
            if nd < dist[nxt]:  # 松弛:发现更短路径
                dist[nxt] = nd
                heapq.heappush(pq, (nd, nxt))
    return dist`,
      },
    ],
  },

  // ── 排序与选择 ──
  sortselect: {
    templates: [
      {
        zh: '快速选择(第 K 大元素)', en: 'Quickselect',
        code: `import random

def findKthLargest(nums: List[int], k: int) -> int:
    # 第 k 大 = 升序排列后索引 n - k
    target = len(nums) - k

    def partition(lo: int, hi: int) -> int:
        # 随机化 pivot 避免最坏情况
        r = random.randint(lo, hi)
        nums[lo], nums[r] = nums[r], nums[lo]
        pivot = nums[lo]
        i, j = lo + 1, hi
        while i <= j:
            while i <= j and nums[i] < pivot: i += 1
            while i <= j and nums[j] > pivot: j -= 1
            if i <= j:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1; j -= 1
        nums[lo], nums[j] = nums[j], nums[lo]
        return j

    lo, hi = 0, len(nums) - 1
    while True:
        p = partition(lo, hi)
        if p == target:
            return nums[p]
        elif p < target:
            lo = p + 1
        else:
            hi = p - 1`,
      },
    ],
  },

  // ── 区间问题 ──
  interval: {
    templates: [
      {
        zh: '区间问题三板斧(排序 + 合并/相交)', en: 'Interval Patterns',
        code: `# 1. 合并区间:按起点排序,逐个合并
def merge(intervals: List[List[int]]) -> List[List[int]]:
    intervals.sort(key=lambda x: x[0])
    res = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= res[-1][1]:            # 有重叠,合并
            res[-1][1] = max(res[-1][1], end)
        else:
            res.append([start, end])
    return res

# 2. 区间交集:双指针
def intervalIntersection(A, B) -> List[List[int]]:
    i = j = 0
    res = []
    while i < len(A) and j < len(B):
        a1, a2 = A[i]
        b1, b2 = B[j]
        if b1 <= a2 and a1 <= b2:          # 有交集
            res.append([max(a1, b1), min(a2, b2)])
        if a2 < b2: i += 1                 # 谁先结束谁前进
        else: j += 1
    return res

# 3. 无重叠区间(区间调度):按终点排序,贪心选不重叠的
def eraseOverlapIntervals(intervals) -> int:
    intervals.sort(key=lambda x: x[1])
    count, end = 0, float('-inf')
    for s, e in intervals:
        if s >= end:
            count += 1; end = e            # 选中该区间
    return len(intervals) - count`,
      },
    ],
  },

  // ── 贪心策略 ──
  greedy: {
    tutorials: [
      { zh: '贪心算法解题套路框架', en: 'Greedy Framework', url: 'https://labuladong.online/zh/algo/essential-technique/greedy/' },
      { zh: '如何运用贪心思想玩跳跃游戏', en: 'Greedy for Jump Game', url: 'https://labuladong.online/zh/algo/frequency-interview/jump-game-summary/' },
    ],
    templates: [
      {
        zh: '跳跃游戏(维护最远可达)', en: 'Jump Game',
        code: `# 跳跃游戏 I:能否到达最后一格
def canJump(nums: List[int]) -> bool:
    farthest = 0
    for i in range(len(nums)):
        if i > farthest:
            return False            # 到不了 i
        farthest = max(farthest, i + nums[i])
    return True

# 跳跃游戏 II:最少跳几次(贪心选每步的最远覆盖)
def jump(nums: List[int]) -> int:
    n = len(nums)
    end, farthest, jumps = 0, 0, 0
    for i in range(n - 1):
        farthest = max(farthest, i + nums[i])
        if i == end:                # 走到当前跳的边界
            jumps += 1
            end = farthest
    return jumps`,
      },
    ],
  },

  // ── 数组模拟 ──
  simulation: {
    templates: [
      {
        zh: '原地标记技巧(生命游戏)', en: 'In-place State Encoding',
        code: `def gameOfLife(board: List[List[int]]) -> None:
    # 用额外状态位原地记录"变化前后":
    #   2 表示 活->死, 3 表示 死->活
    m, n = len(board), len(board[0])
    for i in range(m):
        for j in range(n):
            live = 0
            for di in (-1, 0, 1):
                for dj in (-1, 0, 1):
                    if di == dj == 0: continue
                    x, y = i + di, j + dj
                    if 0 <= x < m and 0 <= y < n and board[x][y] in (1, 2):
                        live += 1
            if board[i][j] == 1 and (live < 2 or live > 3):
                board[i][j] = 2
            if board[i][j] == 0 and live == 3:
                board[i][j] = 3
    for i in range(m):
        for j in range(n):
            board[i][j] = 1 if board[i][j] in (1, 3) else 0`,
      },
    ],
  },

  // ── 数学 ──
  math: {
    tutorials: [
      { zh: '一行代码就能解决的算法题', en: 'One-line Solutions', url: 'https://labuladong.online/zh/algo/frequency-interview/one-line-solutions/' },
    ],
    templates: [
      {
        zh: '常用数学工具(gcd / 快速幂 / 素数筛)', en: 'Math Toolbox',
        code: `# 最大公约数(辗转相除)
def gcd(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return a

# 快速幂:O(log n) 求 x^n % mod
def qpow(x: int, n: int, mod: int) -> int:
    res = 1
    x %= mod
    while n:
        if n & 1:
            res = res * x % mod
        x = x * x % mod
        n >>= 1
    return res

# 埃氏筛:统计 [2, n) 内素数
def countPrimes(n: int) -> int:
    if n < 3:
        return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n, i):
                is_prime[j] = False
    return sum(is_prime)`,
      },
    ],
  },

  // ── 位运算 ──
  bitwise: {
    tutorials: [
      { zh: '常用的位操作', en: 'Common Bit Manipulation', url: 'https://labuladong.online/zh/algo/frequency-interview/bitwise-operation/' },
    ],
    templates: [
      {
        zh: '位运算速查', en: 'Bit Tricks Cheatsheet',
        code: `# n & (n-1):消除最低位的 1
def hammingWeight(n: int) -> int:
    res = 0
    while n:
        n &= n - 1      # 每次消掉一个 1
        res += 1
    return res

# 判断 2 的幂:只有一个 1
def isPowerOfTwo(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0

# 异或:a ^ a = 0, a ^ 0 = a → 找只出现一次的数字
def singleNumber(nums: List[int]) -> int:
    res = 0
    for x in nums:
        res ^= x
    return res

# lowbit:取最低位的 1
def lowbit(x: int) -> int:
    return x & (-x)`,
      },
    ],
  },

  // ── 循环排序 ──
  cyclicsort: {
    templates: [
      {
        zh: '循环排序(原地归位)', en: 'Cyclic Sort',
        code: `# 核心:数值 v 应该放在索引 v-1(或 v)上,不断交换归位
# 找到所有消失的数字(1..n)
def findDisappearedNumbers(nums: List[int]) -> List[int]:
    i, n = 0, len(nums)
    while i < n:
        j = nums[i] - 1              # nums[i] 应在的索引
        if nums[i] != nums[j]:
            nums[i], nums[j] = nums[j], nums[i]  # 归位
        else:
            i += 1
    # 归位后,索引 i 上不是 i+1 的位置即缺失
    return [i + 1 for i in range(n) if nums[i] != i + 1]

# 缺失的第一个正数(O(1) 空间)
def firstMissingPositive(nums: List[int]) -> int:
    n = len(nums)
    i = 0
    while i < n:
        v = nums[i]
        if 1 <= v <= n and nums[v - 1] != v:
            nums[i], nums[v - 1] = nums[v - 1], nums[i]
        else:
            i += 1
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1`,
      },
    ],
  },

  // ── 几何 ──
  geometry: {
    templates: [
      {
        zh: '常用几何工具(叉积 / 共线 / 距离)', en: 'Geometry Toolbox',
        code: `# 叉积:判断方向(>0 逆时针, <0 顺时针, =0 共线)
def cross(o, a, b) -> int:
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

# 判断点是否共线:用叉积避免除法精度问题
def checkStraightLine(coords: List[List[int]]) -> bool:
    p0, p1 = coords[0], coords[1]
    return all(cross(p0, p1, p) == 0 for p in coords[2:])

# 两点距离平方(比较距离时避免开方)
def dist2(a, b) -> int:
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

# 矩形重叠:反向思考,不重叠只有四种情况
def isRectangleOverlap(r1, r2) -> bool:
    return not (r1[2] <= r2[0] or  # r1 在左
                r1[0] >= r2[2] or  # r1 在右
                r1[3] <= r2[1] or  # r1 在下
                r1[1] >= r2[3])    # r1 在上`,
      },
    ],
  },
}
