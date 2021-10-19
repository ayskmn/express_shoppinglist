process.env.NODE_ENV = "test";

const { hasUncaughtExceptionCaptureCallback } = require("process");
const request = require("supertest");
const app = require("../app");

let items = require("../fakeDb");
let item = {name: "product1", price:200}

beforeEach(async() => {
	items.push(item)
});

afterEach(async() => {
	items = []
});

describe("GET /items", async function() {
	test ("Lists the items in fake db", async function() {
		const response = await request(app).get(`/items`);
		const {items} = response.body;
		expect(response.statusCode).toBe(200);
		expect(items).toHaveLength(1);
	});
});

describe("GET /items/:name", async function() {
	test("Gets a single item", async function() {
		const response = await request(app).get(`/items/${item.name}`);
		expect(response.statusCode).toBe(200);
		expect(response.body.item).toEqual(item);
	});

	test("If can't find item respond with 404", async function() {
		const response = await request(app).get(`/items/0`);
		expect(response.statusCode).toBe(404);
	});
});

describe("POST /items", async function() {
	test("Creates a new item", async function() {
		const response = await request(app).post(`/items`)
		.send({
			name: "Product2",
			price: 0
		});
		expect(response.statusCode).toBe(200);
		expect(response.body.item).toHaveProperty("name");
		expect(response.body.item).toHaveProperty("price");
		expect(response.body.item.name).toEqual("Product2");
		expect(response.body.item.price).toEqual(0);

	});
});

describe("PATCH /items/:name", async function() {
	test("Update a single item", async function() {
		const response = await request(app).patch(`/items/${item.name}`)
		.send({
			name: "newName"
	});
	expect(response.statusCode).toBe(200);
	expect(response.body.item).toEqual({ name: "newName"});
	});

	test("Responds with 404 if can't find the item requested", async function() {
		const response = await request(app).patch(`/items/0`)
		expect(response.statusCode).toBe(404);

	})


})