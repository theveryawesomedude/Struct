# This is a list of probable common mistakes you can do while writing Struct code



- Forgetting semicolons

construct <foo> => [
	String "word" <- Missing semicolon (err) Struct is strict about these
]


- Writing angle brackets in construct names because you saw the templates

construct <foo> => [   <- angle brackets (dont write those)
	>stuff go here
]


- Using {} as construct body

construct <foo> => {
	String "hi";
} <- its brackets not braces


- Forgetting =>

construct <foo> [   <- youve never seen a programming language that uses => for these huh?
	String "hi";
]


- Forgetting braces to wrap arithmetic expressions

construct <foo> => [
	Arith 10+10;  <- wrap this in quotes (err)


**END**
