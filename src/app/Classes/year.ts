import { CategoryType } from './category-type';

export class Year {
    constructor(
        public iYearId:number = iYearId ? iYearId : 0,
        public nvJewYear:string = '',
        public dBeginDate = iYearId ? new Date(iYearId, 0, 1) : iYearId,
        public dEndDate = iYearId ? new Date(iYearId, 11, 31) : iYearId,
        public nvMainText:string = '',
        public lCategoryType:Array<CategoryType> = []
        
    ){
    }
}
