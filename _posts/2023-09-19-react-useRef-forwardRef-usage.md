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
  class App extends React.Component {
    constructor() {
      super()
      this.state = {
        count: 1
      }
    }

    // 方式二
    inputRef2 = React.createRef();

    onClick1 = () => {
      this.inputRef1.focus();
    }

    onClick2 = () => {
      this.inputRef2.current.focus();
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
        </>
      )
    }
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>


