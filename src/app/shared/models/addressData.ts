export class Address{
    //Old Database - ADDRESS
    addressId: number = 0;
    addressLine1: string = '';
    addressLine2: string = '';
    city: string= '';
    stateProvince: string = '';
    countryRegion: string = '';
    postalCode: string = '';
}

export class AddressCustomer{
    //Old Database - CUSTOMER ADDRESS - i use email as unique key
    customerId: number = 0; // new user -> ID >= 40.000
    addressId: number = 0; //new addresses -> ID >= 13.000
    addressType: string = '';
}