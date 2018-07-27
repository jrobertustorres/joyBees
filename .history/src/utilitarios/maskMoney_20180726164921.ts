import {Injectable} from '@angular/core';

@Injectable()
export class MaskMoneyUtil {

  maskConvert(v) {
    v=v.replace(/\D/g,'');
    v=v.replace(/(\d{1,2})$/, '.$1');  
    v=v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); 
    // .toString().split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," ); 
    return v;
  }

}