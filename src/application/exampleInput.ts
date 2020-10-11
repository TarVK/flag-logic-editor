export const exampleInput = `Given the following inductive definition for the fibonacci sequence:
a_0 := 0
a_1 := 1
a_{{i+2}} := a_{{i+1}} + a_i
Prove:
A(n) = [a_{{n+2}} = a_n + a_{{n-1}} + ... + a_1 + a_0 + 1]

{assume}
|[{{var i: i IN N}} TAG
| {assume IH}
| |[{{FORALL_j[j IN N && j < i: A(j)]}}TAG
| | {case i = 0}
| | a_{{0+2}} = a_{{0+1}} + a_{{0}} = 1 + 0 = a_0 + 1 TAG
| | {case i = 1}
| | a_{{1+2}} = a_{{1+1}} + a_{{1}} = a_2 + a_1 = a_1 + a_0 + 1   TAG
| | {case i >= 2}
| | a_{{i+2}} = a_{{i+1}} + a_{{i}} TAG
| | {FORALL-elimination on (2) for j=i-1: a_{{(i-1)+2}} = ...}
| | = (a_{{i-1}} + a_{{i-2}} + ... + a_1 + a_0 + 1) + a_i
| | = a_i + a_{{i-1}} + a_{{i-2}} + ... + a_1 + a_0 + 1
| | {definition A(i) on (3), (4), (5)}
| | A(i) TAG
| {=>-intro on (2) and (6)}
| FORALL_j[j IN N && j < i: A(j)] => A(i) TAG
{FORALL-intro on (2) and (7)}
FORALL_i[i IN N: FORALL_j[j IN N && j < i: A(j)] => A(i)] TAG
{strong induction on (8)}
FORALLi[i IN N: A(i)] TAG
{definition A(i) in (9)}
FORALLi[i IN N: a_{{n+2}} = a_n + a_{{n-1}} + ... + a_1 + a_0 + 1] TAG
`;
