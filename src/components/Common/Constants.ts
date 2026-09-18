export abstract class Constants {
  static readonly DEFAULT_HELP_LINK: string = '';
  static readonly DEFAULT_MAX_CHARACTER_LENGTH: number = 32000;
  static readonly DEFAULT_MAX_CHARACTER_LENGTH_MESSAGE: string =
    'Response must not exceed 32,000 characters. If you wish to submit a formal response, please refer to the <a href="https://www2.gov.bc.ca/assets/gov/environment/natural-resource-stewardship/environmental-assessments/commenting-on-projects/eao_public_comment_policy.pdf" target="_blank">Public Comment Policy</a>.';
  static readonly DEFAULT_REQUIRED_VALIDATION_MESSAGE: string = 'This question is required.';
  /**
   * jsonLogic's `var` splits on '.', so a value used as a data path cannot contain one.
   * Unanchored on purpose: formio wraps the pattern in ^...$ itself.
   */
  static readonly NO_PERIOD_PATTERN: string = '[^.]*';
  static readonly NO_PERIOD_VALIDATION_MESSAGE: string =
    'Value cannot contain a period (.). Periods separate fields in conditional logic.';

  /** Rank order, most negative first. `notSure` sits outside the scale. analytics-api and met-web rely on these keys. */
  static readonly LIKERT_CLASSIFICATIONS: ReadonlyArray<{ value: string; label: string }> = [
    { value: 'neg3', label: 'Negative 3' },
    { value: 'neg2', label: 'Negative 2' },
    { value: 'neg1', label: 'Negative 1' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'pos1', label: 'Positive 1' },
    { value: 'pos2', label: 'Positive 2' },
    { value: 'pos3', label: 'Positive 3' },
    { value: 'notSure', label: 'Not sure' },
  ];
  static readonly LIKERT_DUPLICATE_CLASSIFICATION_MESSAGE: string = 'Each classification can only be used once.';
  static readonly LIKERT_MAX_VALUES: number = 8;
  static readonly LIKERT_DEFAULT_VALUES: ReadonlyArray<{ label: string; value: string; classification: string }> = [
    'neg2',
    'neg1',
    'neutral',
    'pos1',
    'pos2',
  ].map((classification) => Object.freeze({ label: '', value: '', classification }));
}
