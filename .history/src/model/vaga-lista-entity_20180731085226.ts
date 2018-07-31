export class VagaListaEntity {
    
      public idVaga: number;
      public nomeFornecedor: string;
      public cidadeEstadoFormat: string;
      public nome: string;
      public descricao: string;

      public tempoAberto: string;
      public qtdCandidatado: number;
      public dataCandidatadaFormat: string;
      
      public dataAberturaVagaFormat: string;
      public statusEnum: string;

      public limiteDados: number;

      constructor(){
      }
    
    }