import React, {useCallback, useMemo, useRef} from "react";
import {useDataHook} from "../../hooks/useDataHook";
import {highlightTagErrors} from "../../models/textField/syntax/utils/highlightTagErrors";
import {splitHighlightNodes} from "../../models/textField/syntax/utils/splitHighlightNodes";
import {IHighlightNode} from "../../models/textField/syntax/_types/IHighlightNode";
import {LFC} from "../../_types/LFC";
import {SyntaxHighlighterNodes} from "./SyntaxHighlighterNodes";
import {SyntaxHighlighterSelection} from "./SyntaxHighlighterSelection";
import {ISyntaxHighlighterProps} from "./_types/ISyntaxHighlighterProps";

export const SyntaxHighlighter: LFC<ISyntaxHighlighterProps> = ({
    setErrors,
    value,
    highlighter,
    highlightErrors,
    onSelectionChange,
    selection,
}) => {
    // Allow the highlighter to force updates
    const highlightChangeID = useRef(0);
    const [h] = useDataHook({onChange: () => highlightChangeID.current++});

    // Obtain the highlight nodes
    let lines: IHighlightNode[][] = useMemo(() => {
        // Highlight the text including error tags
        const {nodes, errors} = highlighter.highlight(value, h);
        if (setErrors) setErrors(errors);
        const errorHighlighted =
            highlightErrors == false ? nodes : highlightTagErrors(nodes, errors);

        // Split the nodes by lines
        const lines = splitHighlightNodes(errorHighlighted, node =>
            node.tags.includes("new-line")
        );

        // Return all nodes
        return lines;
    }, [value, highlightErrors, highlighter, highlightChangeID.current]);

    // Selection listeners
    const dragging = useRef(false);
    const onDragEnd = useRef(() => {
        dragging.current = false;
        document.removeEventListener("mouseup", onDragEnd.current);
    });
    const caughtLineClick = useRef(false);
    const onDragStart = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            dragging.current = true;
            document.addEventListener("mouseup", onDragEnd.current);

            // // Select the last index if clicking in the div but not on a character
            // if (!caughtLineClick.current) {
            //     const index = nodes.reduce((cur, node) => Math.max(node.end, cur), 0);
            //     selectionRef.current = {
            //         start:
            //             (e.shiftKey ? selectionRef.current?.start : undefined) ?? index,
            //         end: index,
            //     };
            //     onSelectionChange?.(selectionRef.current);
            // }
            TODO: caughtLineClick.current = false;
        },
        [lines]
    );

    const selectionRef = useRef(selection);
    selectionRef.current = selection;
    const mouseDownHandler = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>, i: number) => {
            const index = Math.round(i);
            if (
                selectionRef.current?.start != index ||
                selectionRef.current?.end != index
            ) {
                selectionRef.current = {
                    start:
                        (e.shiftKey ? selectionRef.current?.start : undefined) ?? index,
                    end: index,
                };
                onSelectionChange?.(selectionRef.current);
            }
            caughtLineClick.current = true;
        },
        [onSelectionChange]
    );
    const mouseMoveHandler = useCallback(
        (e, i: number) => {
            const index = Math.round(i);
            if (dragging.current && selectionRef.current?.end != index) {
                selectionRef.current = {
                    start: selectionRef.current?.start ?? index,
                    end: index,
                };
                onSelectionChange?.(selectionRef.current);
            }
        },
        [onSelectionChange]
    );

    const textID = {} as Record<string, number>;
    return (
        <>
            {lines.map((nodes, i) => {
                const selectionOffset = nodes[0]?.start ?? 0;

                const text = nodes.reduce((text, node) => text + node.text, "");
                if (!textID[text]) textID[text] = 0;
                let key = `${textID[text]++}-${
                    highlightErrors ? selectionOffset : 0
                }-${text}`;

                const relativeSelection = {
                    start: (selection?.start ?? 0) - selectionOffset,
                    end: (selection?.end ?? 0) - selectionOffset,
                };
                const isEnd = selection
                    ? nodes[0]?.start <= selection.end &&
                      nodes[nodes.length - 1]?.end >= selection.end
                    : false;

                const nodesEl = (
                    <SyntaxHighlighterNodes
                        text={text}
                        nodes={nodes}
                        onMouseDown={onSelectionChange && mouseDownHandler}
                        onMouseMove={onSelectionChange && mouseMoveHandler}
                    />
                );

                return (
                    <div
                        key={key}
                        style={{
                            userSelect: "none",
                            whiteSpace: "pre",
                            overflowX: "auto",
                            position: "relative",
                            width: "100%",
                            minHeight: "1em",
                        }}
                        onMouseDown={onSelectionChange && onDragStart}
                        onMouseUp={onSelectionChange && onDragEnd.current}>
                        {selection ? (
                            <SyntaxHighlighterSelection
                                selection={relativeSelection}
                                isEnd={isEnd}>
                                {nodesEl}
                            </SyntaxHighlighterSelection>
                        ) : (
                            nodesEl
                        )}
                    </div>
                );
            })}
        </>
    );
};
