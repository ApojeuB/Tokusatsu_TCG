import { StackItemEntity } from "../Entities/StackItemEntity";

export class StackManager {
  push(stack, itemLike) {
    const item = itemLike instanceof StackItemEntity ? itemLike : new StackItemEntity(itemLike);
    stack.items.push(item);
    return item;
  }

  pop(stack) {
    return stack.items.pop() ?? null;
  }

  resolveTop(matchState) {
    const item = this.pop(matchState.stack);

    if (!item) {
      return null;
    }

    matchState.stack.resolving = true;
    if (typeof item.effect === "function") {
      item.effect(matchState, item);
    }
    matchState.stack.resolving = false;
    return item;
  }

  resolveStack(matchState) {
    while (matchState.stack.items.length) {
      this.resolveTop(matchState);
    }

    return matchState;
  }
}
