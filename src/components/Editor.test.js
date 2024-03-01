import { render, screen, fireEvent } from "@testing-library/react";
import Editor from "./Editor";

describe("Editor: Editor tests", () => {
  let article;
  const handler = jest.fn();

  beforeEach(() => {
    article = {
      id: 42,
      title: "Title of sample article",
      contents: "Contents of the sample article",
      edited: new Date("2020-06-10T14:54:40Z").toISOString(),
    };

    handler.mockReset();
  });

  test("Editor: editor is populated by article", () => {
    render(<Editor currentArticle={{ ...article }} complete={handler} />);
    expect(screen.getByDisplayValue(article.title)).toBeVisible();
    expect(screen.getByDisplayValue(article.contents)).toBeVisible();
  });

  test("Editor: Props are not mutated", () => {
    const testArticle = { ...article };
    const { container } = render(
      <Editor complete={handler} currentArticle={testArticle} />,
    );
    const newTitle = "New title";
    const newBody = "New content";

    const titleInput = container.querySelector("input[type=text]");
    const contentsInput = container.querySelector("textarea");
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(titleInput, { target: { value: newTitle } });
    fireEvent.change(contentsInput, { target: { value: newBody } });

    fireEvent.click(saveButton);

    expect(testArticle).toEqual(article);
  });

  test("Editor: Save button is disabled without title", () => {
    const { container } = render(<Editor complete={handler} />);

    const titleInput = container.querySelector("input[type=text]");
    expect(titleInput).toHaveValue("");

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).toBeDisabled();

    fireEvent.change(titleInput, { target: { value: article.title } });

    expect(titleInput).toHaveValue(article.text);
    expect(saveButton).toBeEnabled();
  });

  test("Editor: Save button is disabled if title removed", () => {
    const { container } = render(
      <Editor currentArticle={{ ...article }} complete={handler} />,
    );

    const titleInput = container.querySelector("input[type=text]");
    expect(titleInput).toHaveValue(article.text);

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).toBeEnabled();

    fireEvent.change(titleInput, { target: { value: "" } });

    expect(titleInput).toHaveValue("");
    expect(saveButton).toBeDisabled();
  });

  test("Editor: Cancel button calls complete function with no arguments", () => {
    render(<Editor complete={handler} />);
    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    fireEvent.click(cancelButton);

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith();
  });

  test("Editor: Editor returns new article", () => {
    const { container } = render(<Editor complete={handler} />);
    const titleInput = container.querySelector("input[type=text]");
    const contentsInput = container.querySelector("textarea");
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(titleInput, { target: { value: article.title } });
    fireEvent.change(contentsInput, { target: { value: article.contents } });
    fireEvent.click(saveButton);

    expect(handler).toHaveBeenCalled();

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with

    expect(newArticle.title).toEqual(article.title);
    expect(newArticle.contents).toEqual(article.contents);
  });

  test("Editor: New article has current date", () => {
    const referenceDate = new Date();
    const { container } = render(<Editor complete={handler} />);
    const titleInput = container.querySelector("input[type=text]");
    const contentsInput = container.querySelector("textarea");
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(titleInput, { target: { value: article.title } });
    fireEvent.change(contentsInput, { target: { value: article.contents } });

    fireEvent.click(saveButton);

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with
    const dateDiff = new Date(newArticle.edited) - referenceDate;
    expect(dateDiff).toBeGreaterThanOrEqual(0);
  });

  test("Editor: Article contents are updated", () => {
    const { container } = render(
      <Editor complete={handler} currentArticle={{ ...article }} />,
    );

    const newTitle = "New title";
    const newBody = "New content";

    const titleInput = container.querySelector("input[type=text]");
    const contentsInput = container.querySelector("textarea");
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(titleInput, { target: { value: newTitle } });
    fireEvent.change(contentsInput, { target: { value: newBody } });

    fireEvent.click(saveButton);

    expect(handler).toHaveBeenCalled();

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with

    expect(newArticle.title).toEqual(newTitle);
    expect(newArticle.contents).toEqual(newBody);
  });

  test("Editor: Updated article has current date", () => {
    const referenceDate = new Date();
    const { container } = render(
      <Editor complete={handler} currentArticle={{ ...article }} />,
    );

    const newTitle = "New title";
    const newBody = "New content";

    const titleInput = container.querySelector("input[type=text]");
    const contentsInput = container.querySelector("textarea");
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(titleInput, { target: { value: newTitle } });
    fireEvent.change(contentsInput, { target: { value: newBody } });
    fireEvent.click(saveButton); // don't need to wait -- title already set

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with
    const dateDiff = new Date(newArticle.edited) - referenceDate;
    expect(dateDiff).toBeGreaterThanOrEqual(0);
  });

  test("Editor: Updated article retains old title if unchanged", () => {
    const { container } = render(
      <Editor complete={handler} currentArticle={{ ...article }} />,
    );

    const newBody = "New content";

    const contentsInput = container.querySelector("textarea");
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(contentsInput, { target: { value: newBody } });
    fireEvent.click(saveButton); // don't need to wait -- title already set

    expect(handler).toHaveBeenCalled();

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with

    expect(newArticle.title).toEqual(article.title);
  });

  test("Editor: Updated article retains other fields", () => {
    article = { ...article, id: 1 };
    const { container } = render(
      <Editor complete={handler} currentArticle={{ ...article }} />,
    );

    const newBody = "New content";

    const contentsInput = container.querySelector("textarea");
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(contentsInput, { target: { value: newBody } });
    fireEvent.click(saveButton); // don't need to wait -- title already set

    expect(handler).toHaveBeenCalled();

    const newArticle = handler.mock.calls[0][0]; // value the handler was called with

    expect(newArticle.id).toEqual(article.id);
  });
});
