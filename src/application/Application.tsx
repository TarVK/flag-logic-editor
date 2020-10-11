import React, {useEffect, useMemo, useState} from "react";
import {useCallback, useRef} from "react";
import {KeyEvent} from "../controllers/keyEventHandler/KeyEvent";
import {plaintextLexer} from "../models/textField/syntax/plaintextLexer";
import {TextField} from "../models/textField/TextField";
import {ITextField} from "../models/textField/_types/ITextField";
import {Editor} from "../views/editor/Editor";
import {LFC} from "../_types/LFC";
import {Box} from "@deity/falcon-ui";
import {syntaxThemeCss} from "./syntaxTheme";
import {createKeyHandler} from "./createKeyHandler";
import {IHighlighter} from "../models/textField/syntax/_types/IHighlighter";
import {createHighlighter} from "./createHighlighter";
import {symbols} from "./symbols";
import {KeyHandler} from "../controllers/keyEventHandler/KeyHandler";
import {exampleInput} from "./exampleInput";

export const Application: LFC = () => {
    // Create a text field
    const textFieldRef = useRef<ITextField>();
    if (!textFieldRef.current) {
        const text = localStorage.getItem("content") || exampleInput;
        const textField = (textFieldRef.current = new TextField(text));
        const save = () => {
            let remover: () => void;
            localStorage.setItem(
                "content",
                textField.get({
                    call: () => {
                        remover?.();
                        save();
                    },
                    registerRemover: r => {
                        remover = r;
                    },
                })
            );
        };
        save();
    }
    const textField = textFieldRef.current;

    // Create a key handler
    const keyHandler = useMemo(() => createKeyHandler(textField), []);

    // Manage the highlighter
    const [highlighter, setHighlighter] = useState(null as null | IHighlighter);
    const [symbolCSS, setSymbolCSS] = useState<
        Record<string, import("@deity/falcon-ui/dist/theme").InlineCss<unknown>>
    >();
    useEffect(() => {
        const nonSpaceSymbols = symbols.map(s => ({
            ...s,
            name: s.name.replace(/\s+/g, "_"),
        }));
        setHighlighter(createHighlighter(nonSpaceSymbols));
        setSymbolCSS(
            Object.fromEntries(
                nonSpaceSymbols.map(s => [
                    `.${s.name}`,
                    {
                        ...(s.text != undefined && {
                            "> span": {
                                display: "none",
                            },
                            "::before": {content: `'${s.text}'`},
                        }),
                        ...s.css,
                    },
                ])
            )
        );
    }, []);

    // highlighter switcher
    const [usePlainHighlighter, setUsePlainHighlighter] = useState(false);

    useEffect(() => {
        const handler = new KeyHandler(window);
        handler.listen(e => {
            if (e.is("esc")) setUsePlainHighlighter(h => !h);
        });
        return () => handler.destroy();
    }, []);

    return (
        <Box
            css={{
                ...syntaxThemeCss,
                ...symbolCSS,
                fontFamily: "consolas",
                width: "calc(100% - 40px)",
                height: "calc(100% - 40px)",
                overflow: "hidden",
                margin: 20,
            }}>
            <Editor
                textField={textField}
                globalListener={true}
                keyboardHandler={keyHandler}
                key={usePlainHighlighter ? "1" : "2"}
                highlighter={(!usePlainHighlighter && highlighter) || plaintextLexer}
                setErrors={e => e.length > 0 && console.log(e)}
            />
        </Box>
    );
};
