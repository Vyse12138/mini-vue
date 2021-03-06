function h(tag, props, children) {
  return {
    tag,
    props,
    children
  };
}

function mount(vnode, container) {
  vnode.el = document.createElement(vnode.tag); // 根据 tag 创建节点
  if (vnode.props) {
    // 取得所有 props（包括 attributes，properties，eventListeners）
    for (const key in vnode.props) {
      const value = vnode.props[key]; // 取得其对应的值
      vnode.el.setAttribute(key, value); // 假设所有 props 都是 attribute（html 标签属性如 id）
    }
  }
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      vnode.el.textContent = vnode.children;
    } else {
      vnode.children.forEach(child => {
        mount(child, vnode.el);
      });
    }
  }
  container.appendChild(vnode.el); // 将节点加入其父组件中
}

// 比较新旧虚拟 DOM 并更新 DOM，n1 为旧，n2 为新
function patch(n1, n2) {
  const el = (n2.el = n1.el); // 将旧的 el 保存进入新的 el 中

  if (n1.tag === n2.tag) {
    // 在标签相同时

    // 处理 props 部分（包括 attributes，properties，eventListeners）
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // 更新 props
    for (const key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (newValue !== oldValue) {
        el.setAttribute(key, newValue);
      }
    }
    // 删除 props
    for (const key in oldProps) {
      if (!(key in newProps)) {
        el.removeAttribute(key);
      }
    }

    // 处理 childern 部分
    const oldChildren = n1.children;
    const newChildren = n2.children;
    if (typeof newChildren === "string") {
      if (typeof oldChildren === "string") {
        if (newChildren !== oldChildren) {
          //且字符串相同时
          el.textContent = newChildren;
        } else {
          // 若不是字符串则直接改写
          el.textContent = newChildren;
        }
      } else {
        // 若新 children 不是字符串
        if (typeof oldChildren === "string") {
          // 若旧 children 是字符串，则清除它，并 mount 新 children
          el.innerHTML = "";
          newChildren.forEach(child => {
            mount(child, el);
          });
        }
      }
    } else {
      // 若旧 children 不是字符串，则将其与新 children 进行比较

      const commonLength = Math.min(oldChildren.length, newChildren.length);
      for (let i = 0; i < commonLength; i++) {
        patch(oldChildren[i], newChildren[i]); // 对共同部分进行 patch
      }
      if (newChildren.length > oldChildren.length) {
        newchildren.slice(oldChildren.length).forEach(child => {
          mount(child, el); // mount 多余部分
        });
      } else if (newChildren.length < oldChildren.length) {
        oldChildren.slice(newchildren.length).forEach(child => {
          el.removeChild(child); // 移除多余部分
        });
      }
    }
  } else {
    // 标签不同时
    el.innerHTML = "";
    mount(n2, el);
  }
}

export { h, mount, patch };
