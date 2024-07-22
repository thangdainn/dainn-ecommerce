
export class Product {

  constructor(
    public id: number = 0,
    public name: string = '',
    public code: string = '',
    public description: string = '',
    public price: number = 0,
    public imgUrl: string = '',
    public categoryId: number = 0,
    public brandId: number = 0,
    public status: number = 1,
    public createdDate: Date = new Date(),
    public modifiedDate: Date = new Date(),
    public imageUrls: string[] = []
  ) {}
}
