import { marked } from "marked";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input") as HTMLTextAreaElement | null;
  const button = document.getElementById("parse") as HTMLButtonElement | null;
  const output = document.getElementById(
    "output"
  ) as HTMLParagraphElement | null;

  if (input && button && output) {
    button.addEventListener("click", () => {
      const text = input.value.trim();

      let lines: string[] = text.split("\n");

      output.innerHTML = "";

      let values: string[][] = [];

      for (let i: number = 0; i < lines.length; i++) {
        let cols: string[] = lines[i].split("\t");
        // index: 2 6 7 8

        let temp: string[] = [cols[0], cols[2], cols[6], cols[7], cols[8]];

        values.push(temp);
      }
      const table = document.createElement("table");
      table.border = "1";

      values.forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });

      output.appendChild(table);
    });
  }
});
