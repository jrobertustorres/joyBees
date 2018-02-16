export class VagaDetalheEntity {
    
      public idVaga: number;
      public idEmpresa: number;
      public idCidade: number;
      public idTurno: number;
      public nomeEmpresa: string;
      public nomeFornecedor: string;
      public cidade: string;
      public cidadeEstadoFormat: string;
      public turno: string;
      public nome: string;
      public dataInicial: Date;
      public dataInicialFormat: string;
      public dataFinalFormat: string;
      public qtdVaga: number;
      public salario: number;
      public sexo: string;
      public sexoFormat: string;
      public grauEntendimentoEnum: string;
      public grauFalaEnum: string;
      public grauEscritaEnum: string;
      public statusVaga: string;
      public limiteDados: number;

      constructor(){
      }
    
    }