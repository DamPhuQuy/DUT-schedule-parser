import { Subject, parseSubject } from "./Subject.js";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input") as HTMLTextAreaElement | null;
  const button = document.getElementById("parse") as HTMLButtonElement | null;
  const output = document.getElementById("output") as HTMLDivElement | null;

  if (!input || !button || !output) return;

  button.addEventListener("click", () => {
    const text = input.value.trim();
    const lines = text.split("\n");

    const subjects: Subject[] = [];
    lines.forEach((line) => {
      const subject = parseSubject(line);
      if (subject) subjects.push(subject);
    });


    // Clear previous output
    output.innerHTML = "";

    // Create table
    const table = document.createElement("table");
    table.border = "1";
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.textAlign = "center";

    // Table headers
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
    table.appendChild(headerRow);

    // Define periods
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

    // Create rows
    const rows: HTMLTableRowElement[] = [];
    for (let i = 1; i <= 14; i++) {
      const row = document.createElement("tr");
      const periodCell = document.createElement("td");
      periodCell.style.padding = "8px";
      periodCell.style.backgroundColor = "#f2f2f2";
      periodCell.textContent = `Tiết ${i}\n${periods[i]}`;
      row.appendChild(periodCell);

      // Create empty cells
      for (let d = 0; d < 7; d++) {
        const cell = document.createElement("td");
        cell.style.padding = "8px";
        cell.style.verticalAlign = "top";
        cell.style.minHeight = "60px";
        cell.style.border = "1px solid #ddd";
        row.appendChild(cell);
      }

      table.appendChild(row);
      rows.push(row);
    }

    // Map day string to index
    const dayMap: { [key: string]: number } = {
      "Thứ 2": 0,
      "Thứ 3": 1,
      "Thứ 4": 2,
      "Thứ 5": 3,
      "Thứ 6": 4,
      "Thứ 7": 5,
      "Chủ nhật": 6,
    };

    // Fill table with data
    subjects.forEach((subject) =      const dayIndex = dayMap[subject.day!.trim()];

      if (dayIndex === undefined) return;

      const pattern = new RegExp("^(\\d+)-(\\d+)$"); // () is regex syntax to group element

      const periodMatch = subject.period!.match(pattern);
      if (!periodMatch) return;

      let start: number = parseInt(periodMatch[1]);
      let end: number = parseInt(periodMatch[2]);

      for (let i = start; i <= end; i++) {
        if (i < 1 || i > 14) continue;

        const row = rows[i - 1];

        const cells = row.cells;
        const dayCell = cells[dayIndex + 1];

        // dayCell.innerHTML = `${subject.name}<br>${subject.teacher}<br>${subject.room}<br>${subject.week}`;

        const container = document.createElement("div");

        const nameElement = document.createElement("div");
        nameElement.textContent = subject.name || "";
        nameElement.className = "subject-name";

        const teacherElement = document.createElement("div");
        teacherElement.textContent = subject.teacher || "";
        teacherElement.className = "subject-teacher";

        const roomElement = document.createElement("div");
        roomElement.textContent = subject.room || "";
        roomElement.className = "subject-room";

        const weekElement = document.createElement("div");
        weekElement.textContent = subject.week || "";
        weekElement.className = "subject-week";

        container.appendChild(nameElement);
        container.appendChild(teacherElement);
        container.appendChild(roomElement);
        container.appendChild(weekElement);

        dayCell.appendChild(container);
      }
    });

    output.appendChild(table);
  });
});
