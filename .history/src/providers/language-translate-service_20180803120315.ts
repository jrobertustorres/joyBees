import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';
// import { Storage } from '@ionic/storage';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../pages/i18n/i18n-constants';
// import { availableLanguages, sysOptions } from '../pages/i18n/i18n-constants';

import { Globalization } from '@ionic-native/globalization';

@Injectable()
export class LanguageTranslateService {
    languages = availableLanguages;
    selectedLanguage = null;
    private translate: TranslateService;
    private _idioma: string;

    // private loading: any;
    // private loadingText: string;

  constructor(private http: Http,
              translate: TranslateService,
              private globalization: Globalization) {
    this.translate = translate;
  }

  getTranslate() {
      this.getLanguegeDefault();
    //   this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
      if(localStorage.getItem(Constants.IDIOMA_USUARIO)){
            this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
          
        } else {
            //   this.selectedLanguage = this._idioma;
            this.selectedLanguage = 'en';
            localStorage.setItem(Constants.IDIOMA_USUARIO, this.selectedLanguage);
        }
            
            if (this.selectedLanguage == 'pt') {
                return this.http.get('assets/i18n/pt.json')
                .map((res: Response) => res.json());
            } else if (this.selectedLanguage == 'en'){
                return this.http.get('assets/i18n/en.json')
                .map((res: Response) => res.json());
            }
        // }
        // this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
        //     if(!localStorage.getItem(Constants.IDIOMA_USUARIO)){
        //         this.selectedLanguage = this._idioma;
        //     }
        //     else if(localStorage.getItem(Constants.IDIOMA_USUARIO)) {
        //         this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
        //         console.log(this.selectedLanguage);
        //         if (this.selectedLanguage == 'pt-br') {
        //             this.loadingText = 'Aguarde...';
        //         } else {
        //             this.loadingText = 'Wait...';
        //         }
        //     }
            // this.translate.use(this.selectedLanguage);
            
        // return this.selectedLanguage;
    }

    //OBTENDO O IDIOMA CONFIGURADO NO APARELHO
  getLanguegeDefault() {
    if ((<any>window).cordova) {
      this.globalization.getPreferredLanguage().then(result => {
        this._idioma = result.value == 'pt-BR' ? 'pt' : 'en';
        localStorage.setItem(Constants.IDIOMA_USUARIO, this._idioma);
      });
    }
    else {
      let browserLanguage = this.translate.getBrowserLang() || defaultLanguage;
      localStorage.setItem(Constants.IDIOMA_USUARIO, browserLanguage);
    }
  }
}
