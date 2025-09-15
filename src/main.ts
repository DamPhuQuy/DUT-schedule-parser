import { Subject, parseSubject } from "./Subject.ts";
import html2canvas from "html2canvas";
import "./style.scss";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input") as HTMLTextAreaElement | null;
  const button = document.getElementById("parse") as HTMLButtonElement | null;
  const output = document.getElementById("output") as HTMLDivElement | null;

  const heading = document.getElementById("heading");
  const image = document.getElementById("image");

  if (!input || !button || !output) return;

  if (heading && image) {
    setTimeout(() => {
      heading.classList.add("active");
      image.classList.add("active");
      input.classList.add("active");
      button.classList.add("active");
    }, 50);
  }

  button.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;

    const subjects = parseInput(text);

    output.innerHTML = ""; // clear output

    const table = createScheduleTable();
    fillTable(table, subjects);

    output.appendChild(table);
    output.appendChild(createSaveButton(table));
  });
});

// Parse input to Subject list
function parseInput(text: string): Subject[] {
  const lines = text.split("\n");
  const subjects: Subject[] = [];

  lines.forEach((line) => {
    const subject = parseSubject(line);
    if (subject) subjects.push(subject);
  });

  return subjects;
}

// Create empty table
function createScheduleTable(): HTMLTableElement {
  const table = document.createElement("table");
  table.className = "table-custom";

  table.appendChild(createHeaderRow());

  // Add 14 periods
  for (let i = 1; i <= 14; i++) {
    table.appendChild(createPeriodRow(i));
  }

  return table;
}

// Create header row
function createHeaderRow(): HTMLTableRowElement {
  const headerRow = document.createElement("tr");
  const headers = [
    "Tiết / Giờ",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  headers.forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    th.style.padding = "8px";
    th.style.backgroundColor = "#f2f2f2";
    headerRow.appendChild(th);
  });

  return headerRow;
}

// Period information
const periods: { [key: number]: string } = {
  1: "07:00 - 07:50",
  2: "08:00 - 08:50",
  3: "09:00 - 09:50",
  4: "10:00 - 10:50",
  5: "11:00 - 11:50",
  6: "12:30 - 13:20",
  7: "13:30 - 14:20",
  8: "14:30 - 15:20",
  9: "15:30 - 16:20",
  10: "16:30 - 17:20",
  11: "17:30 - 18:20",
  12: "18:30 - 19:20",
  13: "19:30 - 20:20",
  14: "20:30 - 21:20",
};

// Create period row
function createPeriodRow(period: number): HTMLTableRowElement {
  const row = document.createElement("tr");

  const periodCell = document.createElement("td");
  periodCell.style.padding = "8px";
  periodCell.style.backgroundColor = "#f2f2f2";
  periodCell.textContent = `Tiết ${period}\n${periods[period]}`;
  row.appendChild(periodCell);

  // Tạo 7 ô trống cho các ngày
  for (let d = 0; d < 7; d++) {
    const cell = document.createElement("td");
    cell.style.padding = "8px";
    cell.style.verticalAlign = "top";
    cell.style.minHeight = "60px";
    cell.style.border = "1px solid #ddd";
    row.appendChild(cell);
  }

  return row;
}

// Map from "Thứ x" to index
const dayMap: { [key: string]: number } = {
  "Thứ 2": 0,
  "Thứ 3": 1,
  "Thứ 4": 2,
  "Thứ 5": 3,
  "Thứ 6": 4,
  "Thứ 7": 5,
  "Chủ nhật": 6,
};

// Fill data
function fillTable(table: HTMLTableElement, subjects: Subject[]): void {
  const rows = Array.from(table.rows).slice(1); // bỏ header

  subjects.forEach((subject) => {
    const dayIndex = dayMap[subject.day!.trim()];
    if (dayIndex === undefined) return;

    const periodMatch = subject.period!.match(/^(\d+)-(\d+)$/);
    if (!periodMatch) return;

    const start = parseInt(periodMatch[1]);
    const end = parseInt(periodMatch[2]);

    for (let i = start; i <= end; i++) {
      if (i < 1 || i > 14) continue;

      const row = rows[i - 1];
      const dayCell = row.cells[dayIndex + 1];

      const container = document.createElement("div");
      container.className = "container";

      const nameElement = document.createElement("div");
      nameElement.textContent = subject.name ?? "";
      nameElement.className = "subject-name";

      const teacherElement = document.createElement("div");
      teacherElement.textContent = subject.teacher ?? "";
      teacherElement.className = "subject-teacher";

      const roomElement = document.createElement("div");
      roomElement.textContent = subject.room ?? "";
      roomElement.className = "subject-room";

      const weekElement = document.createElement("div");
      weekElement.textContent = subject.week ?? "";
      weekElement.className = "subject-week";

      container.appendChild(nameElement);
      container.appendChild(teacherElement);
      container.appendChild(roomElement);
      container.appendChild(weekElement);

      dayCell.appendChild(container);
    }
  });
}

// Create save button
function createSaveButton(table: HTMLTableElement): HTMLButtonElement {
  const saveBtn = document.createElement("button");
  saveBtn.className = "saveBtn";
  saveBtn.textContent = "Save to PNG";

  saveBtn.addEventListener("click", () => {
    html2canvas(table).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement("a");
      link.download = "schedule.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  return saveBtn;
}
