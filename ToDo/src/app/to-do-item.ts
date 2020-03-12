export class ToDoItem {
    id: string;
    title: string;
    date: Date;
    description: string;

    constructor(init: any) {
        this.title = init.title;
        this.date = init.date;
        this.description = init.description;
        this.id = '';
    }
}
