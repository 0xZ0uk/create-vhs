---
title: Why VHS?
description: VHS is a modern web development stack designed for building full-stack, end-to-end type-safe applications with a focus on developer experience, scalability, and performance.
---

**VHS was built for developers who prioritize an unmatched developer experience, scalability, and performance.** It draws inspiration from popular stacks like the [T3 Stack](https://create.t3.gg) and [bhvr](https://bhvr.dev/), but with some key differences that make it unique.

It’s a template built on a simple idea: what if we took the incredible end-to-end type safety of the T3 Stack but paired it with a frontend that offers uncompromising performance? This is a starting point for developers who want full-stack confidence and raw speed. If you're curious about our choices, read on.

### Why [SolidJS](https://solidjs.com)?

Let's be honest: we love what React made possible. But the Virtual DOM, while clever, is an abstraction with a cost. Fine-grained reactivity is the future, and [SolidJS](https://solidjs.com) is leading the charge.

Using Solid feels like a revelation. It uses JSX, so it's familiar, but under the hood, there are no hooks, no dependency arrays, and no VDOM diffing. When a piece of state changes, Solid knows exactly which part of the DOM to update and changes only that. It’s surgical. This leads to a level of performance that heavier frameworks struggle to match and a simpler mental model once you embrace the reactive flow.

If you believe your framework should be fast by default and get out of your way, SolidJS is for you.

### Why [Vike](https://vike.dev) + [Hono](https://hono.dev)?

Next.js is a fantastic, opinionated framework. But sometimes, you don't need the entire suite of features. You just need a fast server and a powerful, flexible rendering engine.

VHS unbundles this concept.

**[Vike](https://vike.dev)** is our renderer. It's Vite-native, lean, and puts you in control. Want SSR? Great. SSG? No problem. A single-page app? Go for it. Vike handles the complex parts of rendering without locking you into a rigid structure.

**[Hono](https://hono.dev)** is our server. It's tiny, ridiculously fast, and runs anywhere, from Node.js to Cloudflare Workers. It's the perfect minimalist foundation for a type-safe API, giving you everything you need and nothing you don't.

By combining them, you get a high-performance, edge-ready backend that you have complete ownership over.

### Why [tRPC](https://trpc.io)?

This is one of the pillars we share with the T3 Stack, and for good reason. tRPC is magic.

It delivers on the original promise of GraphQL: a seamless, type-safe connection between client and server, without all of the boilerplate. It's a clever abuse of TypeScript that lets you define functions on your backend and call them from your frontend as if they were local. You get full auto-completion, type-checking, and confidence across your entire application.

Once you’ve experienced calling your API without ever leaving your editor's autocomplete, it's impossible to go back. It makes your frontend and backend feel like a single, cohesive codebase.

### Why [UnoCSS](https://unocss.dev/)?

We love Tailwind CSS. It brought structure and sanity to styling complex applications. But we're always searching for tools that can make the developer experience even faster and more flexible. That's where UnoCSS comes in.

The best part? If you know Tailwind, you already know UnoCSS. It uses a default preset that is practically a superset of Tailwind's utilities, so you can start writing classes immediately without learning a new syntax.

But it's more than just a faster Tailwind. UnoCSS is an engine. Unlike traditional utility-first frameworks that generate a large stylesheet in development, UnoCSS is "on-demand," producing only the CSS you are actually using, instantly. This means a development experience that feels weightless. It also unlocks powerful features like the Icons Preset, letting you add thousands of icons from popular sets with a single class.

It’s the perfect fit for VHS: familiar, incredibly fast, and powerful when you need it to be, all while putting the developer experience first.