export class VagaDetalheEntity {

      public idVaga: number;
      public idCidade: number;
      public idVagaUsuario: number;
      public idEstado: number;
      public idRamoEmpresa: number;
      public nomeFornecedor: string;
      public cidade: string;
      public cidadeEstadoFormat: string;

      public nome: string;
      public descricao: string;
      public detalheVaga: string;
      public dataInicial: Date;
      public dataInicialFormat: string;
      public dataFinalFormat: string;
      public dataCandidatadaFormat: string;
      public qtdVaga: number;
      public salarioHomem: number;
      public salarioHomemAte: number;
      public salarioMulher: number;
      public salarioMulherAte: number;
      public sexoEnum: string;
      public sexoFormat: string;
      public grauEntendimentoEnum: string;
      public grauFalaEnum: string;
      public grauEscritaEnum: string;
      public statusVaga: string;

      public limiteDados: number;
      public isCandidatado: boolean;

      constructor(){
      }

    }
