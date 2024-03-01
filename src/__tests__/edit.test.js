import { render, screen, fireEvent } from "@testing-library/react";

import mockRouter from "next-router-mock";
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
import SimplepediaEditor from "../pages/articles/[id]/edit";
import SimplepediaCreator from "../pages/edit";

import rawArticles from "../../data/test-data.json";

// Replace the router with the mock
jest.mock("next/router", () => require("next-router-mock")); // eslint-disable-line global-require

// Tell the mock router about the pages we will use (so we can use dynamic routes)
mockRouter.useParser(
  createDynamicRouteParser([
    // These paths should match those found in the `/pages` folder:
    "/articles/[[...id]]",
    "/articles/[id]/edit",
    "/edit",
  ]),
);

mockRouter.back = jest.fn();

const newArticle = {
  title: "White Robot",
  contents: "Silent white beings from the land of fiction.",
};

describe("SimplepediaEditor: editor page tests", () => {
  const setCollectionMock = jest.fn();
  const setCurrentArticleMock = jest.fn();
  let articles;

  beforeEach(() => {
    articles = rawArticles.map((art) => ({ ...art }));
  });

  afterEach(() => {
    setCollectionMock.mockReset();
    setCurrentArticleMock.mockReset();
    mockRouter.back.mockReset();
  });

  describe("Simplepedia editing mode tests", () => {
    test("SimplepediaCreator: No fields have content", () => {
      mockRouter.setCurrentUrl("/edit");
      const { container } = render(
        <SimplepediaCreator
          collection={articles}
          setCollection={setCollectionMock}
          setCurrentArticle={setCurrentArticleMock}
        />,
      );

      const titleEditor = container.querySelector("input[type=text]");
      const contentsEditor = container.querySelector("textarea");

      expect(titleEditor.value).toBe("");
      expect(contentsEditor.value).toBe("");
    });

    test("SimplepediaEditor: Editor is populated with specific article", () => {
      const testArticle = articles[1];
      mockRouter.setCurrentUrl(`/articles/${testArticle.id}/edit`);
      const { container } = render(
        <SimplepediaEditor
          collection={articles}
          setCollection={setCollectionMock}
          setCurrentArticle={setCurrentArticleMock}
          currentArticle={{ ...testArticle }}
        />,
      );

      const titleEditor = container.querySelector("input[type=text]");
      const contentsEditor = container.querySelector("textarea");

      expect(titleEditor.value).toBe(testArticle.title);
      expect(contentsEditor.value).toBe(testArticle.contents);
    });
  });

  describe("SimplepediaCreator: Create functionality tests", () => {
    const createNewArticle = () => {
      const { container } = render(
        <SimplepediaCreator
          collection={articles}
          setCollection={setCollectionMock}
          setCurrentArticle={setCurrentArticleMock}
        />,
      );

      const titleEditor = container.querySelector("input[type=text]");
      const contentsEditor = container.querySelector("textarea");

      fireEvent.change(titleEditor, {
        target: { value: newArticle.title },
      });
      fireEvent.change(contentsEditor, {
        target: { value: newArticle.contents },
      });
    };

    beforeEach(() => {
      mockRouter.setCurrentUrl("/edit");
      createNewArticle();
    });

    test("SimplepediaCreator: Saving added article shows new article", () => {
      const save = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(save);

      const article = setCurrentArticleMock.mock.calls[0][0];

      expect(article.title).toBe(newArticle.title);
      expect(article.contents).toBe(newArticle.contents);
      expect(article.id).toBe(106);
    });

    test("SimplepediaCreator: Saving added article adds article to collection", () => {
      const save = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(save);
      const [args] = setCollectionMock.mock.calls;
      const check = args[0].some(
        (item) =>
          item.title === newArticle.title &&
          item.contents === newArticle.contents,
      );
      expect(check).toBeTruthy();
    });

    test("SimplepediaCreator: New articles have id one greater than largest id", () => {
      const save = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(save);
      const [args] = setCollectionMock.mock.calls;
      const article = args[0].find((item) => item.id === 106);

      expect(article.title).toBe(newArticle.title);
      expect(article.contents).toBe(newArticle.contents);
    });

    test("SimplepediaCreator: Canceling add returns to current article", () => {
      const cancel = screen.queryByRole("button", { name: "Cancel" });
      fireEvent.click(cancel);
      expect(setCollectionMock).not.toHaveBeenCalled();
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  describe("SimplepediaEditor: Edit functionality tests", () => {
    let oldArticle;

    const editArticle = (title, contents) => {
      const { container } = render(
        <SimplepediaEditor
          collection={articles}
          setCollection={setCollectionMock}
          setCurrentArticle={setCurrentArticleMock}
          currentArticle={{ ...oldArticle }}
        />,
      );

      const titleEditor = container.querySelector("input[type=text]");
      const contentsEditor = container.querySelector("textarea");

      fireEvent.change(titleEditor, {
        target: { value: title },
      });
      fireEvent.change(contentsEditor, {
        target: { value: contents },
      });
    };

    beforeEach(() => {
      oldArticle = { ...articles[1] };
      mockRouter.push(`/articles/${oldArticle.id}/edit`);
      editArticle(newArticle.title, newArticle.contents);
    });

    test("SimplepediaEditor: Saving edit shows new article", () => {
      const save = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(save);

      const article = setCurrentArticleMock.mock.calls[0][0];
      expect(article.id).toBe(oldArticle.id);
    });

    test("SimplepediaEditor: Saving edit updates article in collection", () => {
      const save = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(save);

      const [args] = setCollectionMock.mock.calls;
      const updatedArticle = args[0].find((item) => item.id === oldArticle.id);

      expect(updatedArticle.title).toBe(newArticle.title);
      expect(updatedArticle.contents).toBe(newArticle.contents);
    });

    test("SimplepediaEditor: New article replaces old one", () => {
      const save = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(save);

      const [args] = setCollectionMock.mock.calls;
      expect(args[0].length).toBe(articles.length);

      expect(
        args[0].find((item) => item.title === oldArticle.title),
      ).toBeUndefined();
    });

    test("SimplepediaEditor: Canceling edit returns to current article", () => {
      const cancel = screen.queryByRole("button", { name: "Cancel" });
      fireEvent.click(cancel);
      expect(setCollectionMock).not.toHaveBeenCalled();
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });
});
