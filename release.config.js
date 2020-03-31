module.exports = {
  verifyConditions: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github'
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING']
        }
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING']
        },
        writerOpts: {
          commitsSort: ['subject', 'scope']
        }
      }
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md'
      }
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: '.',
        npmPublish: true,
        tarballDir: false
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'src/**', 'package-lock.json', 'CHANGELOG.md'],
        message: 'chore(release): version ${nextRelease.version} \n\n${nextRelease.notes}'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: ['!.env']
      }
    ]
  ]
}
