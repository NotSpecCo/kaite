export class KaiAds {
  static startListening() {
    document.addEventListener('keyup', this.handler, { capture: true });
  }

  static stopListening() {
    document.removeEventListener('keyup', this.handler, { capture: true });
  }

  private static handler(ev) {
    if (ev.key !== '*') return;

    if (
      ev.target?.tagName.toLowerCase() === 'input' ||
      (ev.target?.attributes as any).role?.value === 'textbox'
    ) {
      console.log('In an input, skipping ad.');
      return;
    }

    ev.preventDefault();
    ev.stopPropagation();

    console.log('Serving ad.');

    (window as any).getKaiAd?.({
      publisher: 'bfa639b9-3ae0-4e79-8042-b41d65c59ea1',
      app: 'Kaite',
      onerror: (err: any) => console.error('Custom catch:', err),
      onready: (ad: any) => ad.call('display'),
    });
  }
}
