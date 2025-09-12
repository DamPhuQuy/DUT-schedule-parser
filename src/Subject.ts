export class Subject {
  constructor(
    public id?: number,
    public name?: string,
    public teacher?: string,
    public day?: string,
    public period?: string,
    public room?: string,
    public week?: string
  ) {}
}

export function parseSubject(line: string): Subject | null {
  const cols: string[] = line.split("\t");
  if (cols.length < 7) return null;

  // 0 2 6 7 8

  const id = parseInt(cols[0]);
  const name = cols[2];
  const teacher = cols[6];

  const temp: string[] = cols[7].split(",");
  if (temp.length != 3) return null;

  const day = temp[0]?.trim();
  const period = temp[1]?.trim();
  const room = temp[2]?.trim();

  const week = cols[8]?.trim();

  if (!day || !period) return null;

  return new Subject(id, name, teacher, day, period, room, week);
}
