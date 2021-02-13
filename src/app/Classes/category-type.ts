import { CategoryItem } from './category-item';

export class CategoryType {
    constructor(
            public iCatTypeId:number =null, 
            public iYearId:number = null, 
            public nvCatTypeTitle:string ='', 
            public nvCatTypeDesc:string = '', 
            public iCatTypeParentId:number  = null, 
            public lCategoryItem:Array<CategoryItem> = [],
            public lCategoryType:Array<CategoryType> = []
        ){
            this.iCatTypeId= iCatTypeId ? iCatTypeId : 0;
            this.iYearId=iYearId ? iYearId : 0;
            this.iCatTypeParentId=iCatTypeParentId ? iCatTypeParentId : 0;  
    }
}

