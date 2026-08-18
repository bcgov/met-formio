export declare abstract class Constants {
    static readonly DEFAULT_HELP_LINK: string;
    static readonly DEFAULT_MAX_CHARACTER_LENGTH: number;
    static readonly DEFAULT_MAX_CHARACTER_LENGTH_MESSAGE: string;
    static readonly DEFAULT_REQUIRED_VALIDATION_MESSAGE: string;
    /**
     * jsonLogic's `var` splits on '.', so a value used as a data path cannot contain one.
     * Unanchored on purpose: formio wraps the pattern in ^...$ itself.
     */
    static readonly NO_PERIOD_PATTERN: string;
    static readonly NO_PERIOD_VALIDATION_MESSAGE: string;
}
