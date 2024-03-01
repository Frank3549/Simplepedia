import { render, screen, fireEvent } from "@testing-library/react";

import mockRouter from "next-router-mock";
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
import MainApp from "../pages/_app";
import Simplepedia from "../pages/articles/[[...id]]";
import SimplepediaEditor from "../pages/articles/[id]/edit";
import SimplepediaCreator from "../pages/edit";
import articles from "../../data/seed.json";

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

const sampleSections = [
  ...new Set(articles.map((article) => article.title.charAt(0).toUpperCase())),
].sort();

describe("End to end testing", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

  describe("Testing Simplepedia refactoring", () => {
    test("Correct sections are displayed", () => {
      render(<MainApp Component={Simplepedia} />);
      const items = screen.getAllByTestId("section");
      expect(items).toHaveLength(sampleSections.length);

      sampleSections.forEach((section) => {
        expect(screen.getByText(section)).toBeVisible();
      });
    });

    test("Selecting a section displays correct titles", async () => {
      render(<MainApp Component={Simplepedia} />);

      const section = sampleSections[2];
      const sampleArticles = articles.filter(
        (d) => d.title[0].toUpperCase() === section,
      );
      const sectionComponent = await screen.findByText(section);

      fireEvent.click(sectionComponent);

      const titles = await screen.findAllByTestId("title");
      expect(titles).toHaveLength(sampleArticles.length);

      sampleArticles.forEach((article) => {
        expect(screen.getByText(article.title)).toBeVisible();
      });
    });

    test("Selecting a title requests the correct article", async () => {
      render(<MainApp Component={Simplepedia} />);

      const article = articles[2];
      const sectionComponent = await screen.findByText(
        article.title[0].toUpperCase(),
      );

      fireEvent.click(sectionComponent);

      const titleComponent = await screen.findByText(article.title);

      fireEvent.click(titleComponent);

      expect(mockRouter.asPath).toBe(`/articles/${article.id}`);
    });

    test("Displayed article matches the route", () => {
      const article = articles[2];
      mockRouter.setCurrentUrl(`/articles/${article.id}`);
      render(<MainApp Component={Simplepedia} />);

      const titles = screen.getAllByText(article.title);
      expect(titles).toHaveLength(2);

      expect(screen.getByText(article.contents)).toBeInTheDocument();
    });
  });

  describe("Testing Edit functionality", () => {
    test("/edit renders article creator with empty fields", () => {
      mockRouter.setCurrentUrl(`/edit`);
      const { container } = render(<MainApp Component={SimplepediaCreator} />);

      const titleEditor = container.querySelector("input[type=text]");
      const contentsEditor = container.querySelector("textarea");

      expect(titleEditor.value).toBe("");
      expect(contentsEditor.value).toBe("");
    });

    test("/articles/id/edit enables editing specified article", () => {
      const article = articles[2];
      mockRouter.setCurrentUrl(`/articles/${article.id}/edit`);
      const { container } = render(<MainApp Component={SimplepediaEditor} />);

      const titleEditor = container.querySelector("input[type=text]");
      const contentsEditor = container.querySelector("textarea");

      expect(titleEditor.value).toBe(article.title);
      expect(contentsEditor.value).toBe(article.contents);
    });
  });
});
