type Size = 'thumb' | 'small' | 'medium' | 'large';
type Quality = 'lowest' | 'low' | 'medium' | 'high';

export class DynamicImage {
  baseImageUrl: string;

  constructor(imageUrl: string) {
    this.baseImageUrl = imageUrl.match(/([\S]+)(\.jpg|\.png)/)[1];
  }

  toSize(size: Size): string {
    return `${this.baseImageUrl}?format=jpg&name=${size}`;
  }

  toQuality(quality: Quality): string {
    switch (quality) {
      case 'lowest':
        return `${this.baseImageUrl}?format=jpg&name=thumb`;
      case 'low':
        return `${this.baseImageUrl}?format=jpg&name=small`;
      case 'medium':
        return `${this.baseImageUrl}?format=jpg&name=medium`;
      case 'high':
        return `${this.baseImageUrl}?format=jpg&name=large`;
    }
  }
}
