export class FornecedorEntity {

      public idFornecedor: number;
      public idCidade: number;
      public idEstado: number;
      public idServico: number;

      public nomeCidade: string;
      public nomeEstado: string;

      public nome: string;
      public fantasia: string;
      public cpfCnpj: string;
      public inscricaoEstadual: string;
      public endereco: string;
      public bairro: string;
      public numeroEndereco: string;
      public complemento: string;
      
      public latitude: number;
      public longitude: number;
      public dataAbertura: Date;
      
      public telefone: string;
      public telefone2: string;
      public email: string;
      public site: string;
      public imagemLogo: string;
      public avaliacao: number;
      
      public horarioAtendimento: string;
      public isAtendimento: boolean;

      public distanciaFormat: string;

      public limitDados: number;
      
      constructor(){
      }
    
    }