export class User {
    name: string;
    email: string;
    id: string;
    sessionId: string;

    constructor(n: string, e: string, i: string, s: string) {
        this.name = n;
        this.email = e;
        this.id = i;
        this.sessionId = s;
    }
}
