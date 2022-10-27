import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagamento } from '../../../interfaces/i-pagamento';
import { IReqPagamento } from '../../../interfaces/i-req-pagamento';
import { MPagamento } from '../../../models/m-pagamento';
import { PagamentoCrudService } from '../../../services/pagamento-crud.service';
import { ListarComponent } from '../listar/listar.component';

export interface Parametros {
  acao: 'criar' | 'ver' | 'editar';
  pagamento: IPagamento;
}

@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers:[
    PagamentoCrudService
  ]
})
export class CriaralterarComponent implements OnInit {

  acao = "criar";
  ativarS = false;
  ativarN = false;
  formCriarAlterarPagamento!: FormGroup;
  requestCompleto= false;
  submitted = false;
  erroMsg?: string;
  hasErroMsg: boolean = false;
  pagamento!: IPagamento;
  

  constructor(private pagamentoCrudService: PagamentoCrudService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Parametros) { }

  ngOnInit(): void {
    this.acao = this.data.acao;
    this.pagamento = this.data.pagamento;
    this.preencherFormulario();
  }

  preencherFormulario(): void {
    if(this.acao == 'editar' || this.acao == 'ver'){
      this.preencherFormularioUpdate();
    }    
    if(this.acao == 'criar'){
      this.preencherFormularioCreate();
    }
  }


  //CARREGAR FORM COM DADOS DE OBJECTO
  preencherFormularioUpdate(): void {
    console.log('Preencher Formulario para Update PAGAMENTO com ID:  ' + this.pagamento.id);
    this.updateFormFromOBJ();
    console.log("Acao a EXECUTAR--> " + this.acao);

    if(this.acao == "ver"){
      this.disalbleAllControls();
    }
  }

  updateFormFromOBJ(): void {
    console.log('Update Form From OBJECTO PAGAMENTO.');
    this.incializarFormPagamento();
    
    if(this.pagamento.ativo){
        this.ativarS = true;
    } else{
        this.ativarN = true;
    }

    this.formCriarAlterarPagamento?.patchValue({
        id: this.pagamento.id,
        tipo: this.pagamento.tipo,
        descricao: this.pagamento.descricao,
        ativo: this.pagamento.ativo,

        //em principio nao sao necessarios - tirar no fim
        dataCriacao: this.pagamento.dataCriacao,
        dataUltimaActualizacao: this.pagamento.dataUltimaActualizacao
    });
  }

  //INCIALIZAR FORM COM DADOS PARA CRIAR
  preencherFormularioCreate(): void {
    this.acao="criar";
    console.log("ACCAO: ", this.acao);
    this.incializarFormPagamento();
   }

   incializarFormPagamento(): void {
    this.formCriarAlterarPagamento = this.formBuilder.group({
      id: [null],
      tipo: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      descricao: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      ativo: [null, [Validators.required]],
      dataCriacao: [null],
      dataAtualizacao: [null]
    });
  }


  addPagamento(){
    console.log("ADICIONAR UM PAGAMENTO");

    this.pagamentoCrudService.createPagamentoFromIReqPagamento(this.criarObjectoPagamento()).subscribe(
      success => {  
        console.log('CRIADO Pagamento: sucesso: ' + success);
        alert('PAGAMENTO criado com Sucesso: ' + success);

        //fechar o dialog pop-up
        this.dialogRef.close();

        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/pagamento/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO PAGAMENTO: Erro no Create PAGAMENTO \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(this.erroMsg);
      },

      () => {
        console.log('CRIAR PAGAMENTO: request completo');
        this.requestCompleto = true;
      }
    );
  }  

