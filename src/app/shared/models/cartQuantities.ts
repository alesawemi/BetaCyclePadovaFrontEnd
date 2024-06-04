//to keep track of how many items with same ProductId are being added to the cart/ordered

import { productSearch } from "./productSearchData";

export class pWithQuantity {
    product: productSearch = new productSearch;
    id: number = this.product.productId;
    quantity: number = 1;
}
