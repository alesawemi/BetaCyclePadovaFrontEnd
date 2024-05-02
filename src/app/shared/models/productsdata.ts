export class Product{

    productId: number = 0;
    name: string = '';  
    productNumber: string = '';   
    color: string = '';   
    standardCost: number = 0.;   
    listPrice: number = 0.;   
    size: string = '';    
    weight: number = 0;   
    productCategoryId: number = 0;   
    productModelId: number = 0;   
    sellStartDate: Date = new Date();;   
    sellEndDate: Date = new Date();;   
    discontinuedDate: Date = new Date();;   
    rowguid: string = '';   
    modifiedDate: Date = new Date();
   
    // public byte[]? ThumbNailPhoto { get; set; }

    // public string? ThumbnailPhotoFileName { get; set; }
}