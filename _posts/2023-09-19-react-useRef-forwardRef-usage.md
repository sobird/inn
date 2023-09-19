---
layout: post
title: React中useRef和forwardRef的使用
date: 2023-09-20 00:00 +0800
---

<script crossorigin src="https://www.unpkg.com/react@18.2.0/umd/react.development.js"></script>
<script crossorigin src="https://www.unpkg.com/react-dom@18.2.0/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<div id="root"></div>

<script type="text/babel">
  // 子组件
  class ChildClass extends React.Component {
    constructor() {
      super()
    }

    render() {
      return (
        <div className="child">
          <h2>类子组件</h2>
        </div>
      )
    }
  }

  const ChildFunction = (props, ref) => {
    
    const inputRef = ref.current === null ? ref : React.useRef();
    // const inputRef = React.createRef(); // 也可以

    const onClick = () => {
      inputRef.current.focus();
    }

    return (
      <div className="child">
        <h2>函数子组件</h2>
        <input type="text" ref={inputRef}/>
        <button onClick={onClick}>聚焦</button>
      </div>
    ) 
  };

  const ChildFunctionForwardRef = React.forwardRef(ChildFunction);

  class App extends React.Component {
    constructor() {
      super()
      this.state = {
        count: 1
      }
    }

    // 方式二
    inputRef2 = React.createRef();
    childFunctionRef = React.createRef();
    childFunctionForwardRef = React.createRef();

    onClick1 = () => {
      this.inputRef1.focus();
    }

    onClick2 = () => {
      this.inputRef2.current.focus();
    }

    onClick3 = () => {
      // 输出为null 函数组件不能绑定ref
      console.log(this.childFunctionRef)
    }

    onClick4 = () => {
      // 通过forwardRef透传子组件的ref
      this.childFunctionForwardRef.current.focus();
    }

    render() {
      const { count } = this.state;
      return (
        <>
          <input type="text" value={count} ref={ ref => { this.inputRef1 = ref; }}/>
          <input type="text" value={count} ref={ this.inputRef2 }/>
          <button onClick={() => this.setState({count: count + 1})}>自增</button>
          <button onClick={this.onClick1}>聚焦1</button>
          <button onClick={this.onClick2}>聚焦2</button>
          
          <ChildClass />
          <ChildFunction ref={this.childFunctionRef} />
          <button onClick={this.onClick3}>父按钮1</button>
          <ChildFunctionForwardRef ref={this.childFunctionForwardRef}/>
          <button onClick={this.onClick4}>父按钮2</button>
        </>
      )
    }
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>


