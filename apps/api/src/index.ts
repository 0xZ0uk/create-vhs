import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors());

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/vhs", (c) => {
	const data = {
		message: "Hello from VHS",
	};

	return c.json(data, { status: 200 });
});

export default app;
