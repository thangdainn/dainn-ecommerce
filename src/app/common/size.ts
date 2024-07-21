export class Size {
    constructor(
        public id: string = '',
        public name: string = '',
        public description: string = '',
        public quantity: number = 0,
        public status: number = 0,
        public createdDate: Date = new Date(),
        public modifiedDate: Date = new Date(),
      ) {}
}
