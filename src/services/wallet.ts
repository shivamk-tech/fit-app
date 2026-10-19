/**
 * Coin wallet singleton shared by every reward source
 * (step milestones, streak bonuses, and anything added later).
 */
import type { CoinWallet } from '../types/steps';
import { creditWallet, loadWallet, saveWallet } from './stepStorage';

type Listener = (wallet: CoinWallet) => void;

class WalletStore {
  private wallet: CoinWallet = { balance: 0, ledger: [] };
  private listeners = new Set<Listener>();
  private loadPromise: Promise<void> | null = null;
  private persistQueue: Promise<void> = Promise.resolve();

  /** Load the persisted wallet. Idempotent. */
  load(): Promise<void> {
    if (!this.loadPromise) {
      this.loadPromise = loadWallet()
        .then(w => {
          this.wallet = w;
          this.emit();
        })
        .catch(() => {
          this.loadPromise = null;
        });
    }
    return this.loadPromise;
  }

  snapshot(): CoinWallet {
    return this.wallet;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.wallet);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Add coins (positive) or spend them (negative) and persist. */
  credit(amount: number, reason: string): CoinWallet {
    this.wallet = creditWallet(this.wallet, amount, reason);
    const snapshot = this.wallet;
    this.persistQueue = this.persistQueue
      .then(() => saveWallet(snapshot))
      .catch(() => {
        /* storage failures must never crash the app */
      });
    this.emit();
    return this.wallet;
  }

  private emit() {
    this.listeners.forEach(l => l(this.wallet));
  }
}

export const walletStore = new WalletStore();
