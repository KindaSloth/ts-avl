type AvlNode<T> = {
  key: string;
  value: T;
  left: AvlNode<T> | null;
  right: AvlNode<T> | null;
  height: number;
};

class Avl<T> {
  root: AvlNode<T> | null;

  constructor() {
    this.root = null;
  }

  height(node: AvlNode<T> | null): number {
    return node ? node.height : 0;
  }

  private updateHeight(node: AvlNode<T> | null): void {
    if (node) {
      const leftChildHeight = this.height(node?.left || null);
      const rightChildHeight = this.height(node?.right || null);

      node.height = Math.max(leftChildHeight, rightChildHeight) + 1;
    }
  }

  balanceFactor(node: AvlNode<T> | null): number {
    return this.height(node?.right || null) - this.height(node?.left || null);
  }

  private rotateRight(node: AvlNode<T> | null): AvlNode<T> | null {
    if (node) {
      let leftChild = node.left;

      node.left = leftChild?.right || null;

      if (leftChild) {
        leftChild.right = node;
      }

      this.updateHeight(node);
      this.updateHeight(leftChild);

      return leftChild;
    } else {
      return null;
    }
  }

  private rotateLeft(node: AvlNode<T> | null): AvlNode<T> | null {
    if (node) {
      let rightChild = node.right;

      node.right = rightChild?.left || null;

      if (rightChild) {
        rightChild.left = node;
      }

      this.updateHeight(node);
      this.updateHeight(rightChild);

      return rightChild;
    } else {
      return null;
    }
  }

  private rebalance(node: AvlNode<T> | null): AvlNode<T> | null {
    const balanceFactor = this.balanceFactor(node);

    if (balanceFactor < -1) {
      if (this.balanceFactor(node?.left || null) <= 0) {
        node = this.rotateRight(node);
      } else {
        if (node) {
          node.left = this.rotateLeft(node.left);
        }

        node = this.rotateRight(node);
      }
    }

    if (balanceFactor > 1) {
      if (this.balanceFactor(node?.right || null) >= 0) {
        node = this.rotateLeft(node);
      } else {
        if (node) {
          node.right = this.rotateRight(node.right);
        }

        node = this.rotateLeft(node);
      }
    }

    return node;
  }

  private _insert(node: AvlNode<T> | null, key: string, value: T): AvlNode<T> {
    if (!node) {
      node = { value, key, left: null, right: null, height: 1 };
    }

    if (key > node.key) {
      node.right = this._insert(node.right, key, value);
    }

    if (key < node.key) {
      node.left = this._insert(node.left, key, value);
    }

    this.updateHeight(node);

    const balancedRoot = this.rebalance(node);

    if (balancedRoot) {
      return balancedRoot;
    } else {
      throw new Error(`Unspected error while inserting: ${node}`);
    }
  }

  insert(key: string, value: T): void {
    const node = this._insert(this.root, key, value);

    this.root = node;
  }

  private _search(node: AvlNode<T> | null, key: string): T | null {
    if (!node) {
      return null;
    }

    if (key > node.key) {
      return this._search(node.right, key);
    }

    if (key < node.key) {
      return this._search(node.left, key);
    }

    return node.value;
  }

  search(key: string): T | null {
    return this._search(this.root, key);
  }

  private _delete(node: AvlNode<T> | null, key: string): AvlNode<T> | null {
    if (!node) return null;

    if (key > node.key) {
      node.right = this._delete(node.right, key);
    }

    if (key < node.key) {
      node.left = this._delete(node.left, key);
    }

    if (key === node.key) {
      if (!node.left && !node.right) {
        node = null;
      } else if (!node.left && node.right) {
        node = node.right;
      } else if (!node.right && node.left) {
        node = node.left;
      } else {
        this.deleteNodeWithTwoChildren(node);
      }
    }

    this.updateHeight(node);

    const balancedRoot = this.rebalance(node);

    return balancedRoot;
  }

  delete(key: string): void {
    const node = this._delete(this.root, key);

    this.root = node;
  }

  private deleteNodeWithTwoChildren(node: AvlNode<T> | null): void {
    if (!node) return;

    const inOrderSuccessor = this.getMinNode(node.right);

    if (!inOrderSuccessor) {
      node = null;

      return;
    }

    node.key = inOrderSuccessor.key;
    node.value = inOrderSuccessor.value;
    node.right = this._delete(node.right, inOrderSuccessor.key);
  }

  private getMinNode(node: AvlNode<T> | null) {
    let current = node;

    if (!current) return null;

    while (current.left !== null) {
      current = current.left;
    }

    return current;
  }
}
