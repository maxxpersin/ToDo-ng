export class User {
    firstName: string;
    lastName: string;
    email: string;
    id: string;

    constructor(f: string, l: string, e: string, i: string) {
        this.firstName = f;
        this.lastName = l;
        this.email = e;
        this.id = i;
    }
}
