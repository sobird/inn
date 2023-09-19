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
        num:1
      }
    }
    add=()=> {
      this.setState({
        num: this.state.num + 1
      })
    }
    render() {
      return <button onClick={this.add}  >
        {this.state.num}
      </button>
    }
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>


