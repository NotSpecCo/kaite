export class PerfLogger {
  static enabled = false;

  static start(label: string) {
    if (!this.enabled) return;
    console.time(label);
  }

  static stop(label: string) {
    if (!this.enabled) return;
    console.timeEnd(label);
  }
}
