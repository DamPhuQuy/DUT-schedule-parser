import { marked } from "marked";

class Subject {
  id: number | undefined;
  name: string | undefined;
  teacher: string | undefined;
  day: string | undefined;
  period: string | undefined;
  room: string | undefined;
  week: string | undefined;

  constructor(
    id: number | undefined,
    name: string | undefined,
    teacher: string | undefined,
    day: string | undefined,
    period: string | undefined,
    room: string | undefined,
    week: string | undefined
  ) {
    this.id = id;
    this.name = name;
    this.teacher = teacher;
    this.day = day;
    this.period = period;
    this.room = room;
    this.week = week;
  }
}

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

      let subjects: Map<number, Subject> = new Map();

      for (let i: number = 0; i < lines.length; i++) {
        let cols: string[] = lines[i].split("\t");
        // index: 0 2 6 7 8

        let id: number = parseInt(cols[0]);
        let name: string = cols[2];
        let teacher: string = cols[6];

        let temp: string[] = cols[7].split(",");
        let day = temp[0];
        let period = temp[1];
        let room = temp[2];

        let week: string = cols[8];

        let subject = new Subject(id, name, teacher, day, period, room, week);

        subjects.set(id, subject);
      }

      // DOM create table element
      let table = document.createElement("table");
      table.border = "1";
      table.style.borderCollapse = "collapse";

      // table headers
      let header = document.createElement("tr");
      let headers: string[] = [];
      headers.push("Tiết / Thứ");
      for (let i: number = 0; i <= 6; i++) {
        if (i === 6) headers.push("Chủ nhật");
        else headers.push(`Thứ ${i + 2}`);
      }
      headers.forEach((h) => {
        let th = document.createElement("th");
        th.textContent = h;
        header.appendChild(th);
      });
      table.appendChild(header);

      // Class period
      const deltaTime = 50 * 60 * 1000;
      const restTime = 10 * 60 * 1000;

      const today = new Date();
      let timeStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        7,
        0,
        0
      );

      let timeStartNoon = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        12,
        0,
        0
      );

      let periods: Map<number, string> = new Map();  

      for (let period = 1; period <= 14; period++) {
        let row = document.createElement("tr");

        let periodCell = document.createElement("td");

        let p = (date: Date) => {
          // function pointer
          const hour = date.getHours().toString().padStart(2, "0");
          const minute = date.getMinutes().toString().padStart(2, "0");
          return `${hour}:${minute}`;
        };

        let timeEnd: Date = new Date(timeStart.getTime() + deltaTime);

        let full: string = `${p(timeStart)} - ${p(timeEnd)}`;

        periods.set(period, full); 

        periodCell.textContent = full;
        row.appendChild(periodCell);

        for (let d: number = 0; d <= 6; d++) {
          let cell = document.createElement("td");
          
          row.appendChild(cell);
        }

        timeStart.setTime(timeEnd.getTime() + restTime);
        if (timeStart.getTime() === timeStartNoon.getTime()) {
          timeStart.setTime(timeStartNoon.getTime() + 30 * 60 * 1000);
        }
        table.appendChild(row);
      }

      output.appendChild(table);
    });
  }
});
