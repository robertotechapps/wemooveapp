import { ShellModel } from '../shell/data-store';

export class WalletModel extends ShellModel {
    id: number;
    updated_at: string;
    icon: string;
    amount: number;
    status: number;
    constructor() {
        super();
      }
}

export class WalletLinkModel extends ShellModel {
  first: string;
  last: string;
  prev: string;
  next: string;
  constructor() {
      super();
      this.first = null;
      this.last = null;
      this.prev = null;
      this.next = null;
    }
}
