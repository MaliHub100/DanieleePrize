import { CategoryItem } from './category-item';

export class CategoryType {
    constructor(
            public iCatTypeId:number = null, 
            public iYearId:number = null, 
            public nvCatTypeTitle:string ='', 
            public nvCatTypeDesc:string = '', 
            public iCatTypeParentId:number = null, 
            public lCategoryItem:Array<CategoryItem> = [],
            public lCategoryType:Array<CategoryType> = []
        ){
        iCatTypeId = iCatTypeId ? iCatTypeId : 0;
        iYearId = iYearId ? iYearId : 0;
        nvCatTypeTitle = '';
        nvCatTypeDesc = '';
        iCatTypeParentId = iCatTypeParentId ? iCatTypeParentId : 0;
        lCategoryItem = [];
        lCategoryType = [];
    }
}
