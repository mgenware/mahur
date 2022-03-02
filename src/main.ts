/* eslint-disable no-underscore-dangle */
export type HandlerFunc<T> = (arg: T | undefined) => void;

export type CancelEventFunc = () => void;

interface HandlerEntry<T> {
  action: HandlerFunc<T>;
  once: boolean;
}

export class EventEmitter<T = unknown> {
  private events: Record<string, HandlerEntry<T>[]> = {};

  on(name: string, cb: HandlerFunc<T>) {
    return this._on(name, cb, false);
  }

  once(name: string, cb: HandlerFunc<T>) {
    return this._on(name, cb, true);
  }

  dispatch(name: string, arg?: T): boolean {
    const list = this.events[name];
    if (!list?.length) {
      return false;
    }
    list.forEach((el) => el.action(arg));
    this.events[name] = list.filter((el) => !el.once);
    return true;
  }

  private ensureSlotAllocated(name: string): HandlerEntry<T>[] {
    const { events } = this;
    return (events[name] ??= []);
  }

  private _on(name: string, cb: HandlerFunc<T>, once: boolean): CancelEventFunc {
    const action: HandlerEntry<T> = { action: cb, once };
    this.ensureSlotAllocated(name).push(action);

    let canceled = false;
    return () => {
      if (canceled) {
        return;
      }
      canceled = true;
      // NOTE: Always fetch latest actions instead of reusing the `actions` from the
      // outer scope.
      const { events } = this;
      const actions = events[name];
      if (!actions) {
        return;
      }
      const idx = actions.indexOf(action);
      if (idx >= 0) {
        actions.splice(idx, 1);
      }
    };
  }
}
