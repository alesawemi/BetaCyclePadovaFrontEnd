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
    //Old Database - CUSTOMER ADDRESS - uso la mail come se fosse una chiave primaria per capire
    customerId: number = 0; // essendo nuovi user devo partire da un numero più alto - 40.000 (per essere sicuri)
    addressId: number = 0; //essendo nuovi devo partire da un numero più alto - 13.000
    addressType: string = '';
}