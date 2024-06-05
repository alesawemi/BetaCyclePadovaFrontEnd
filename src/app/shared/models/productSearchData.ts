import { GeneralView } from "./viewsData";

export class productSearch {

    productId: number = 0;
    productName: string = '';    
    color: string = '';   
    standardCost: number = 0.;   
    listPrice: number = 0.;   
    size: string = '';    
    weight: number = 0;   
    productCategory: string = '';
    productModel: string = '';
    largeImage: any;
    mainCategoryID: number = 0;
    mainCategory: string = '';
    quantity: number | undefined;

}

export class DBproduct {

    ProductId: number = 0;
    Name: string = '';
    //ProductNumber: string = '';
    Color: string = '';
    //StandardCost: number = 0;
    ListPrice: number = 0;
    Size: string = '';
    Weight: number = 0;
    //ProductCategoryId: number = 0;
    //ProductModelId: number = 0;
    //SellStartDate: Date = new Date;
    //SellEndDate: Date = new Date;
    //DiscontinuedDate: Date = new Date;
    //ThumbNailPhoto: [] = []
    //string? ThumbnailPhotoFileName 
    //Guid Rowguid 
    //DateTime ModifiedDate

}