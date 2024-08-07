export default class MenuRecipe {
    id: number = 0;
    name: string = '';
    order: number = 0;
    amount: string = '';
    imagePath: string = '';

    constructor(id: number, name: string, order: number, amount: string, imagePath: string) {
        this.id = id;
        this.name = name;
        this.order = order;
        this.amount = amount;
        this.imagePath = imagePath;
    }
};