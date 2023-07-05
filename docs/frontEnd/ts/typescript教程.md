
# 简介

TypeScript是微软开发的一个开源的编程语言，通过在JavaScript的基础上添加静态类型定义构建而成。TypeScript通过

TypeScript编译器或Babel转译为JavaScript代码，可运行在任何浏览器，任何操作系统。

TypeScript 是 JavaScript 的一个超集，支持 ECMAScript 6 标准（[ES6 教程](https://www.runoob.com/w3cnote/es6-tutorial.html)）。

TypeScript 起源于使用JavaScript开发的大型项目 。由于JavaScript语言本身的局限性，难以胜任和维护大型项目开发。因此微软开发了TypeScript ，使得其能够胜任开发大型项目。

# 安装

```shell
npm i -g typescript
```



# hello world

创建ts文件test.ts

```ts
const hello : string = "Hello World!"
console.log(hello)
```

浏览器和node不能直接运行ts文件，需要将ts文件编译成js文件后运行

命令行执行  tsc test.ts  编译ts文件后会生成 test.js，然后使用node运行test.js

```shell
tsc test.ts
node test.js
```

监听文件变化自动编译 -w

```
tsc test.ts  -w
```

**监听整个文件夹的文件变化，自动编译**

在文件夹下创建 tsconfig.json 配置文件

执行 tsc -w

tsconfig.json

```json
{
  /* 可以写注释 */
  // include 用来指定那些ts文件需要被编译
  "include": [
    // src文件夹下任意目录 任意文件
    // ** 任意目录，* 任意文件
    "./src/**/*"
  ],
  // exclude 用来指定那些ts文件不需要被编译
  // 默认值： ["node_modules", "bower_components", "jspm_packages"]
  "exclude": [
    "./src/hello/**/*"
  ],
  // 定义被继承的配置文件
  "extends": "./configs/base",
  // files 用来指定那些ts文件需要被编译
  "files": [
    "xxx.ts",
    "xxxx.ts"
  ],
  // compilerOptions 编译器的选项
  "compilerOptions": {
    // target 用来指定 ts 被编译为 ES的版本
    "target": "ES6",
    // module 用来指定使用模块化的规范
    "module": "ES6",
    // lib 用来指定项目中使用的库 （一般情况不需要设置）
    // "lib": ["DOM"]
    // outDir 用来指定编译后文件所在的目录
    "outDir": "./dist",
    // outFile 文件编译后合并到一个文件
    // 如果使用 outFile, module 必须使用 'amd' 或 'system'
    "outFile": "./dist/app.js",
    // 是否对 js 文件进行编译
    "allowJs": false,
    // 检查 js 文件是否符合 ts 规范
    "checkJs": false,
    // 编译后是否移除注释
    "removeComments": false,
    // 不生成编译后的文件
    "noEmit": false,
    // 当有错误时不生成编译后的文件
    "noEmitOnError": false
    // 所有严格检查的总开关
    "strict": true 
  }
}
```

# ts中的类型

| 类型                  | 例子              | 描述                                    |
| --------------------- | ----------------- | --------------------------------------- |
| number                | 1,-33,2.5         | 任意数字                                |
| string                | "hello world"     | 任意字符串                              |
| boolean               | true、false       | 布尔值                                  |
| any                   | *                 | 任意类型                                |
| unknown               | *                 | 未知类型，安全的an                      |
| void                  | 空值（undefined） | 没有值或undefined                       |
| never                 | 没有值            | 不能是任何值                            |
| object                | {name: "abc"}     | 任意的js对象                            |
| array                 | [1,2,3]           | 任意的js数组                            |
| tuple                 | [4,5]             | 元组，固定长度的数组                    |
| enum                  | enum{A,B}         | 枚举                                    |
| 字面量                | 其本身            | 限制变量的值就是该字面量的值            |
| Record<string,number> | {name: "abc"}     | 定义键值对的对象，object 已弃用请使用它 |

```ts
// 声明a并指定类型为number
let a: number;
// 声明b并指定类型为boolean并赋值
let b: boolean = false;
// 声明时直接赋值，会自动指定类型
let c = "hello"

// 声明数组类型
// 在元素类型后面加上[]
let arr: number[] = [1, 2];  
// 或者使用数组泛型
let arr: Array<number> = [1, 2];

// 函数形参指定类型（参数类型传错、参数传多传少都会报错）
// 函数返回值指定类型
function sum(a: number, b: number): number{
  return a + b;
}

// any 表示任意类型，可以赋值给其他类型，且被赋值的类型也会变成any，所以不推荐使用
let a:any = 1;
let b:string;
// 赋值后b的类型也会变成any
b = a;

// unknown 表示未知类型，在之后的赋值时确定类型
let e:unknown;
e = 10;
e = "hello";
e = true
let s:string;
// unknown不可以直接赋值给其他类型
s = e
// 可以使用类型断言来赋值，类型断言来告诉解析器变量的实际类型
// 类型断言的两种方法 as、<type>
s = e as string;
s = <string>e;

// 类型也可以指定多个，以下表示number或string或boolean类型
let a: number | string | boolean
// b 只能赋值成 male 或 female
let b: "male" | "female";
b = "male";
b = "female";
// 字面量,  a只能被赋值成 10
let a: 10;
a = 10;
```

# 类和对象

### 创建类

```ts
class Person{
    // 直接定义的是实例属性，创建对象可以调用
    name:string = '小明';
    // static 静态属性，使用类名直接调用
    static age:number = 18;
    // readonly 只读属性，不能修改
    readonly job:string = '程序员';
    // 定义方法
    sayHello(){
        console.log("Hello");
    }
}
const p1 = new Person()
// 访问成员变量
p1.name
// 访问类变量
Person.age
```

### 构造函数

```ts
class Dog{
    name:string;
    age:number;
    // constructor构造函数
    constructor(name:string, age:number){
        this.name = name;
        this.age = age
    }
}

const = dog1 = new Dog("小白", 4)
const = dog1 = new Dog("小黑", 4)
```

### 继承

子类继承父类所有方法和属性

extends 继承

super 代表父类

```ts
class Animal{
    name: string;
    age: number;
    constructor(name:string, age:number){
        this.name = name;
        this.age = age
    }
    sayHello(){
        console.log("动物在叫")
    }
}

// 使用extends 让 Dog 继承 Animal
class Dog extends Animal{
    // 子类自己扩展的方法
    run(){
        console.log(`${this.name}在跑~~`)
    }
}

const = dog = new Dog("小白", 4)
// 调用父类方法
dog.sayHello()
// 调用自己方法
dog.run()

// 使用extends 让 Cat 继承 Animal
class Cat extends Animal{
    kind: string;
    // 如果在子类中写了构造函数，父类构造函数就不会执行
    constructor(name:string, age:number, kind:string){
        // super() 手动调用父类的构造函数
        super(name, age);
        this.kind = kind
    }
    // 重写父类方法
    sayHello(){
        console.log("喵喵喵～")
        // 调用父类的 sayHello
        super.sayHello();
    }
}

const = cat = new Dog("咪咪", 3)
cat.sayHello()
```

# 抽象类

以 abstract 开头的类是抽象类

抽象类不能创建对象，是专门被继承的

抽象类可以添加抽象方法

以 abstract 开头的方法是抽象方法，抽象方法没有方法体且只能定义在抽象类中。

抽象类的子类必须实现全部的抽象方法，否则该子类也必须是抽象类

```ts
// 定义抽象类
abstract class Animal{
    name: string;
    age: number;
    constructor(name:string, age:number){
        this.name = name;
        this.age = age
    }
  	// 定义抽象方法
    abstract sayHello():void;
}

// 使用extends 让 Dog 继承 Animal
class Dog extends Animal{
  	// 实现抽象类的全部抽象方法
    sayHello(){
        console.log("汪汪汪")
    }
}

const = dog = new Dog("小白", 4)
dog.sayHello()
```

# 接口

接口用来定义一个类的结构,定义一个类中应该包含哪些属性和方法

inteface 定义接口

implements 实现接口

```ts
inteface myInteface {
    name: string;
    age: number;
}
// 接口可以定义多个同名的，最终的结构是所有接口加一起
inteface myInteface {
    gender: string;
    // 接口中所有的方法都是抽象方法
    sayHello():void;
}

// 使用接口
class MyClass implements myInteface{
  	// 实现接口的类必须包含实现接口所有的属性方法
    name: string;
    age: number;
    gender: string;
    
    sayHello(){
        console.log("hello")
    };
  
    constructor(name:string, age:number, gender:string){
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
}

```

接口也可以规定对象包含的值和类型

```ts
// 定义接口
inteface MyType {
	name: string,
  age: number
}
// 使用类型
let a: MyType;
// 实现接口（a中只能包含name和age两个属性，且nage必须为string类型age必须为number类型）
a = {
  name: '玛尔扎哈',
  age: 1000
}
// 定义一个myType的数组类型
let a: Array<MyType>;
a= [{
  name: '玛尔扎哈',
  age: 1000
},{
  name: '古力娜扎',
  age: 18
}]
```

# 属性的封装

### 修饰符

public 默认值，可以在任意位置访问修改

private 私有属性，只能在类内部访问修改

protected 受保护的属性，只能本类和子类使用

```ts
class MyClass{
    private name: string;
    private age: number;
    
    constructor(name:string, age:number){
        this.name = name;
        this.age = age;
    }
    
    // 暴露 get set 方法用来修改私有属性
    getAge(){
        return this.age;
    }
    // 设置年龄可以加判断是否大于0
    setAge(age:number){
        if(age>=0){
            this.age= age;
        }
    }
}

const myclass = new MyClass()
myclass.getAge()
myclass.setAge(10)
```

### readonly vs const

readonly 只读属性，属性不能被修改

const 定义常量

最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 const，若做为属性则使用readonly。

### ts中的 getter 和 setter

```ts
class MyClass{
    private _name: string;
    private _age: number;
    
    constructor(name:string, age:number){
        this._name = name;
        this._age = age;
    }
    
    // 暴露 get set 方法用来修改私有属性
    get age(){
        return this._age;
    }
    // 设置年龄可以加判断是否大于0
    set age(age:number){
        if(age>=0){
            this._age= age;
        }
    }
}

const myclass = new MyClass()
// 访问 age 时其实就是访问 get set 方法
console.log(myclass.age)
myclass.age = 10
```

# 泛型

在定义函数或类，如果类型不明确就可以使用泛型

```ts
// 定义一个泛型函数
function fn<K>(a: K): K{
    return a;
}
// 直接调用有泛型的函数，ts会自动推断类型
let result = fn(10);
// 指定泛型类型
let result2 = fn<string>('hello');

// 泛型可以同时指定多个
function fn2<T, K>(a:T, b:K):T {
  console.log(b);
  return a;
}
fn2<number, string>(123, 'hello')

// 定义一个接口
interface Inter {
  lenght: number;
}
// 泛型继承接口,表示泛型T必须实现Inter
function fn3<T extends Inter><a:T>:number {
   return a.lenght                    
}
```

泛型类

```ts
class MyClass<T> {
	name: T;
  constructor(name: T) {
    this.name = name
  }
}
const mc = new MyClass<string>('myName')
```

