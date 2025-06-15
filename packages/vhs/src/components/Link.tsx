import type { JSX } from "solid-js";

export function Link(props: {
	href: string;
	children: JSX.Element;
	class: string;
	target?: string;
}) {
	return (
		<a href={props.href} class={props.class} target={props.target}>
			{props.children}
		</a>
	);
}
