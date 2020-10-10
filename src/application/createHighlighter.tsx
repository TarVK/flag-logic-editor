import {IHighlighter} from "../models/textField/syntax/_types/IHighlighter";
import {ISymbolDefinition} from "./_types/ISymbolDefinition";
import {HighlightLexer} from "../models/textField/syntax/HighlightLexer";
import {EOF, HighlightParser, Lexer} from "../models/textField/syntax/HighlightParser";
import {addHighlightNodeTags} from "../models/textField/syntax/utils/addHighlightNodeTags";
import {createHighlightTokens} from "../models/textField/syntax/utils/createHighlightTokens";
import {IHighlightError} from "../models/textField/syntax/_types/IHighlightError";
import {IHighlightNode} from "../models/textField/syntax/_types/IHighlightNode";
import {createHighlightToken} from "../models/textField/syntax/utils/createHighlightToken";

type IExtraTags = Omit<IHighlightNode, "text">;

/**
 * Makes sure that the parser doesn't error in initialization mode
 * @param data The input data (which should be an array, but may not be)
 */
function r<T>(data: T[]): T[] {
    if (!(data instanceof Array)) return [];
    return data;
}

export function createHighlighter(symbols: ISymbolDefinition[]): IHighlighter {
    const symbolTokens = symbols.map(sym =>
        createHighlightToken({...sym, tags: [sym.name, ...(sym.tags ?? [])]})
    );

    const {tokens, tokenList} = createHighlightTokens({
        lBracket: {pattern: /{{/, tags: ["lBracket", "hidden"]},
        rBracket: {pattern: /}}/, tags: ["rBracket", "hidden"]},
        superscript: {pattern: "^", tags: ["superscript", "hidden"]},
        subscript: {pattern: "_", tags: ["subscript", "hidden"]},
        flag: {pattern: "|[", tags: ["hidden"]},
    });
    const {tokens: textTokens, tokenList: textTokenList} = createHighlightTokens({
        newLine: {pattern: /\r?\n/, tags: ["new-line"]},
        whiteSpace: {pattern: /(\s(?=[^\n]))+/, tags: ["space"]},
        lBrackets: {pattern: /\{|\[|\(/, tags: ["bracket"]},
        rBrackets: {pattern: /\)|\]|\}/, tags: ["bracket"]},
        number: {pattern: /[\d\.]+/, tags: ["number"]},
        text: {pattern: /_?(\w(?=[^_\n]))+|./, tags: ["text"]},
    });

    class EditorParser extends HighlightParser<IExtraTags[]> {
        public constructor() {
            super([...tokenList, ...symbolTokens, ...textTokenList], {
                recoveryEnabled: true,
            });
            this.performSelfAnalysis();
        }

        protected document = this.RULE("document", () => {
            let tags: IExtraTags[] = [];
            this.MANY(() => {
                tags.push(...r(this.SUBRULE(this.expression)));
            });
            this.CONSUME(EOF);
            return tags;
        });

        protected expression = this.RULE("expression", () =>
            this.OR([
                {
                    ALT: () => {
                        this.CONSUME(tokens.flag);
                        const m2 = this.SUBRULE(this.literalGroup);
                        return [{...m2, tags: ["flag"]}, ...r(m2.extraTags)];
                    },
                },
                {
                    ALT: () => {
                        this.CONSUME2(tokens.superscript);
                        const m2 = this.SUBRULE2(this.literalGroup);
                        return [{...m2, tags: ["superscript"]}, ...r(m2.extraTags)];
                    },
                },
                {
                    ALT: () => {
                        this.CONSUME3(tokens.subscript);
                        const m2 = this.SUBRULE3(this.literalGroup);
                        return [{...m2, tags: ["subscript"]}, ...r(m2.extraTags)];
                    },
                },
                {
                    ALT: () => {
                        this.SUBRULE4(this.literalGroup);
                        return [];
                    },
                },
            ])
        );

        protected literalGroup = this.RULE("literalGroup", () =>
            this.OR([
                {
                    ALT: () => {
                        const m = this.CONSUME(tokens.lBracket);
                        const extraTags = [] as IExtraTags[];
                        this.MANY(() => {
                            extraTags.push(...r(this.SUBRULE(this.expression)));
                        });
                        const m2 = this.CONSUME(tokens.rBracket);
                        return {
                            start: (m.endOffset || m.startOffset) + 1,
                            end: m2.startOffset,
                            extraTags,
                        };
                    },
                },
                {ALT: () => this.SUBRULE2(this.literal)},
            ])
        );
        protected literal = this.RULE("literal", () => {
            const m = this.OR([
                {ALT: () => this.CONSUME(textTokens.newLine)},
                {ALT: () => this.CONSUME(textTokens.whiteSpace)},
                {ALT: () => this.CONSUME(textTokens.lBrackets)},
                {ALT: () => this.CONSUME(textTokens.rBrackets)},
                {ALT: () => this.CONSUME(textTokens.number)},
                {ALT: () => this.CONSUME(textTokens.text)},
                ...symbolTokens.map(sym => ({ALT: () => this.CONSUME(sym)})),
            ]);
            return {
                start: m.startOffset,
                end: (m.endOffset ?? m.startOffset) + 1,
                extraTags: [],
            };
        });

        /**
         * Extracts the highlight data from the given syntax
         * @param syntax The syntax to highlight
         * @returns The highlight nodes and possibly syntax and or semantic errors
         */
        public highlight(
            syntax: string
        ): {nodes: IHighlightNode[]; errors: IHighlightError[]} {
            let {nodes} = this.lexer.highlight(syntax);
            const {errors, result} = this.execute(syntax);
            result?.forEach(({start, end, tags}) => {
                nodes = addHighlightNodeTags(nodes, start, end, tags);
            });
            return {
                nodes,
                errors:
                    errors?.map(error => {
                        if ("token" in error)
                            return HighlightParser.mapError(syntax, error);
                        else return HighlightLexer.mapError(syntax, error);
                    }) || [],
            };
        }
    }

    return new EditorParser();
}
