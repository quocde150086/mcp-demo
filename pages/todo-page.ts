import type { Locator, Page } from "@playwright/test";

export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder("What needs to be done?");
    this.todoItems = page.locator(".todo-list > li");
  }

  async goto(): Promise<void> {
    await this.page.goto("");
  }

  async addTodo(title: string): Promise<void> {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press("Enter");
  }

  todoItem(title: string): Locator {
    return this.todoItems.filter({
      has: this.page.getByText(title, { exact: true }),
    });
  }

  async completeTodo(title: string): Promise<void> {
    await this.todoItem(title).getByRole("checkbox").check();
  }

  async editTodo(currentTitle: string, newTitle: string): Promise<void> {
    const item = this.todoItem(currentTitle);
    await item.getByText(currentTitle, { exact: true }).dblclick();
    const editInput = item.locator("input.edit");
    await editInput.fill(newTitle);
    await editInput.press("Enter");
  }

  async deleteTodo(title: string): Promise<void> {
    const item = this.todoItem(title);
    await item.hover();
    await item.locator("button.destroy").click();
  }

  async showAll(): Promise<void> {
    await this.page.getByRole("link", { name: "All", exact: true }).click();
  }

  async showActive(): Promise<void> {
    await this.page.getByRole("link", { name: "Active", exact: true }).click();
  }

  async showCompleted(): Promise<void> {
    await this.page
      .getByRole("link", { name: "Completed", exact: true })
      .click();
  }
}
