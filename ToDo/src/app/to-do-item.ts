export class ToDoItem {
    title: string;
    date: Date;
    description: string;

    constructor(init: any) {
        this.title = init.title;
        this.date = init.date;
        this.description = init.description;
    }
}
