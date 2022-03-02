/* eslint-disable no-underscore-dangle */
export type EventEmitterAction = (arg: unknown) => void;

export type CancelEventFunction = () => void;

interface ActionEntry {
  action: EventEmitterAction;
  once: boolean;
}

export class EventEmitter {
  private events: Record<string, ActionEntry[]> = {};

  on(name: string, cb: EventEmitterAction) {
    return this._on(name, cb, false);
  }

  once(name: string, cb: EventEmitterAction) {
    return this._on(name, cb, true);
  }

  dispatch(name: string, arg?: unknown): boolean {
    const list = this.events[name];
    if (!list?.length) {
      return false;
    }
    list.forEach((el) => el.action(arg));
    this.events[name] = list.filter((el) => !el.once);
    return true;
  }

  private ensureSlotAllocated(name: string): ActionEntry[] {
    const { events } = this;
    return (events[name] ??= []);
  }

  private _on(name: string, cb: EventEmitterAction, once: boolean): CancelEventFunction {
    const action: ActionEntry = { action: cb, once };
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
