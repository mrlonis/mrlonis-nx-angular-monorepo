/* eslint-disable */
export default {
  displayName: 'ngx-publishable-library',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../test-reports/libs/ngx-publishable-library/coverage',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment'
  ],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'ngx-publishable-library Jest Tests',
        outputDirectory: 'test-reports/libs/ngx-publishable-library/junit',
        outputName: 'junit.xml',
        uniqueOutputName: 'false'
      }
    ]
  ]
};
