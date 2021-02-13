export class CategoryItem {
    constructor(
        public iCatItemId:number = null, 
        public nvCatItemName:string = '',
        public nvCatItemName2:string = '',
        public iCatTypeId:number = null, 
        public iCatItemParentId:number=null
        ){
            this.iCatItemId=iCatItemId ? iCatItemId : 0;
            this.iCatTypeId= iCatTypeId ? iCatTypeId : 0;
            this.iCatItemParentId= iCatItemParentId ? iCatItemParentId : 0
        }
    
}


