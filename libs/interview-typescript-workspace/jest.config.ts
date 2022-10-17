/* eslint-disable */
export default {
  displayName: 'interview-typescript-workspace',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/interview-typescript-workspace',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'interview-typescript-workspace Jest Tests',
        outputDirectory: 'junit/libs/interview-typescript-workspace',
        outputName: 'junit.xml',
        uniqueOutputName: 'false',
      },
    ],
  ],
};
