export class CategoryItem {
    constructor(
        public iCatItemId:number = null, 
        public nvCatItemName:string = '',
        public iCatTypeId:number = null, 
        public iCatItemParentId:number = null
        ){
        iCatItemId = iCatItemId ? iCatItemId : 0;
        nvCatItemName = '';
        iCatTypeId = iCatTypeId ? iCatTypeId : 0;
        iCatItemParentId = iCatItemParentId ? iCatItemParentId : 0;

    }
}
