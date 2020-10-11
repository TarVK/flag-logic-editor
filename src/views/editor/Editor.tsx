import {useDataHook} from "model-react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {KeyHandler} from "../../controllers/keyEventHandler/KeyHandler";
import {useUpdateEffect} from "../../hooks/useUpdateEffect";
import {ITextSelection} from "../../models/textField/_types/ITextSelection";
import {LFC} from "../../_types/LFC";
import {SyntaxHighlighter} from "./SyntaxHighlighter";
import {IEditorProps} from "./_types/IEditorProps";

export const Editor: LFC<IEditorProps> = ({
    textField,
    keyboardHandler,
    highlighter,
    setErrors,
    globalListener,
    highlightErrors = 3000,
    ...rest
}) => {
    // Interact with the field
    const [h] = useDataHook();
    const value = textField.get(h);
    const selection = textField.getSelection(h);
    const setSelection = useCallback(
        (selection: ITextSelection) => {
            textField.setSelection(selection);
        },
        [textField]
    );

    // Hide errors while typing
    const errorsVisible = useRef(
        typeof highlightErrors == "boolean" ? !highlightErrors : true
    );
    const [, forceUpdate] = useState({});
    useUpdateEffect(() => {
        if (typeof highlightErrors != "number") return;
        const timeout = setTimeout(() => {
            errorsVisible.current = true;
            forceUpdate({});
        }, highlightErrors);
        return () => clearTimeout(timeout);
    }, [value]);
    const prevValue = useRef(value);
    if (prevValue.current != value) {
        prevValue.current = value;
        errorsVisible.current = false;
    }

    // Get a ref to the div in order to use its key events
    const [elRef, setElRef] = useState(null as null | HTMLDivElement);
    useEffect(() => {
        if (globalListener) {
            const handler = new KeyHandler(window);
            handler.listen(keyboardHandler);
            return () => handler.destroy();
        } else if (elRef) {
            const handler = new KeyHandler(elRef);
            handler.listen(keyboardHandler);
            return () => handler.destroy();
        }
    }, [elRef, globalListener]);

    console.log("render");
    return (
        <div
            ref={setElRef}
            style={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                outline: "none",
            }}
            tabIndex={0}>
            <SyntaxHighlighter
                highlighter={highlighter}
                setErrors={setErrors}
                highlightErrors={errorsVisible.current}
                value={value}
                selection={selection}
                onSelectionChange={setSelection}
                {...rest}
            />
        </div>
    );
};
