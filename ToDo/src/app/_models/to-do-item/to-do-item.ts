export class ToDoItem {
    id: string;
    title: string;
    date: Date;
    description: string;
    groupId: string;

    constructor(init: any) {
        this.title = init.title;
        this.date = init.date;
        this.description = init.description;
        this.id = init.id;
        this.groupId = init.groupId;
    }
}
