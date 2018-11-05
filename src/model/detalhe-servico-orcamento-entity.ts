export class DetalheServicoOrcamentoEntity {

  public idServicoOrcamento: number;
  public idOrcamento: number;
  public idServico: number;
  public idFornecedor: number;
  public idTipoServico: number;
  public idCotacao: number;
  public idOrcamentoFormat: string;
  
  public nomeServico: string;
  public nomeTipoServico: string;
  public descricao: string;
  public dataSolicitacaoFormat: string;
  public quantidade: number;
  
  public nomeFornecedor: string;
  public enderecoFornecedorFormat: string;
  public telefoneFornecedor: string;
  public telefone2Fornecedor: string;
  public emailFornecedor: string;
  public siteFornecedor: string;
  public qtdAvaliacoes: number;
  public avaliacaoFornecedor: number;
  public avaliacaoFornecedorFormat: string;
  
  public qtdCotacao: string;
  public valorTotalFormat: string;
  public dataEntregaFormat: string;
  public dataCadastroFormat: string;
  public dataRespostaFormat: string;
  public dataConcluidaFormat: string;
  public validadeFormat: string;
  public tipoPagamento: string;
  public statusCotacaoEnum: string;
  public observacaoFornecedor: string;

  public nomeEstado: string;
  public nomeCidade: string;
  public qtdAvaliacaoCotacao: number;
	
  constructor(){
  }
}
