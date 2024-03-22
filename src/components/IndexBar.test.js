import { screen, fireEvent, render } from "@testing-library/react";
import IndexBar from "./IndexBar";
import articles from "../../data/test-data.json";

const sampleSections = [
  ...new Set(articles.map((article) => article.title.charAt(0).toUpperCase())),
].sort();

describe("IndexBar: IndexBar initialization", () => {
  test("IndexBar: Handles empty array without error", () => {
    const handler = jest.fn();
    render(<IndexBar collection={[]} setCurrentArticle={handler} />);
  });
});

describe("IndexBar: Basic IndexBar functionality", () => {
  let selectFunction;

  beforeEach(() => {
    selectFunction = jest.fn();
    render(
      <IndexBar collection={articles} setCurrentArticle={selectFunction} />,
    );
  });

  test("IndexBar: Fetches and displays sections", async () => {
    const items = await screen.findAllByTestId("section");

    expect(items).toHaveLength(sampleSections.length);
    sampleSections.forEach((section) => {
      expect(screen.getByText(section)).toBeVisible();
    });
  });

  test("IndexBar: Clicking on a section displays titles", async () => {
    const section = await screen.findByText(sampleSections[0]);

    fireEvent.click(section);

    const titles = await screen.findAllByTestId("title");

    const expectedArticles = articles.filter(
      (article) => article.title.charAt(0).toUpperCase() === sampleSections[0],
    );

    expect(titles).toHaveLength(expectedArticles.length);

    expectedArticles.forEach((article) => {
      expect(screen.getByText(article.title)).toBeVisible();
    });
  });

  test("IndexBar: Changing sections changes the titles", async () => {
    let section = await screen.findByText(sampleSections[0]);

    fireEvent.click(section);

    section = await screen.findByText(sampleSections[1]);

    fireEvent.click(section);

    const titles = await screen.findAllByTestId("title");
    const expectedArticles = articles.filter(
      (article) => article.title.charAt(0).toUpperCase() === sampleSections[1],
    );
    expect(titles).toHaveLength(expectedArticles.length);

    expectedArticles.forEach((article) => {
      expect(screen.getByText(article.title)).toBeInTheDocument();
    });
  });

  test("IndexBar: Clicking a title selects the article", async () => {
    const section = await screen.findByText("D");
    fireEvent.click(section);
    const title = await screen.findByText("Dalek");

    fireEvent.click(title);

    expect(selectFunction).toHaveBeenCalledWith(articles[4]);
  });
});

describe("IndexBar: IndexBar with currentArticle", () => {
  let selectFunction;

  beforeEach(() => {
    selectFunction = jest.fn();
  });

  test("IndexBar: currentArticle sets the current section", () => {
    render(
      <IndexBar
        collection={articles}
        setCurrentArticle={selectFunction}
        currentArticle={articles[1]}
      />,
    );

    expect(screen.queryByText(articles[1].title)).toBeInTheDocument();
  });

  test("IndexBar: Changing currentArticle updates section", () => {
    const { rerender } = render(
      <IndexBar
        collection={articles}
        setCurrentArticle={selectFunction}
        currentArticle={articles[1]}
      />,
    );
    expect(screen.queryByText(articles[1].title)).toBeInTheDocument();
    expect(screen.queryByText(articles[0].title)).not.toBeInTheDocument();

    rerender(
      <IndexBar
        collection={articles}
        setCurrentArticle={selectFunction}
        currentArticle={articles[0]}
      />,
    );
    expect(screen.queryByText(articles[1].title)).not.toBeInTheDocument();
    expect(screen.queryByText(articles[0].title)).toBeInTheDocument();
  });
});
