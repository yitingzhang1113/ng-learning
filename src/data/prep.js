// ============================================================================
//  System Design(系统设计 / HLD)和 OOD(面向对象设计 / LLD)清单。
//  这两类是开放式面试题,没有 LeetCode 链接,重点是自己整理笔记 + 代码 + 讲解视频。
//  加一题:往对应数组里加 { id, en, zh },id 保持唯一(用来存笔记/状态)。
// ============================================================================

// 系统设计(高层架构设计)
export const SYSTEM_DESIGN = [
  { id: 'url-shortener', en: 'Design a URL Shortener (TinyURL)', zh: '设计短链接系统' },
  { id: 'twitter-feed', en: 'Design Twitter / News Feed', zh: '设计推特 / 信息流' },
  { id: 'rate-limiter', en: 'Design a Rate Limiter', zh: '设计限流器' },
  { id: 'chat-system', en: 'Design a Chat System (WhatsApp)', zh: '设计聊天系统' },
  { id: 'instagram', en: 'Design Instagram', zh: '设计 Instagram' },
  { id: 'youtube', en: 'Design YouTube / Video Streaming', zh: '设计视频点播系统' },
  { id: 'web-crawler', en: 'Design a Web Crawler', zh: '设计网络爬虫' },
  { id: 'kv-store', en: 'Design a Distributed Key-Value Store', zh: '设计分布式 KV 存储' },
  { id: 'notification', en: 'Design a Notification System', zh: '设计通知系统' },
  { id: 'autocomplete', en: 'Design Search Autocomplete / Typeahead', zh: '设计搜索自动补全' },
  { id: 'uber', en: 'Design Uber / Ride-Sharing', zh: '设计打车系统' },
  { id: 'ticketmaster', en: 'Design a Ticket Booking System', zh: '设计票务预订系统' },
]

