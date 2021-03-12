# 二叉树相关算法

## 生成二叉树
```
function Node(value, left = null, right = null) {
  this.value = value
  this.left = left
  this.right = right
}
function insert(value) {
  if (this.root === null) {
    this.root = new Node(value)
  } else {
    let currentNode = this.root
    while(true) {
      if (value < current.value) {
        if (current.left) {
          currentNode = current.left
        } else {
          current.left = new Node(value)
          break
        }
      } else {
        if (current.right) {
          currentNode = current.right
        } else {
          current.right = new Node(value)
          break
        }
      }
    }
  }
}
function BST() {
  this.root = null
  this.insert = insert
}

const tree = new BST()
tree.insert(50)
tree.insert(30)
tree.insert(23)
tree.insert(35)
tree.insert(89)
tree.insert(66)
tree.insert(1)
tree.insert(3)
tree.insert(98)
tree.insert(78)
tree.insert(22)
tree.insert(56)
```

## 二叉树最大宽度
思路：利用广度优先搜索，栈的数据结构，在node栈出的时候，入栈它的左节点或右节点
```
function getMaxLevel(root) {
  let maxLevelNodes = []
  const stack = [root]

  while(stack.length) {
    const levelNodes = []
    let stackLength = stack.length

    while (stackLength) {
      const top = stack.pop()
      levelNodes.push(top.value)

      if (top.left) stack.unshift(top.left)
      if (top.right) stack.unshift(top.right)

      stackLength--
    }

    if (levelNodes.length > maxLevelNodes.length) maxLevelNodes = levelNodes
  }

  return maxLevelNodes
}
```

## 二叉树最大深度
思路：深度优先搜索，广度优先搜索

1. 深度优先搜索
```
function getMaxDepth(node) {
  if (node === null) return 0

  return Math.max(getMaxDepth(node.left), getMaxDepth(node.right)) + 1
}
console.log(getMaxDepth(tree.root))
```

2. 广度优先然后获取length
```
function getMaxDepthByLevel(root) {
  const treeLevelNodes = []
  const stack = [root]

  while (stack.length) {
    const levelNodes = []
    let { length } = stack
    
    while (length) {
      const top = stack.pop()
      levelNodes.push(top.value)

      if (top.left) stack.unshift(top.left)
      if (top.right) stack.unshift(top.right)

      length--
    }
    treeLevelNodes.push(levelNodes)
  }

  return treeLevelNodes.length
}
```

## 二叉树到某个节点的路径
```
function getPath(tree, targetValue) {
  function createPath(node) {
     if (node !== null) {
       if (node.value === targetValue) return [node.value]
       const leftPath = createPath(node.left)
       const rightPath = createPath(node.right)
       if (leftPath.length) return leftPath.concat([node.value])
       if (rightPath.length) return leftPath.concat([node.value])
     }
     return []
  }

  return createPath(tree.root)
}
```

## 二叉树最长路径的节点
思路：
1. 先利用广度优先遍历出节点树的层级，取层级数组的最后一个就是最长路径的节点组成，取里面的节点，确定最长路径的节点的值
2. 利用上面二叉树获取对应节点路径的方法来生成最长节点的数组
```
const levelNodes = getMaxDepthByLevel(tree.root)
const maxNode = levelNodes[levelNodes.length - 1][0]

const path = getPath(tree, maxNode)
console.log(path)
```

## 二叉树两个节点的最近公共父节点
思路：
1. 分别获取两个节点的PathNode的组成
2. 然后由最短组成作为遍历的基本值 倒序遍历 查看节点在长的PathNode中是否存在 存在即是最近父节点

```
function getMinParent(tree, target1, target2) {
  const nodesPath1 = getPath(tree, targe1)
  const nodesPath2 = getPath(tree, targe2)
  const minPath = nodesPath1.length < nodesPath2.length ? nodesPath1 : nodesPath2
  const maxPath = nodesPath1.length < nodesPath2.length ? nodesPath2 : nodesPath1

  for (let i = 0; i < minPath.length; i++) {
    const current = minPath[i]
    if (maxPath.includes(current)) {
      return current
    }
  }
  return null
}
```

## 二叉树翻转
思路：深度优先搜索，将每个节点的左右节点进行赋值翻转

```
function reverseTree(node) {
  if (node !== null) {
    const cache = node.left
    node.left = node.right
    node.right = cache
    reverseTree(node.left)
    reverseTree(node.right)
  }
}
console.log(reverseTree(tree.root))
```

## 判断是否为对称二叉树
```
function judgeTree(tree1, tree2) {
  function judge(node1, node2) {
    if (node1 === null && node2 === null) return true
    if (node1 === null || node2 === null) return false
    return node1.value === node2.value && judge(node1.left, node2.right) && judge(node1.right, node2.left)
  }

  return judge(tree1.root, tree2.root)
}
```

## 先序遍历
```
function preOrder(node) {
  const result = []
  if (node !== null) {
    result.push(node.value)
    Array.prototype.push.apply(result, preOrder(node.left))
    Array.prototype.push.apply(result, preOrder(node.right))
  }
  return result
}
console.log(preOrder(tree.root))
```

## 中序遍历
```
function middleOrder(node) {
  const result = []
  if (node !== null) {
    Array.prototype.push.apply(result, middleOrder(node.left))
    result.push(node.value)
    Array.prototype.push.apply(result, middleOrder(node.right))
  }
  return result
}
```

## 后序遍历
```
function postOrder(node) {
  const result = []
  if (node !== null) {
    Array.prototype.push.apply(result, postOrder(node.left))
    Array.prototype.push.apply(result, postOrder(node.right))
    result.push(node.value)
  }
  return result
}
```

