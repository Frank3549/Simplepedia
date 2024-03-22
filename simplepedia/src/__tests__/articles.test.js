/*
 Tests of our top-level component.

 Because of the way that Next.js works, we can't leave a test file in the 
 'pages' directory, so we need to relocate it somewhere else.
 */

import { render, screen, fireEvent } from "@testing-library/react";

import mockRouter from "next-router-mock";
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
import Simplepedia from "../pages/articles/[[...id]]";

import articles from "../../data/test-data.json";

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

describe("Simplepedia: integration tests", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

  test("Simplepedia: Displaying sections", () => {
    render(<Simplepedia collection={articles} setCurrentArticle={jest.fn()} />);
    const items = screen.getAllByTestId("section");

    expect(items).toHaveLength(sampleSections.length);
    sampleSections.forEach((section) => {
      expect(screen.getByText(section)).toBeVisible();
    });
  });

  test("Simplepedia: Article selection", () => {
    const testArticle = articles[1];
    mockRouter.push(`/articles/${testArticle.id}`);
    render(
      <Simplepedia
        collection={articles}
        setCurrentArticle={jest.fn()}
        currentArticle={{ ...testArticle }}
      />,
    );

    const titles = screen.getAllByText(testArticle.title);
    expect(titles).toHaveLength(2);

    expect(screen.getByText(testArticle.contents)).toBeInTheDocument();
  });

  test("Simplepedia: Displays article", () => {
    const setCurrentArticle = jest.fn();
    render(
      <Simplepedia
        collection={articles}
        setCurrentArticle={setCurrentArticle}
      />,
    );
    const target = articles[1]; // should be Dominators

    const section = screen.getByText(target.title.charAt(0));
    fireEvent.click(section);

    const title = screen.getByText(target.title);

    fireEvent.click(title);
    expect(setCurrentArticle).lastCalledWith({ ...target });
  });
});

describe("Simplepedia: Button tests", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

  test("Simplepedia: Only Add button is visible with no selection", () => {
    render(<Simplepedia collection={articles} setCurrentArticle={jest.fn()} />);
    expect(screen.queryByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
  });

  test("Simplepedia: Simplepedia: Edit button visible when article selected", () => {
    mockRouter.push(`/articles/${articles[1].id}`);
    render(
      <Simplepedia
        collection={articles}
        currentArticle={{ ...articles[1] }}
        setCurrentArticle={jest.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  test("Simplepedia: add button opens editor", () => {
    render(<Simplepedia collection={articles} setCurrentArticle={jest.fn()} />);
    const add = screen.queryByRole("button", { name: "Add" });

    fireEvent.click(add);
    expect(mockRouter.asPath).toBe("/edit");
  });

  test("Simplepedia: add button opens editor w/o currentArticle", () => {
    mockRouter.push(`/articles/${articles[1].id}`);
    render(
      <Simplepedia
        collection={articles}
        currentArticle={{ ...articles[1] }}
        setCurrentArticle={jest.fn()}
      />,
    );
    const add = screen.queryByRole("button", { name: "Add" });

    fireEvent.click(add);
    expect(mockRouter.asPath).toBe("/edit");
  });

  test("Simplepedia: edit button opens editor w/ currentArticle", () => {
    mockRouter.push(`/articles/${articles[1].id}`);
    render(
      <Simplepedia
        collection={articles}
        currentArticle={{ ...articles[1] }}
        setCurrentArticle={jest.fn()}
      />,
    );
    const add = screen.queryByRole("button", { name: "Edit" });

    fireEvent.click(add);
    expect(mockRouter.asPath).toBe(`/articles/${articles[1].id}/edit`);
  });
});
