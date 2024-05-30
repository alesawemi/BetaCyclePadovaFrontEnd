export class SalesOrderDetail{
    salesOrderID: number | undefined;
    salesOrderDetailID: number | undefined;
    orderQty: number = 1;
    productID: number | undefined;
    unitPrice: number | undefined;
    unitPriceDiscount: number = 0.00;
    lineTotal: number | undefined;
}