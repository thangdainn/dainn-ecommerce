export class Size {
    constructor(
        public id: number = 0,
        public name: string = '',
        public description: string = '',
        public status: number = 1,
        public createdDate: Date = new Date(),
        public modifiedDate: Date = new Date(),
      ) {}
}
