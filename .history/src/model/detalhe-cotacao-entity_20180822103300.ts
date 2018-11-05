export class DetalheCotacaoEntity {
    
    public idCotacao: number;
    public idFornecedor: number;
    public idOrcamento: number;
    public idServicoFornecedor: number;
    public idOrcamentoFormat: string;
    public valorTotalFormat: string;
    public dataEntregaFormat: string;
    public validadeFormat: string;
    public tipoPagamento: string;
    public statusCotacaoEnum: string;

    public nomeFornecedor: string;
    public enderecoFornecedorFormat: string;
    public telefoneFornecedor: string;
    public telefone2Fornecedor: string;
    public emailFornecedor: string;
    public siteFornecedor: string;
    public avaliacaoFornecedor: number;
    public avaliacaoFornecedorFormat: string;
    public qtdAvaliacoes: number;

    public descricao: string;
    public nomeServico: string;
    public dataSolicitacaoFormat: number;
    public quantidade: number;
    public valor: number;
    public observacaoFornecedor: string;
    public respostaFornecedor: boolean;

    constructor(){
    }
    
}