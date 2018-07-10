export class CotacaoEntity {

  public idCotacao: number;
  public idOrcamento: number;
  public idServicoOrcamento: number;
  public nomeFornecedor: string;
  public valorTotalFormat: string;
  public avaliacaoFornecedor: number;
  public enderecoFornecedorFormat: string;
  public qtdFornecedorPendenteResposta: number;
  
  public statusCotacaoEnum: string;
  public idOrcamentoFormat: string;
  public dataCadastroFormat: string;

  constructor(){
  }
    
}