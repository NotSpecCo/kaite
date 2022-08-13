module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    [
      '@semantic-release/exec',
      {
        publishCmd: './deploy/package.sh ${nextRelease.version}',
      },
    ],
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false,
        assets: [
          {
            path: 'Kaite_v*.zip',
          },
        ],
      },
    ],
    '@semantic-release/git',
    {
      assets: ['CHANGELOG.md', 'package.json', 'package-lock.json', '**/manifest*'],
    },
  ],
};