  editPagamento(): void{
    console.log('EDITANDO PAGAMENTO..........GUARDAR NA BD!!!!!');
    
    
    console.log("**************************** PAGAMENTO Original ----> \n" + this.mostrarPagamento(this.pagamento))
    
    console.log('-------------------------------------------------------------------------------------');

    let novoPagamento = this.obterDadosForm();
    console.log("**************************** NOVO PAGAMENTO ----> \n" + this.mostrarPagamento(novoPagamento));

    if(!this.compararPagamentos(this.pagamento, novoPagamento)){
        console.log("OS DADOS DO PAGAMENTO ORIGINAL FORAM ALTERADOS - ACTUALIZAR NA BASE DE DADOS");
        let pag= new MPagamento();
        pag.id = novoPagamento.id;
        pag.tipo = novoPagamento.tipo;
        pag.descricao = novoPagamento.descricao;
        pag.ativo = novoPagamento.ativo;
        pag.dataCriacao = novoPagamento.dataCriacao;
        pag.dataUltimaActualizacao = this.getDataActualizacao();

        this.pagamentoCrudService.updateData(pag.id, pag).subscribe(
          success => {
            console.log('OPERACAO:: EDITAR PAGAMENTO: SUCESSO: \n' + success);          
            //fechar o dialog pop-up
            this.dialogRef.close();  
            this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
              this.router.navigate(['/oa-admin/gestao/entidades/pagamento/listar']);
            });
          },
          error => {
            this.hasErroMsg = true;
            this.erroMsg = "OPERACAO:: EDITAR PAGAMENTO: ERRO: \n" + error;
            this.requestCompleto = false;
            console.log(this.erroMsg);
            alert(this.erroMsg);
          },
          () => {
            console.log('OPERACAO:: EDITAR PAGAMENTO: PEDIDO COMPLETO');
            this.requestCompleto = true;
          }
        );
    } else {
        console.log("NENHUMA ALTERACAO FOI REALIZADA - NAO ACTUALIZAR");
    }  
  }

  criarObjectoPagamento(): IReqPagamento{
    console.log('CRIANDO OBJECTO Pagamento......');    
    return {
      "id": this.formCriarAlterarPagamento?.value.id,
      "tipo": this.formCriarAlterarPagamento?.value.tipo,
      "descricao": this.formCriarAlterarPagamento?.value.descricao,
      "ativo": this.formCriarAlterarPagamento?.value.ativo,
      "dataCriacao": this.getDataCriacao(),
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }

  compararPagamentos(pagamento: IPagamento, novoPagamento: IPagamento): boolean {
    if(pagamento.ativo==novoPagamento.ativo && 
       pagamento.descricao== novoPagamento.descricao && 
       pagamento.tipo== novoPagamento.tipo){
      return true;      
    } else{
      return false;
    }
  }

  mostrarPagamento(pagamento: IPagamento) {
    console.log("**************** Pagamento ****************");
    console.log("ID--> " + pagamento.id);
    console.log("TIPO--> " + pagamento.tipo);
    console.log("DESCRICAO--> " + pagamento.descricao);
    console.log("ATIVO--> " + pagamento.ativo);
    console.log("DATA CRIACAO--> " + pagamento.dataCriacao);
    console.log("DATA ACTUALIZACAO--> " + pagamento.dataUltimaActualizacao);
    console.log("****************************************");
  }

  obterDadosForm(): IPagamento {
    console.log('Ler dados do formulario editar');
    return{
      "id": this.pagamento.id,
      "tipo": this.formCriarAlterarPagamento?.value.tipo,
      "descricao": this.formCriarAlterarPagamento?.value.descricao,
      "ativo": this.formCriarAlterarPagamento?.value.ativo,

      "dataCriacao": this.pagamento.dataCriacao,
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }

  ativarControlos(): void{    
    this.acao = "editar";
    this.formCriarAlterarPagamento.get('tipo')?.enable();
    this.formCriarAlterarPagamento.get('descricao')?.enable();
    this.formCriarAlterarPagamento.get('ativo')?.enable();
  }

  disalbleAllControls(): void{
    this.formCriarAlterarPagamento.get('tipo')?.disable();
    //this.formCriarAlterarEstado.get('valor')?.reset();
    this.formCriarAlterarPagamento.get('descricao')?.disable();
    this.formCriarAlterarPagamento.get('ativo')?.disable();
  }

  //passado ou presente
  getDataCriacao(): string {
    return '2022-10-18T12:10:00'
  }

  //futoro ou presente
  getDataActualizacao(): string {
    return '2022-12-31T23:10:00'
  }

  resetFields(): void{
    this.formCriarAlterarPagamento.reset();
    alert('OS CAMPOS FORAM LIMPOS');
  }  

}
