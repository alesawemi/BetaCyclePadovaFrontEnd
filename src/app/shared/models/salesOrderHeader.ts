export class SalesOrderHeader {

    salesOrderId: number | undefined;
    revisionNumber: number | undefined;
    // orderDate: Date | undefined|null;    //i define it in the backend
    // dueDate: Date | undefined|null;      //i define it in the backend
    // shipDate: Date | undefined|null;     //i define it in the backend
    status: number = 5;
    onlineOrderFlag: boolean = false;
    salesOrderNumber: string | undefined;
    purchaseOrderNumber: string | null | undefined;
    accountNumber: number | null | undefined;
    customerID: number | undefined;
    shipToAddressID: number | null | undefined;
    billToAddressID: number | null | undefined;
    shipMethod: string | undefined;
    creditCardApprovalCode: string | null | undefined;
    subTotal: number | undefined;
    taxAmt: number | undefined;
    freight: number | undefined;
    totalDue: number | undefined;
    comment: string | null | undefined;

}