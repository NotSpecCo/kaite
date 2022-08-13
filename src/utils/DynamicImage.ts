type Size = 'thumb' | 'small' | 'medium' | 'large';

export class DynamicImage {
  baseImageUrl: string;

  constructor(imageUrl: string) {
    this.baseImageUrl = imageUrl.match(/([\S]+)(\.jpg|\.png)/)[1];
  }

  toSize(size: Size): string {
    return `${this.baseImageUrl}?format=jpg&name=${size}`;
  }
}
