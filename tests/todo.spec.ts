import { test, expect } from "../fixtures/test";

test.describe("TodoMVC", () => {
  test("adds a todo", async ({ todoPage }) => {
    await todoPage.addTodo("Write Playwright tests");

    await expect(todoPage.todoItem("Write Playwright tests")).toBeVisible();
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  test("edits a todo", async ({ todoPage }) => {
    await todoPage.addTodo("Old title");
    await todoPage.page.waitForTimeout(2000);
    await todoPage.editTodo("Old title", "Updated title");
    await todoPage.page.waitForTimeout(2000);
    await expect(todoPage.todoItem("Updated title")).toBeVisible();
    await expect(todoPage.todoItem("Old title")).toHaveCount(0);
  });

  test("deletes a todo", async ({ todoPage }) => {
    await todoPage.addTodo("Remove this todo");
    await todoPage.deleteTodo("Remove this todo");

    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test("completes a todo", async ({ todoPage }) => {
    await todoPage.addTodo("Completed work");
    await todoPage.completeTodo("Completed work");

    await expect(todoPage.todoItem("Completed work")).toHaveClass(/completed/);
    await expect(
      todoPage.todoItem("Completed work").getByRole("checkbox"),
    ).toBeChecked();
  });

  test("filters active and completed todos", async ({ todoPage }) => {
    await todoPage.addTodo("Active task");
    await todoPage.addTodo("Finished task");
    await todoPage.completeTodo("Finished task");

    await todoPage.showActive();
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItem("Active task")).toBeVisible();
    await expect(todoPage.todoItem("Finished task")).toHaveCount(0);

    await todoPage.showCompleted();
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItem("Finished task")).toBeVisible();
    await expect(todoPage.todoItem("Active task")).toHaveCount(0);

    await todoPage.showAll();
    await expect(todoPage.todoItems).toHaveCount(2);
  });
});
