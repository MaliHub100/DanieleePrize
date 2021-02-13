import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryItem } from 'src/app/Classes/category-item';
import { CategoryType } from 'src/app/Classes/category-type';
import { Year } from 'src/app/Classes/year';
import { ConnectService } from 'src/app/Services/connect.service';
import { VariablesService } from 'src/app/Services/variables.service';

@Component({
    selector: 'app-year-settings',
    templateUrl: './year-settings.component.html',
    styleUrls: ['./year-settings.component.css']
})
export class YearSettingsComponent implements OnInit {

    @Input() oYear: Year;
    @Input() openDialog: Function;
    @Input() categoryCount: number;
    @Output('closeDialog') onCloseDialog: EventEmitter<boolean> = new EventEmitter();
    lYears = [];
    currentCategoryType:Array<CategoryType>;
    currentCategoryItem:Array<CategoryItem>;

    constructor(public cnct: ConnectService, public vars: VariablesService) {
        for (let i = (new Date()).getFullYear(); i < (new Date()).getFullYear() + 20; i++) {
            this.lYears.push(i);
        }
    }
    
    
    ngOnInit(): void {
        this.currentCategoryType=new Array<CategoryType>(this.categoryCount);
        this.currentCategoryItem=new Array<CategoryItem>(this.categoryCount);
        this.closeCurrentCategoryType(1);
        this.closeCurrentCategoryItem(1);
    }

    closeDialog() {
        this.onCloseDialog.emit();
    }

    insertUpdateYear() {
        this.cnct.post('InsertUpdateYear', {
            iUserId: this.vars.user.iUserId,
            year: {
                iYearId: this.oYear.iYearId,
                nvMainText: this.oYear.nvMainText,
                nvJewYear: this.oYear.nvJewYear,
                dBeginDate: this.oYear.dBeginDate,
                dEndDate: this.oYear.dEndDate
            }
        }).then((result) => {
            if (result) {
                if (this.oYear['bNew'])
                    this.oYear['bNew'] = false;
                else
                    this.openDialog(this.oYear.iYearId);
            } else {
                this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
                document.getElementsByName('dialog')[0].focus();
            }
        }, (error) => {
            this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
            document.getElementsByName('dialog')[0].focus();
        });
    }

    addCategoryType(categoryNum, parentCategoryType) {
        this.cnct.post('InsertUpdateCategoryType', {
            iUserId: this.vars.user.iUserId,
            categoryType: new CategoryType(0, this.oYear.iYearId, "","",parentCategoryType.iCatTypeId,[],[])
        }).then(result=> {
            if (result) {
                parentCategoryType.lCategoryType.push(result);
                this.selectCategoryType(categoryNum, result);
            } else
                this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
        }, err=> {
            this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
        });
    }
    updateCategoryType(categoryType) {
        this.cnct.post('InsertUpdateCategoryType', {
            iUserId: this.vars.user.iUserId,
            categoryType: categoryType
        }).then( (result)=>{
            if (!result) {
                this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
                document.getElementsByName('dialog')[0].focus();
            }
        },err=> {
            this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
            document.getElementsByName('dialog')[0].focus();
        });
    }
    selectCategoryType(categoryNum, categoryType) {
        if (this.currentCategoryType[categoryNum-1] && this.currentCategoryType[categoryNum-1].iCatTypeId == categoryType.iCatTypeId)
            this.closeCurrentCategoryType(categoryNum);
        else {
            this.closeCurrentCategoryType(categoryNum);
            this.currentCategoryType[categoryNum-1] = categoryType;
        }
    }
    closeCurrentCategoryType(categoryNum) {
        for (let i = categoryNum; i <= this.categoryCount; i++) {
            this.currentCategoryType[(i-1)] = new CategoryType();
        }
    }
    closeCurrentCategoryItem(categoryNum) {
        for (let i = categoryNum; i < this.categoryCount; i++) {
            this.currentCategoryItem[(i-1)] = new CategoryItem();
        }
    }
    
