import { screen, fireEvent, render } from "@testing-library/react";
import SectionsView from "./SectionsView";

describe("SectionsView tests", () => {
  const sampleSections = ["3", "A", "B"];

  test("SectionsView displays all sections", async () => {
    render(
      <SectionsView sections={sampleSections} setCurrentSection={jest.fn()} />,
    );
    sampleSections.forEach((section) => {
      expect(screen.getByText(section)).toBeVisible();
    });
  });

  test("SectionsView displays only the requested sections", async () => {
    render(
      <SectionsView sections={sampleSections} setCurrentSection={jest.fn()} />,
    );
    const items = await screen.getAllByTestId("section");
    expect(items).toHaveLength(sampleSections.length);
  });

  test("Clicking on a section selects it", async () => {
    const handler = jest.fn();
    render(
      <SectionsView sections={sampleSections} setCurrentSection={handler} />,
    );

    const elements = await Promise.all(
      sampleSections.map((section) => screen.findByText(section)),
    );
    sampleSections.forEach((section, i) => {
      fireEvent.click(elements[i]);
      expect(handler).toHaveBeenCalledWith(section);
    });
  });

  test("Sections are displayed in alphabetical order", async () => {
    const scrambledSections = ["G", "Z", "A", "2", "1"];
    render(
      <SectionsView
        sections={[...scrambledSections]}
        setCurrentSection={jest.fn()}
      />,
    );

    const sortedSections = [...scrambledSections];

    sortedSections.sort((t1, t2) => t1.localeCompare(t2));

    const items = await screen.getAllByTestId("section");
    const displayedSections = items.map((item) => item.innerHTML);

    expect(displayedSections).toEqual(sortedSections);
  });

  test("Props are not mutated", () => {
    const originalSections = ["G", "Z", "A", "2", "1"];
    const inputSections = [...originalSections];
    render(
      <SectionsView sections={inputSections} setCurrentSection={jest.fn()} />,
    );

    expect(inputSections).toEqual(originalSections);
  });
});
