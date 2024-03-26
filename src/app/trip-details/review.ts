export class Review {
  constructor(
    public tripId:number = 0,
    public nickname: string = '',
    public name: string = '',
    public rating: number = 0,
    public description: string = '',
    public date: Date | null = null
  ) {}
}
