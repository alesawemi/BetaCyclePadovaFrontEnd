
export class AddProduct{
    Name: string = '';    
    ProductNumber: string = '';   
    StandardCost: number = 0.;   
    ListPrice: number = 0.;   
    SellStartDate: string = '';    
    ProductCategoryID:number = 0;  
    thumbNailPhoto: string = '';
    largeImage: string = '';
    productModelId: number = 0;

}

export class dbProduct {
    id: number = 0;
    color: string = '';
    discontinuedDate: Date = new Date;
    largeImage: string | null = '';
    listPrice: number = 0;
    modifiedDate: Date = new Date;
    name: string = '';
    productCategory: string | null = '';
    productCategoryId: number = 0;
    productId: number = 0;
    productModel: string | null = '';
    productModelId: number = 0;
    productNumber: string = '';
    rowguid: string = '';
    salesOrderDetails: any[] = []; // You may define a proper type for this if needed
    sellEndDate: Date = new Date;
    sellStartDate: Date = new Date;
    size: string = '';
    standardCost: number = 0;
    thumbNailPhoto: string | null = '';
    thumbnailPhotoFileName: string | null = '';
    weight: number = 0;
}
    // constructor(data: any) {
    //   // Map data to properties
    //   this.id = data.id || 0;
    //   this.color = data.color || '';
    //   this.discontinuedDate = new Date(data.discontinuedDate);
    //   this.largeImage = data.largeImage || null;
    //   this.listPrice = data.listPrice || 0;
    //   this.modifiedDate = new Date(data.modifiedDate);
    //   this.name = data.name || '';
    //   this.productCategory = data.productCategory || null;
    //   this.productCategoryId = data.productCategoryId || 0;
    //   this.productId = data.productId || 0;
    //   this.productModel = data.productModel || null;
    //   this.productModelId = data.productModelId || 0;
    //   this.productNumber = data.productNumber || '';
    //   this.rowguid = data.rowguid || '';
    //   this.salesOrderDetails = data.salesOrderDetails || [];
    //   this.sellEndDate = new Date(data.sellEndDate);
    //   this.sellStartDate = new Date(data.sellStartDate);
    //   this.size = data.size || '';
    //   this.standardCost = data.standardCost || 0;
    //   this.thumbNailPhoto = data.thumbNailPhoto || null;
    //   this.thumbnailPhotoFileName = data.thumbnailPhotoFileName || null;
    //   this.weight = data.weight || 0;
    // }
  
  




