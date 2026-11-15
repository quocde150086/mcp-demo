import { test, expect } from "../fixtures/test";
import { TodoPage } from "../pages/todo-page";

async function performUiAction(
  todoPage: TodoPage,
  name: string,
  action: () => Promise<void>,
): Promise<void> {
  await test.step(name, async () => {
    await action();
    await todoPage.page.waitForTimeout(2000);
  });
}

test.describe("TodoMVC", () => {
  test("adds a todo", async ({ todoPage }) => {
    await performUiAction(todoPage, "Add a todo", () =>
      todoPage.addTodo("Write Playwright tests"),
    );

    await test.step("Verify the todo was added", async () => {
      await expect(todoPage.todoItem("Write Playwright tests")).toBeVisible();
      await expect(todoPage.todoItems).toHaveCount(1);
    });
  });

  test("edits one todo and deletes another", async ({ todoPage }) => {
    await performUiAction(todoPage, "Add the todo to edit", () =>
      todoPage.addTodo("Old title"),
    );
    await performUiAction(todoPage, "Add the todo to delete", () =>
      todoPage.addTodo("Remove this todo"),
    );
    await performUiAction(todoPage, "Edit the first todo", () =>
      todoPage.editTodo("Old title", "Updated title"),
    );
    await performUiAction(todoPage, "Delete the second todo", () =>
      todoPage.deleteTodo("Remove this todo"),
    );

    await test.step("Verify the edit and deletion", async () => {
      await expect(todoPage.todoItem("Updated title")).toBeVisible();
      await expect(todoPage.todoItem("Old title")).toHaveCount(0);
      await expect(todoPage.todoItem("Remove this todo")).toHaveCount(0);
      await expect(todoPage.todoItems).toHaveCount(1);
    });
  });

  test("completes a todo", async ({ todoPage }) => {
    await performUiAction(todoPage, "Add a todo", () =>
      todoPage.addTodo("Completed work"),
    );
    await performUiAction(todoPage, "Complete the todo", () =>
      todoPage.completeTodo("Completed work"),
    );

    await test.step("Verify the todo is completed", async () => {
      await expect(todoPage.todoItem("Completed work")).toHaveClass(/completed/);
      await expect(
        todoPage.todoItem("Completed work").getByRole("checkbox"),
      ).toBeChecked();
    });
  });

  test("filters active and completed todos", async ({ todoPage }) => {
    await performUiAction(todoPage, "Add an active todo", () =>
      todoPage.addTodo("Active task"),
    );
    await performUiAction(todoPage, "Add a todo to complete", () =>
      todoPage.addTodo("Finished task"),
    );
    await performUiAction(todoPage, "Complete the second todo", () =>
      todoPage.completeTodo("Finished task"),
    );

    await performUiAction(todoPage, "Filter active todos", () =>
      todoPage.showActive(),
    );
    await test.step("Verify only the active todo is shown", async () => {
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.todoItem("Active task")).toBeVisible();
      await expect(todoPage.todoItem("Finished task")).toHaveCount(0);
    });

    await performUiAction(todoPage, "Filter completed todos", () =>
      todoPage.showCompleted(),
    );
    await test.step("Verify only the completed todo is shown", async () => {
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.todoItem("Finished task")).toBeVisible();
      await expect(todoPage.todoItem("Active task")).toHaveCount(0);
    });

    await performUiAction(todoPage, "Show all todos", () => todoPage.showAll());
    await test.step("Verify all todos are shown", async () => {
      await expect(todoPage.todoItems).toHaveCount(2);
    });
  });
});
