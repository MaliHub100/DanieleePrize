import { CategoryType } from './category-type';

export class Year {
    constructor(
        public iYearId:number = 0,
        public nvJewYear:string = '',
        public dBeginDate = null,
        public dEndDate = null,
        public nvMainText:string = '',
        public lCategoryType:Array<CategoryType> = []
    ){
        iYearId = iYearId ? iYearId : 0;
        nvJewYear = '';
        dBeginDate = iYearId ? new Date(iYearId, 0, 1) : iYearId;
        dEndDate = iYearId ? new Date(iYearId, 11, 31) : iYearId;
        nvMainText = '';
        lCategoryType = [];
    }
}
