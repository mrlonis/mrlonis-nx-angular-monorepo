/* eslint-disable */
export default {
  displayName: 'nx-angular-tutorial-data',
  preset: '../../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json'
      }
    ]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/nx-angular-tutorial-data',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'nx-angular-tutorial-data Jest Tests',
        outputDirectory: 'junit/libs/nx-angular-tutorial-data',
        outputName: 'junit.xml',
        uniqueOutputName: 'false'
      }
    ]
  ]
};
