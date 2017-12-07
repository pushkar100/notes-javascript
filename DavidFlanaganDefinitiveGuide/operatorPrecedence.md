# Operator Precedence & Associativity (Upto ES5)

Precedence levels: ***Highest to Lowest***

## Level 1: Unary Operators (9)

- `++`
- `--`
- `-` (Unary `-` is negation of a numeric value)
- `+` (Unary `+` is converting a value to a number)
- `~`
- `!`
- `delete`
- `typeof`
- `void`

***Associativity:*** RTL `<--`

## Level 2: Higher Arithmetic Operators (3)

- `*`
- `/`
- `%`

***Associativity:*** LTR `-->`

### Level 3: Lower Arithmetic Operators (2)

- `+` (Binary plus. Both as addition operator and string concatenator)
- `-` (Binary minus)

***Associativity:*** LTR `-->`

## Level 4: Shift Operators (3)

- `<<` (Shift left)
- `>>` (Shift right with sign extension)
- `>>>` (Shift right with zero extension)

***Associativity:*** LTR `-->`

## Level 5: Greater Than & Less Than Operators (5)

- `<`  (Comparison can either be in numeric or alphabetic order)
- `<=` (Comparison can either be in numeric or alphabetic order)
- `>=` (Comparison can either be in numeric or alphabetic order)
- `instanceof`
- `in`

***Associativity:*** LTR `-->`

## Level 6: Equality Operators (4)

- `==`
- `!=`
- `===`
- `!==`

***Associativity:*** LTR `-->`

## Level 7 to 11: OR & AND Operators (5)

1. `&`  (Bitwise AND)
2. `^`  (Bitwise XOR)
3. `|`  (Bitwise OR)
4. `&&` (Logical AND)
5. `||` (Logical OR)

***Associativity:*** LTR `-->`

## Level 12: Ternary Operator (1)

- `?:`

***Associativity:*** RTL `<--`

## Level 13: Assignment Operators (12)

- `=`
- `*=`
- `/=`
- `%=`
- `+=`
- `-=`
- `&=`
- `^=`
- `|=`
- `<<=`
- `>>=`
- `>>>=`

***Associativity:*** RTL `<--`

## Level 14: The Comma Operator (1)

- `,`

***Associativity:*** LTR `-->`

## An Easy Way to Remember Operator Precedence & Associativity

1. Only 3 types of operators are **RTL** (All the others are **LTR**):
	1. Unary
	2. Ternary
	3. Assignment
2. The 14 levels can be remembered by titles:
	1. (U)nary (RTL)
	2. (H)igher Arithmetic
	3. (L)ower Arithmetic
	4. (S)hift
	5. (G)reater Than & Less Than
	6. (E)quality
	7. (A)ND & OR (Bitwise first then Logical)
	8. (T)ernary (RTL)
	9. (A)ssignment (RTL)
	10. (C)omma

The acronym you end up with is: **`U.n-HiLo-SGEA-T.A.C`** (Remember this to remember precendence & associativity)
