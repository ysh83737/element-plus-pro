import typeEnum from '@commitlint/config-angular-type-enum';

export default {
  extends: ['@commitlint/config-angular'],
  rules: {
    'type-enum': [2, 'always', [...typeEnum.value(), 'chore', 'wip']],
  },
};
