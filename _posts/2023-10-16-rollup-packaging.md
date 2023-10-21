---
layout: post
title: 用 Rollup 进行打包(组件库)
date: 2023-10-16 21:36 +0800
---

## 支持打包的文件格式

* amd - 异步模块加载，适用于 RequireJS 等模块加载器 支持浏览器
* cjs – CommonJS，适用于 Node 环境和其他打包工具（别名：commonjs）不支持浏览器
* es – 将 bundle 保留为 ES 模块文件，适用于其他打包工具，以及支持 <script type=module> 标签的浏览器。（别名：esm，module）
* iife – 自执行函数，适用于 <script> 标签。iife 表示“自执行 函数表达式”
* umd – 通用模块定义规范，同时支持 amd，cjs 和 iife
* system – SystemJS 模块加载器的原生格式（别名：systemjs）

其中，amd 为 AMD 模块标准，cjs 为 CommonJS 模块标准，esm\es 为 ES 模块标准，iife 为立即调用函数，umd 同时支持 amd、cjs 和 iife。

## 插件

### @rollup/plugin-typescript

```ts
import typescript from '@rollup/plugin-typescript';

export default {
  plugins: [typescript({ compilerOptions: {lib: ["es5", "es6", "dom"], target: "es5"}})]
};
```

### rollup-plugin-typescript2
> 跟上面插件一样 编译速度慢一些
```ts
import typescript from 'rollup-plugin-typescript2';

export default {

  plugins: [
    typescript(/*{ plugin options }*/)
  ]
}
```

### rollup-plugin-esbuild
> 该插件可以用来替换 rollup/plugin-replace, rollup-plugin-typescript2, @rollup/plugin-typescript 和 rollup-plugin-terser 等

```ts
import esbuild from 'rollup-plugin-esbuild'

export default {
  plugins: [
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      minify: process.env.NODE_ENV === 'production',
      target: 'es2017', // default, or 'es20XX', 'esnext'
      jsx: 'transform', // default, or 'preserve'
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      // Like @rollup/plugin-replace
      define: {
        __VERSION__: '"x.y.z"',
      },
      tsconfig: 'tsconfig.json', // default
      // Add extra loaders
      loaders: {
        // Add .json files support
        // require @rollup/plugin-commonjs
        '.json': 'json',
        // Enable JSX in .js files too
        '.js': 'jsx',
      },
    }),
  ],
}
```

### @rollup/plugin-node-resolve
> 让 rollup 能够处理外部依赖。用于使用 node_modules 中的第三方模块

```ts
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [
    nodeResolve()
  ]
};
```

### rollup-plugin-peer-deps-external
> 自动将 peerDependencies(也支持dependencies) 中的模块声明为 externals。

```ts
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
 
export default {
  plugins: [
    // Preferably set as first plugin.
    peerDepsExternal({
      packageJsonPath: 'my/folder/package.json'
      includeDependencies: true,
    }),
  ],
}
```

### rollup-plugin-node-externals
> 自动将 node 内建模块 声明为externals，同时也支持dependencies。

```ts
import nodeExternals from 'rollup-plugin-node-externals'

export default {
  ...
  plugins: [
    nodeExternals({

      // Make node builtins external. Default: true.
      builtins?: boolean

      // node: prefix handing for importing Node builtins. Default: 'add'.
      builtinsPrefix?: 'add' | 'strip' | 'ignore'

      // The path(s) to your package.json. See below for default.
      packagePath?: string | string[]

      // Make pkg.dependencies external. Default: true.
      deps?: boolean

      // Make pkg.devDependencies external. Default: false.
      devDeps?: boolean

      // Make pkg.peerDependencies external. Default: true.
      peerDeps?: boolean

      // Make pkg.optionalDependencies external. Default: true.
      optDeps?: boolean

      // Modules to force include in externals. Default: [].
      include?: string | RegExp | (string | RegExp)[]

      // Modules to force exclude from externals. Default: [].
      exclude?: string | RegExp | (string | RegExp)[]
    })
  ]
}
```

