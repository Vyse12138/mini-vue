function h(tag, props, children) {
  return {
    tag,
    props,
    children
  };
}

function mount(vnode, container) {
  const el = document.createElement(vnode.tag); // 根据 tag 创建节点

  if (vnode.props) {
    // 取得所有 props（包括 attributes，properties，eventListeners）
    for (const key in vnode.props) {
      const value = vnode.props[key]; // 取得其对应的值
      el.setAttribute(key, value); // 假设所有 props 都是 attribute（html 标签属性如 id）
    }
  }
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach(child => {
        mount(child, el);
      });
    }
  }

  container.appendChild(el); // 将节点加入其父组件中
}

const vdom = h("div", { id: "asd" }, [h("span", { class: "aa" }, "hello")]);

mount(vdom, document.getElementById("app"));
