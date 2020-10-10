export const syntaxTheme: Record<
    string,
    import("@deity/falcon-ui/dist/theme").InlineCss<unknown>
> = {
    // Editor
    selection: {backgroundColor: "blue", opacity: 0.2},
    cursor: {backgroundColor: "black", opacity: 1, width: 2},
    error: {backgroundColor: "red", color: "white", display: "inline !important"},
    empty: {display: "inline-block", width: 3, top: 0, bottom: 0, position: "absolute"},

    // Syntax
    hidden: {display: "none"},
    flag: {
        backgroundColor: "black",
        color: "white",
    },
    superscript: {verticalAlign: "super"},
    subscript: {verticalAlign: "sub"},
};

export const syntaxThemeCss = Object.fromEntries(
    Object.entries(syntaxTheme).map(([key, value]) => [`.${key}`, value])
);
