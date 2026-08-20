/** Article corpus for the search-list page. Seeded, stable across reloads. */
export interface Article {
  key: string;
  author: 'wei' | 'marta' | 'jonas' | 'li' | 'ana';
  tags: string[];
  stars: number;
  likes: number;
  comments: number;
  views: number;
  daysAgo: number;
}

export const articles: Article[] = [
  {
    key: 'tokens',
    author: 'li',
    tags: ['design', 'antd'],
    stars: 312,
    likes: 1284,
    comments: 42,
    views: 18400,
    daysAgo: 2,
  },
  {
    key: 'cjk',
    author: 'wei',
    tags: ['typography', 'i18n'],
    stars: 274,
    likes: 968,
    comments: 31,
    views: 12900,
    daysAgo: 5,
  },
  {
    key: 'datatable',
    author: 'marta',
    tags: ['react', 'antd'],
    stars: 198,
    likes: 742,
    comments: 58,
    views: 9800,
    daysAgo: 9,
  },
  {
    key: 'bundle',
    author: 'jonas',
    tags: ['performance'],
    stars: 421,
    likes: 1533,
    comments: 76,
    views: 24100,
    daysAgo: 12,
  },
  {
    key: 'msw',
    author: 'ana',
    tags: ['testing', 'react'],
    stars: 156,
    likes: 511,
    comments: 19,
    views: 7300,
    daysAgo: 16,
  },
  {
    key: 'darkmode',
    author: 'li',
    tags: ['design'],
    stars: 289,
    likes: 894,
    comments: 24,
    views: 15200,
    daysAgo: 21,
  },
  {
    key: 'vite8',
    author: 'jonas',
    tags: ['performance', 'react'],
    stars: 508,
    likes: 2011,
    comments: 93,
    views: 31600,
    daysAgo: 28,
  },
];
