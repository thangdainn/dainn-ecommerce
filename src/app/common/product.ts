
export class Product {

  constructor(
    public id: string,
    public name: string,
    public code: string,
    public description: string,
    public price: number,
    public imgUrl: string,
    public categoryId: number,
    public brandId: number,
    public status: number,
    public createdDate: Date,
    public modifiedDate: Date,
  ) {}
}
