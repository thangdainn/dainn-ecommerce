export class User {
    constructor(
        public id: number = 0,
        public email: string = '',
        public name: string = '',
        public password: string = '',
        public status: number = 1,
        public provider: string = '',
        public roleName: string = '',
        public createdDate: string = '',
    ) {}
}
