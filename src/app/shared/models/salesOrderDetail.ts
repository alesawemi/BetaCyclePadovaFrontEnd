export class SalesOrderDetail{
    salesOrderId: number | undefined;
    salesOrderDetailId: number | undefined;
    orderQty: number = 1;
    productId: number | undefined;
    unitPrice: number | undefined;
    unitPriceDiscount: number = 0.00;
    lineTotal: number | undefined;
}