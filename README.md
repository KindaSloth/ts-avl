# Ts-Avl

![YieLsCqeuV-avlbal](https://user-images.githubusercontent.com/55771765/202624240-54bb6f2f-5b91-4a59-a51e-ad80b0778c51.gif)

## How to Install

```ts
$ yarn add ts-avl

# or

$ npm i ts-avl
```

## Usage

```ts
import { Avl } from "ts-avl";

const tree = new Avl();

tree.insert("1", { name: "tatu", age: 20 });
tree.insert("2", { name: "gui", age: 19 });
tree.insert("3", { name: "haru", age: 2 });

const haru = tree.search("3");

tree.delete("3");
```
