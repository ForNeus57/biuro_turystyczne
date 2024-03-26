export class Trip {
  public static readonly defaultImagePath: string = 'assets/images/'

  // public id: number
  // public name: string
  // public location: string
  // public startDate: Date
  // public endDate: Date
  // public price: number
  // public availableTickets: number
  // public description: string
  // public imagePath: string
  // public reviews: number
  // public rating: number

  constructor(
    public id = 0,
    public name = 'default',
    public location = 'default',
    public startDate = new Date(),
    public endDate = new Date(),
    public price = 0,
    public availableTickets = 0,
    public description = 'default',
    public imagePath = 'default',
    public reviews = 0 ,
    public rating = 0
  ) {
    // this.id = id
    // this.name = name
    // this.location = location
    // this.startDate = startDate
    // this.endDate = endDate
    // this.price = price
    // this.availableTickets = availableTickets
    // this.description = description
    // if (!this.imagePath.startsWith(Trip.defaultImagePath)) {
    //   this.imagePath = Trip.defaultImagePath + 'default.png'
    // }
    // this.reviews = reviews
    // this.rating = rating
  }
}
