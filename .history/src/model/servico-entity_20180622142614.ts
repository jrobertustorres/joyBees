export class ServicoEntity {
    
      public idServico: number;
      public idTipoServico: number;
      
      public tipoServico: string;
      public servico: string;
      public descricao: string;
      public status: boolean;
      
      public dataSolicitacaoObrigatorio: boolean;
      public descricaoObrigatorio: boolean;
      public quantidadeObrigatorio: boolean;
      
      public limitDados: number;

      constructor(){
      }
    
    }