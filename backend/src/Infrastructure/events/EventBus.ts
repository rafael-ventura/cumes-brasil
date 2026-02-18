import { EventEmitter } from 'events';
import { Service } from 'typedi';

@Service()
export class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20);
  }
}