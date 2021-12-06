export class Result {
  id: number;
  x: number;
  y: number;
  r: number;
  hit: boolean;

  constructor(id: number,
  x: number,
  y: number,
  r: number,
  hit: boolean) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.hit = hit;
  }
}
