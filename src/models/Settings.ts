import type { BaseSettings } from 'onyx-ui/models';

export type Settings = BaseSettings & {
  timestamps: 'absolute' | 'relative';
  displayMentions: boolean;
  displayLinks: boolean;
  displayHashtags: boolean;
  displayMedia: boolean;
  displayStats: boolean;
  mediaQuality: 'lowest' | 'low' | 'medium' | 'high';
  mediaSize: 'small' | 'medium' | 'large';
};
