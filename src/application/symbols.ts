import {ISymbolDefinition} from "./_types/ISymbolDefinition";

export const symbols: ISymbolDefinition[] = [
    // Quantifiers
    {pattern: "FORALL", name: "FORALL", text: "∀"},
    {pattern: "EXISTS", name: "EXISTS", text: "∃"},
    {pattern: "SUM", name: "SUM", text: "∑"},
    {pattern: "PRODUCT", name: "PRODUCT", text: "∏"},

    // Sets
    {pattern: "IN", name: "IN", text: "∈"},
    {pattern: "NOT IN", name: "NOT IN", text: "∉"},
    {pattern: "SUBSET", name: "SUBSET", text: "⊆"},
    {pattern: "STRICTSUBSET", name: "STRICTSUBSET", text: "⊂"},
    {pattern: "NOT SUBSET", name: "NOT SUBSET", text: "⊈"},
    {pattern: "NOT STRICTSUBSET", name: "NOT STRICTSUBSET", text: "⊄"},
    {pattern: "N", name: "NATURALS", text: "ℕ"},
    {pattern: "B", name: "BOOLEANS", text: "𝔹"},
    {pattern: "Z", name: "INTEGERS", text: "ℤ"},
    {pattern: "R", name: "REALS", text: "R"},

    // Comparison
    {pattern: /!=/, name: "NOT EQUAL", text: "≠"},
    {pattern: "<=", name: "LESS THAN EQUAL", text: "≤"},
    {pattern: ">=", name: "GREATER THAN EQUAL", text: "≥"},

    // Logic
    {pattern: "&&", name: "AND", text: "∧"},
    {pattern: "||", name: "OR", text: "∨"},
    {pattern: "!", name: "NOT", text: "¬"},
    {pattern: "=>", name: "IMPLIES", text: "⇒"},

    // Structure
    {pattern: "|", name: "POLE", text: "", css: {borderLeft: "2px solid black"}},
];
