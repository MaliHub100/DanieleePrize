import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterItem'
})
export class MyFilterPipe implements PipeTransform {

  transform(value: any,currentItemId: any): any {
    return value.filter(item=>item.iCatItemParentId==currentItemId);
  }

}
