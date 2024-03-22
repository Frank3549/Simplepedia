import { render, getDefaultNormalizer } from "@testing-library/react";
import Article from "./Article";

describe("Article: Article tests", () => {
  let article;

  beforeEach(() => {
    article = {
      id: 42,
      title: "Title of sample article",
      contents: "Body of the sample article",
      edited: new Date("2020-06-10T14:54:40Z").toISOString(),
    };
  });

  test("Article: title is displayed", () => {
    const { getByText } = render(<Article currentArticle={article} />);
    expect(getByText(article.title)).toBeInTheDocument();
    expect(getByText(article.title)).toBeVisible();
  });

  test("Article: body is displayed", () => {
    const { getByText } = render(<Article currentArticle={article} />);
    expect(getByText(article.contents)).toBeInTheDocument();
    expect(getByText(article.contents)).toBeVisible();
  });

  test("Article: date is displayed", () => {
    const { getByText } = render(<Article currentArticle={article} />);
    const expectedDate = new Date(article.edited).toLocaleString();
    expect(
      getByText(expectedDate, {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      }),
    ).toBeInTheDocument();
    expect(
      getByText(expectedDate, {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      }),
    ).toBeVisible();
  });
});
