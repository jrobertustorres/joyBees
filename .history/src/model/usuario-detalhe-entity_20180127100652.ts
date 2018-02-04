export class UsuarioDetalheEntity {
    
      public idUsuario: number;
      public idPessoa: number;
      public idCidade: number;
      public idEstado: number;
    
      public nomePessoa: string;
      public telefonePessoa: string;
      public tipoUsuario: string;
      public endereco: string;
      
      public email: string;
      public genero: string;
      public idade: number;
      public nacionalidade: string;
      public experienciaProfissional: string;
      public grauEntendimento: string;
      public grauFala: string;
      public grauEscrita: string;
      
      private Double salario;
      public loginUsuario: string;
      public senhaUsuario: string;
      public idUsuarioFacebook: string;
      public statusAceitoTermoUso: boolean;
      
      
      constructor(){
      }
    }
    