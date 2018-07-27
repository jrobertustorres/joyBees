import {Injectable} from '@angular/core';

@Injectable()
export class MaskMoneyUtil {

  maskConvert(v) {
    v=v.replace(/\D/g,'');
    console.log(v);
    v=v.replace(/(\d{1,2})$/, '0.$1');  
    v=v.replace(/\D/g,'0');
    console.log(v);
    v=v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');  
    console.log(v);
    return v;
  }

}