// OOD 模块介绍(概念卡内容,页面顶部渲染)
export const OOD_INTRO = {
  video: 'https://www.youtube.com/watch?v=hI0sdGc31vI&list=PLbaIOC0vpjNVQEfKGHmU6rqZhcwnnm3jT&index=1',
  videoTitle: '参考视频:OOD 入门(第 1 集)',
  concepts: [
    { name: 'Encapsulation 封装', text: '每个类就像一个胶囊(capsule),装着它需要的一切,不多不少。' },
    { name: 'Inheritance 继承', text: '把特征和行为从父类传给子类(passing down traits from parent to child)。' },
    { name: 'Polymorphism 多态', text: '同一接口,多种形态(multiple shapes or forms)。' },
    { name: 'Abstraction 抽象', text: '封装的自然延伸:隐藏内部实现细节,只暴露对其他对象有用的操作,降低大系统里对象间交互的复杂度。' },
  ],
  steps: [
    { n: '1', en: 'Clarify requirement', zh: '问清楚哪些是必须的,哪些可以不用考虑' },
    { n: '2', en: 'Define class (core object)', zh: '整个题目中一共会出现哪些类?' },
    { n: '3', en: 'Define field (properties)', zh: '每个类有哪些 field?' },
    { n: '4', en: 'Define method, how data flow works', zh: '类与类之间如何交互?(inheritance 为了好扩展 + abstraction)' },
    { divider: '======== 以上只写定义,不写实现 (no implementation, only definition) ========' },
    { n: '5', en: 'Implement 核心关键 method', zh: '只实现最核心的方法' },
    { n: '6', en: 'Optimize with design pattern', zh: '炫技时间,trade off show time —— 锦上添花,不写也可以过' },
  ],
  compare: {
    cols: ['', '面向对象设计 OOD', '系统设计 System Design'],
    rows: [
      ['面试者', '应届毕业生,SDE1-', '有经验的面试者,SDE1+'],
      ['出题目的', '常被当做考察综合素质的标准', '需要处理大量数据、提供 service 的部门'],
      ['常见公司', 'Amazon, Bloomberg…', 'Facebook, Google…'],
      ['关键字', 'Viability', 'Scalability'],
      ['例题', 'Design Elevator System', 'Design Twitter'],
    ],
  },
  keys: [
    'OOD 是亚麻 SDE1 onsite 的必考题目。',
    '面试不一定要画图,也不一定要把 code 写完整,但一定要把 code 的框架定义好 —— 以 code 的形式呈现。',
    '核心两点:① class, field and method;② 如何扩展 —— inheritance,将来有新的 object 好不好加。',
  ],

  // ── Python 类语法要点(浓缩自官方教程 docs.python.org/3/tutorial/classes.html)──
  pyDocUrl: 'https://docs.python.org/3/tutorial/classes.html',
  pySyntax: [
    { name: '__init__ 与 self', text: '__init__ 是构造函数;self 代表实例本身,必须显式写成方法的第一个参数。' },
    { name: '类变量 vs 实例变量', text: '类变量所有实例共享,实例变量各自独立。官方教程特别提醒:可变类型(list/dict)不要当类变量,应放进 __init__,否则所有实例共享同一份。' },
    { name: '继承与 super()', text: 'class Dog(Animal) 继承;子类覆写同名方法即多态;super().__init__() 调父类构造。支持多继承,方法解析顺序(MRO)大体从左到右。' },
    { name: '「私有」只是约定', text: 'Python 没有真私有:_x 表示内部使用;__x 触发名称改写(name mangling)变成 _ClassName__x,防止被子类意外覆盖。' },
    { name: 'isinstance / issubclass', text: '运行时类型检查;但更 Pythonic 的是鸭子类型 —— 关注对象有什么行为,而不是它是什么类型。' },
    { name: '常用装饰器', text: '@classmethod 做工厂构造器(cls 参数)、@staticmethod 放工具方法、@property 把方法伪装成属性;@dataclass 自动生成 __init__/__repr__/__eq__,写 Item(price, tax, qty) 这类数据类首选。' },
  ],
  pyCode: `from dataclasses import dataclass

class Animal:
    count = 0                    # 类变量:所有实例共享(别放可变类型!)

    def __init__(self, name):
        self.name = name         # 实例变量:每个实例独立
        Animal.count += 1

    def speak(self):             # 第一个参数必须是 self
        raise NotImplementedError

class Dog(Animal):               # 继承
    def __init__(self, name, breed):
        super().__init__(name)   # 调用父类构造
        self.breed = breed
        self.__secret = 'bone'   # name mangling -> _Dog__secret

    def speak(self):             # 覆写 = 多态
        return f'{self.name}: Woof!'

    @classmethod
    def from_string(cls, s):     # 工厂构造器:'Rex,Husky' -> Dog
        name, breed = s.split(',')
        return cls(name, breed)

    @property
    def label(self):             # 方法伪装成属性:d.label
        return f'{self.name}({self.breed})'

@dataclass
class Item:                      # 数据类:自动生成 __init__/__repr__/__eq__
    price: float
    tax: float
    quantity: int

d = Dog.from_string('Rex,Husky')
print(isinstance(d, Animal))     # True:运行时类型检查`,

  // ── 高频设计模式(Refactoring Guru,点名字看图解)──
  patternsUrl: 'https://refactoring.guru/design-patterns/python',
  patterns: [
    { name: 'Strategy 策略', url: 'https://refactoring.guru/design-patterns/strategy', text: '把可替换的算法/行为抽成独立类(促销折扣、支付方式),新增类型不改老代码 —— OOD 面试最高频。' },
    { name: 'Factory Method 工厂方法', url: 'https://refactoring.guru/design-patterns/factory-method', text: '把「创建哪个子类」的判断集中到工厂里(如解析 PROMO 字符串 → 返回对应 Discount 对象)。' },
    { name: 'Singleton 单例', url: 'https://refactoring.guru/design-patterns/singleton', text: '全局唯一实例(配置、连接池、日志器)。' },
    { name: 'Observer 观察者', url: 'https://refactoring.guru/design-patterns/observer', text: '一处变化,多方自动收到通知(事件订阅/发布)。' },
    { name: 'Decorator 装饰器', url: 'https://refactoring.guru/design-patterns/decorator', text: '不改原类,动态叠加职责(饮品加料计价)。' },
    { name: 'State 状态', url: 'https://refactoring.guru/design-patterns/state', text: '对象行为随内部状态切换 —— 电梯、自动售货机的标准答案。' },
    { name: 'Template Method 模板方法', url: 'https://refactoring.guru/design-patterns/template-method', text: '父类定算法骨架,子类只填具体步骤。' },
    { name: 'Adapter 适配器', url: 'https://refactoring.guru/design-patterns/adapter', text: '转换接口,让不兼容的旧组件能一起工作。' },
  ],
}