    removeCategoryType(lCategoryType, categoryType) {
        this.vars.globalDialog = {
            type: 'error',
            title: 'האם אתה בטוח שברצונך למחוק את הקטגוריה?',
            confirmBtns: true,
            confirmFunc:()=> {
                this.cnct.post('DeleteCategoryType', {
                    iUserId: this.vars.user.iUserId,
                    iCatTypeId: categoryType.iCatTypeId
                }).then(
                    result =>{
                    if (result) {
                        lCategoryType.splice(lCategoryType.indexOf(categoryType), 1);
                        this.vars.globalDialog = null;
                    } else
                        this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
                },err=>{
                    this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
                });
            }
        };
    }
 
    removeCategoryItem(categoryType, categoryItem) {
        let con:ConnectService = this.cnct;
        this.vars.globalDialog = {
            type: 'error',
            title: 'האם אתה בטוח שברצונך למחוק?',
            confirmBtns: true,
            confirmFunc:()=> {
                this.cnct.post('DeleteCategoryItem', {
                    iUserId: this.vars.user.iUserId,
                    iCatItemId: categoryItem.iCatItemId
                }).then(
                    result=> {
                    if (result) {
                        this.removeCategoryItems(categoryType, [categoryItem]);
                        this.vars.globalDialog = null;
                    } else
                        this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
                }, function() {
                    this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
                });
            }
        };
    }
    removeCategoryItems(categoryType, lCategoryItem) {
        //loop on sub lCategoryType
        categoryType.lCategoryType.filter(ct=>ct.iCatTypeParentId == categoryType.iCatTypeId)
            .forEach(subCategoryType => {
                //remove sub lCategoryItem from sub lCategoryType
                this.removeCategoryItems(subCategoryType, subCategoryType.lCategoryItem.filter((ci) =>{
                    return lCategoryItem.filter((cit)=> {
                        return ci.iCatItemParentId == cit.iCatItemId;
                    }, true).length > 0;
                }, true));
            });

        //remove lCategoryItem 
        categoryType.lCategoryItem = categoryType.lCategoryItem.filter((ci)=> {
            return lCategoryItem.filter((cit)=> {
                return ci.iCatItemId == cit.iCatItemId;
            }, true).length == 0;
        }, true);
    }

    selectCategoryItem(categoryNum, categoryItem) {
        if (this.currentCategoryItem[categoryNum-1] && this.currentCategoryItem[categoryNum-1].iCatItemId == categoryItem.iCatItemId)
           this.closeCurrentCategoryItem(categoryNum);
        else {
           this.closeCurrentCategoryItem(categoryNum);
            this.currentCategoryItem[categoryNum-1] = categoryItem;
        }
    }
    addCategoryItem(categoryType, iCatItemParentId) {
        this.cnct.post('InsertUpdateCategoryItem', {
            iUserId: this.vars.user.iUserId,
            categoryItem: new CategoryItem(0,categoryType.nvCatItemName,categoryType.nvCatItemName2,categoryType.iCatTypeId, iCatItemParentId)
        }).then(
            result=> {
                if (result) {
                    let item = new CategoryItem(result.iCatItemId, result.nvCatItemName, result.nvCatItemName2, result.iCatTypeId, result.iCatItemParentId);
                    categoryType.lCategoryItem.push(item);
                } else
                    this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
        }, err=> {
            this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
        });
    }

    updateCategoryItem(catItem) {
        this.cnct.post('InsertUpdateCategoryItem', {
            iUserId: this.vars.user.iUserId,
            categoryItem: catItem
        }).then(
            result=> {
            if (result)
                catItem = catItem;
            else {
               this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
                document.getElementsByName('dialog')[0].focus();
            }
        }, err=>{
            this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
            document.getElementsByName('dialog')[0].focus();
        });
    }
}
