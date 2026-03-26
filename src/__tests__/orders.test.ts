import { clearOrders, createOrder, listOrders } from "@/services/orders";

describe("orders service", () => {
  beforeEach(async () => {
    await clearOrders();
  });

  it("creates and lists orders", async () => {
    const order = await createOrder(
      "user_1",
      [{ id: "p1", name: "X", price: 10, qty: 1 }],
      10,
    );
    expect(order).toBeTruthy();
    const list = await listOrders("user_1");
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(order.id);
  });
});