// OOD 真题(自己面试遇到的,desc 是题目描述;新真题可在页面上点 + 添加)
export const OOD_REAL = [
  {
    id: 'amazon-grocery',
    zh: '亚麻真题:购物清单总价计算',
    en: 'Amazon: Grocery Total Price Calculator',
    // parts:每一段有 题目描述 + 思路 + 代码(follow-up 单独一段)
    parts: [
      {
        id: 'main',
        label: { zh: '原题', en: 'Question' },
        desc: 'Create a system to calculate the total price of a list of groceries. Each item in the list has a price, tax and quantity.',
      },
      {
        id: 'followup',
        label: { zh: 'Follow-up:促销折扣解析', en: 'Follow-up: Promo Parsing' },
        desc: '支持促销 discount id —— 把 "PROMO_5_OFF"(固定金额减 $5)或 "PROMO_10_PERCENT"(百分比减 10%)这类字符串解析成「固定金额优惠 / 百分比优惠」及对应数值;格式不合法的促销串按无效促销直接忽略、不报错。',
      },
    ],
  },
  {
    id: 'amazon-pizza',
    zh: '亚麻真题:披萨订购系统',
    en: 'Amazon: Pizza Ordering System',
    parts: [
      {
        id: 'main',
        label: { zh: '原题', en: 'Initial Question' },
        desc: `Design a pizza ordering system.
A pizza has:
· a size (Small / Medium / Large)
· a base/crust
· zero or more toppings
Design the classes so that the system can calculate the total price of a pizza.`,
      },
      {
        id: 'fu1',
        label: { zh: 'Follow-up 1:订单支持多种商品', en: 'Follow-up 1: Multiple Item Types' },
        desc: `Now an order can contain more than just pizzas.
Customers can also order drinks (e.g., Coke) and side dishes (e.g., Wings).
How would you modify your design to support different kinds of items in an order?`,
      },
      {
        id: 'fu2',
        label: { zh: 'Follow-up 2:优惠券', en: 'Follow-up 2: Coupons' },
        desc: `Now we want to support coupons. Coupons can be different types, such as:
· Fixed amount discount (e.g., $5 off)
· Percentage discount (e.g., 20% off)
How would you extend your design?`,
      },
      {
        id: 'fu3',
        label: { zh: 'Follow-up 3:买一送一(BOGO)', en: 'Follow-up 3: BOGO Promotion' },
        desc: `Now we need to support a Buy One Get One Free (BOGO) promotion.
Does your coupon design still work? If not, how would you redesign it?`,
      },
      {
        id: 'fu4',
        label: { zh: 'Follow-up 4:最便宜配料免费', en: 'Follow-up 4: Cheapest Topping Free' },
        desc: `We have a promotion where the cheapest topping is free.
Where would you implement this logic? Would you put it inside the Pizza class or somewhere else?
Explain your design choice.`,
      },
      {
        id: 'fu5',
        label: { zh: 'Follow-up 5:门店差异化定价', en: 'Follow-up 5: Per-Store Pricing' },
        desc: `Now imagine this system is used by a pizza chain.
Different stores may have different prices for the same pizza or topping.
How would you design the system so that pricing can vary by store without changing the core business logic?`,
      },
    ],
  },
  {
    id: 'amazon-locker',
    zh: '亚麻真题:设计 Amazon Locker',
    en: 'Amazon: Design a Locker System',
    // 讲解视频(预置在视频区,直接播放)
    video: 'https://www.youtube.com/watch?v=s6nGkoGJhXk',
    videoTitle: '讲解视频:Amazon Locker',
    parts: [
      {
        id: 'main',
        label: { zh: '原题', en: 'Question' },
        desc: 'Design a locker system like Amazon Locker where delivery drivers can deposit packages and customers can pick them up using a code.',
      },
      {
        id: 'clarify',
        label: { zh: '澄清需求参考(答题第一步)', en: 'Clarify Requirements' },
        desc: `Primary capabilities(核心能力):
· Are there different sized compartments?(柜格有不同尺寸吗?)
· How does the customer get their code? Do we need to send an SMS or email?

Error handling(异常处理):
· Can one customer have multiple packages in the system at once? Are access tokens unique per package?
· How long do the codes last? What happens to a package if it's never picked up?
· What if all compartments of a given size are full when a driver tries to deposit?

Scope boundaries(边界范围):
· What's in scope for this system? Are we modeling the whole delivery flow, or just the piece from when the driver arrives at the locker until the customer picks up?`,
      },
    ],
  },
  {
    id: 'amazon-ide-plugin',
    zh: '亚麻真题:IDE 插件管理系统(偏 L5/L6)',
    en: 'Amazon: IDE Plugin Management System',
    parts: [
      {
        id: 'main',
        label: { zh: '原题 + 功能需求', en: 'Initial Question & Requirements' },
        desc: `Design a plugin management system for an IDE.
The system should allow plugins to be dynamically created, registered, unregistered, and managed.

Supported plugin types(插件类型):
· Syntax Highlighter
· Code Formatter
· Logger
· Debugger

Functional Requirements(功能需求):
· dynamically loading plugins(动态加载)
· registering / unregistering plugins(注册 / 注销)
· enabling / disabling plugins(启用 / 停用)
· querying installed plugins(查询已安装插件)`,
      },
      {
        id: 'fu1',
        label: { zh: 'Follow-up 1:版本管理', en: 'Follow-up 1: Version Management' },
        desc: `Plugins have versions. Multiple versions of the same plugin may exist.
How would you support version management?
How do you determine which version should be loaded?`,
      },
      {
        id: 'fu2',
        label: { zh: 'Follow-up 2:依赖管理', en: 'Follow-up 2: Dependency Management' },
        desc: `Plugins may depend on other plugins. For example:
· Java Formatter depends on Java Syntax Highlighter.
· Debugger depends on Logger.
How would you model plugin dependencies? What happens if a dependency is missing?

进一步可能追问:How would you detect circular dependencies?
(提示:依赖是有向图,装载顺序 = 拓扑排序,循环依赖 = 环检测)`,
      },
      {
        id: 'fu3',
        label: { zh: 'Follow-up 3:事件系统', en: 'Follow-up 3: Event System' },
        desc: `Plugins should be able to receive IDE events, e.g.:
· File Opened / File Saved
· Build Started / Build Finished
Design an event system so plugins can subscribe to IDE events.
Plugins should also be able to communicate with one another through events.

(提示:这里就是考 Observer / Event Bus)`,
      },
      {
        id: 'fu4',
        label: { zh: 'Follow-up 4:动态加载', en: 'Follow-up 4: Dynamic Loading' },
        desc: `Plugins should be loaded dynamically at runtime.
How would you design the loading mechanism?

(提示:通常会引出 PluginLoader / PluginDescriptor / PluginFactory 三件套)`,
      },
      {
        id: 'fu5',
        label: { zh: 'Follow-up 5:插件元数据', en: 'Follow-up 5: Plugin Metadata' },
        desc: `Where would you keep plugin metadata? Such as:
· name / version / author
· dependencies
· supported IDE version`,
      },
    ],
  },
  {
    id: 'amazon-go',
    zh: '亚麻真题:Amazon Go 无人商店',
    en: 'Amazon: Cashierless Store System',
    parts: [
      {
        id: 'main',
        label: { zh: '原题', en: 'Question' },
        desc: `Design an Amazon Go–style cashierless store system.
Customers enter the store using their account, pick up or return products, and leave without going through a traditional checkout.

The system should:
· track customer entry and exit;
· detect product pickup and return events;
· maintain each customer's shopping basket in real time;
· create an order when the customer exits;
· process payment and generate a receipt.

Focus on the object-oriented design, including the main classes, their responsibilities, and interactions.

(说明:这题介于 OOD 和简化版系统设计之间。重点不是设计摄像头识别模型,而是把「顾客进店 → 拿商品 → 放回商品 → 离店 → 自动结账」抽象成对象和职责。)`,
      },
      {
        id: 'classes',
        label: { zh: '参考类清单(实体 + Manager 职责分层)', en: 'Reference Class List' },
        desc: `实体类(Domain Entities):
Customer / Account / Store / Product / InventoryItem
Basket (ShoppingCart) / CartItem
Order / OrderItem
PaymentMethod / Payment / Receipt

职责管理类(Managers / Services):
EntryManager(进出店)
CustomerSessionManager(顾客会话)
ProductEventManager(拿起/放回事件)
BasketManager(实时购物篮)
InventoryManager(库存)
CheckoutManager(离店触发下单)
PaymentProcessor(支付)
ReceiptGenerator(小票)

(提示:实体类只装数据和自身行为,流程逻辑放 Manager;事件流 = ProductEventManager 发事件 → BasketManager 订阅更新,又是 Observer。)`,
      },
    ],
  },
  {
    id: 'amazon-hotel',
    zh: '亚麻真题:酒店管理系统',
    en: 'Amazon: Hotel Management System',
    parts: [
      {
        id: 'main',
        label: { zh: '原题', en: 'Question' },
        desc: `设计一个酒店管理系统的核心模块,需涵盖:
· 房间预订(Booking)
· 入住 / 退房流程(Check-in / Check-out)
· 房价策略(Pricing Strategy)
· 房间实时可用性追踪(Availability Tracking)`,
      },
      {
        id: 'steps',
        label: { zh: '解题步骤参考', en: 'Solution Outline' },
        desc: `① 明确需求:预订、入住/退房、定价、可用性查询

② 核心类(实体):Room / Guest / Booking / Hotel

③ 服务层:预订服务(BookingService)、可用性查询(AvailabilityService)、入住退房(CheckInOutService)、定价策略(PricingStrategy —— 又是 Strategy 模式)

④ 关键流程:预订防超售(对房间加锁 / 原子校验)→ 入住更新房间状态 → 退房释放房间

⑤ 扩展点:多酒店支持、动态定价(旺季/周末)、可用性查询缓存优化、并发控制(锁粒度、乐观锁)`,
      },
    ],
  },
]

// OOD 例题(经典入门题,带讲解视频,点开直接播放)
export const OOD_EXAMPLES = [
  {
    id: 'parking-lot', en: 'Design a Parking Lot', zh: '设计停车场',
    video: 'https://www.youtube.com/watch?v=QqET6h00GE0',
  },
  {
    id: 'elevator', en: 'Design an Elevator System', zh: '设计电梯系统',
    video: 'https://www.youtube.com/watch?v=2oyTjBEJ2CQ&list=PLbaIOC0vpjNVQEfKGHmU6rqZhcwnnm3jT&index=3',
  },
]

// 这两块用作存笔记/状态的「板块 id」
export const SD_ID = 'sysdesign'
export const OOD_ID = 'oodprep'