### @rollup/plugin-commonjs
> 转换CommonJS模块为 ES6， 让你能在项目里导入 commonjs 格式的文件/模块

```ts
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [commonjs()]
};
```

### @rollup/plugin-babel
> 通过 Babel 能将你所写的 es6/es7 代码编译转换为 es5 ，以适用那些更古老的浏览器

```ts
import { babel } from '@rollup/plugin-babel';

export default {
  plugins: [babel({
    babelHelpers: 'bundled',
    presets: ['@babel/preset-env'],
    // 禁止使用本地.babelrc文件配置
    babelrc: false,
    // 注意配置 文件后缀，否则该插件匹配不到相应的文件后缀
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
  })]
};
```

```ts
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ]
}
```

### rollup-plugin-postcss
>默认集成了对 css、scss、less、stylus 的支持。

需要安装 postcss 以及对应的样式支持(sass, less等)

```ts
import postcss from 'rollup-plugin-postcss'

export default {
  plugins: [
    postcss({
      plugins: []
    })
  ]
}
```

### autoprefixer
> 给css 加前缀

新建 .browserslistrc 添加如下：

```
> 0.25%
not dead
ie 10
chrome 45
ios 9
android 4.4
```

或者 添加到 package.json 文件中的 browserslist 字段中

```ts
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    postcss({
      plugins: [autoprefixer()]
    })
  ]
}
```

### postcss-preset-env
> 该插件预设了polyfills和Autoprefixer插件

新建 postcss.config.js 文件

```ts
module.exports = {
  // Add you postcss configuration here
  plugins: [require("postcss-preset-env")],
};
```
可以替换掉上面 autoprefixer 插件方式

### cssnano

```ts
// postcss.config.js

module.exports = {
  // Add you postcss configuration here
  plugins: [require("cssnano")],
};
```

### postcss-csso
> 基于 csso 压缩

```ts
// postcss.config.js

module.exports = {
  // Add you postcss configuration here
  plugins: [require("postcss-csso")],
};
```

### @rollup/plugin-image
> 用于处理导入JPG、PNG、GIF、SVG和WebP文件

```ts
import image from '@rollup/plugin-image';

export default {
  plugins: [image()]
};
```

### @rollup/plugin-json
> 用于处理导入的JSON文件

```ts
import json from '@rollup/plugin-json';

export default {
  plugins: [json()]
};
```

### rollup-plugin-copy
> 基于glob匹配规则，拷贝文件和目录

```ts
import copy from 'rollup-plugin-copy'

export default {
  plugins: [
    copy({
      targets: [
        { src: 'src/index.html', dest: 'dist/public' },
        { src: ['assets/fonts/arial.woff', 'assets/fonts/arial.woff2'], dest: 'dist/public/fonts' },
        { src: 'assets/images/**/*', dest: 'dist/public/images' }
      ]
    })
  ]
}
```


### @rollup/plugin-strip
> 用于从代码中删除debugger语句和函数，如assert.equal和console.log

```ts
import strip from '@rollup/plugin-strip';

export default {
  plugins: [
    strip({
      labels: ['unittest']
    })
  ]
};
```

### rollup-plugin-clear
> 清理 dist

```ts
import clear from 'rollup-plugin-clear'
 
export default  {
  plugins: [
    clear({
      // required, point out which directories should be clear.
      targets: ['some directory'],
      // optional, whether clear the directores when rollup recompile on --watch mode.
      watch: true, // default: false
    })
  ]
}
```

### @rollup/plugin-replace
> 替换打包文件中的目标字符串

```ts
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __buildDate__: () => JSON.stringify(new Date()),
      __buildVersion: 15
    })
  ]
};
```

### @rollup/plugin-alias
> 可以让你在开始时使用别名来导入文件

```ts
import alias from '@rollup/plugin-alias';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: './src' },
      ]
    })
  ]
};
```
