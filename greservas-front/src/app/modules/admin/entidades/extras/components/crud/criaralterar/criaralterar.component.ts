import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IExtras } from '../../../interfaces/i-extras';
import { IReqExtras } from '../../../interfaces/i-req-extras';
import { MExtras } from '../../../models/m-extras';
import { ExtrasCrudService } from '../../../services/extras-crud.service';
import { ListarComponent } from '../listar/listar.component';

export interface Parametros {
  acao: 'criar' | 'ver' | 'editar';
  extra: IExtras;
}

@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers: [
    ExtrasCrudService
  ]
})
export class CriaralterarComponent implements OnInit {

  formCriarAlterarExtra !: FormGroup;
  acao = "criar";
  ativarS = false;
  ativarN = false;
  requestCompleto= false;
  submitted = false;
  erroMsg?: string;
  hasErroMsg: boolean = false;
  extra!: IExtras;


  constructor(private extraCrudService: ExtrasCrudService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Parametros
    ) { }  
  
  ngOnInit(): void {
    this.acao = this.data.acao;
    this.extra = this.data.extra;
    this.preencherFormulario();
  }


  preencherFormulario() {
    if(this.acao == 'editar' || this.acao == 'ver'){
      this.preencherFormularioUpdate();
    }    
    if(this.acao == 'criar'){
      this.preencherFormularioCreate();
    }
  }


  preencherFormularioCreate() {
    this.acao="criar";
    console.log("ACCAO: ", this.acao);
    this.incializarFormExtra();
  }


  incializarFormExtra() {
    this.formCriarAlterarExtra = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      descricao: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      ativo: [null, [Validators.required]],
      dataCriacao: [null],
      dataAtualizacao: [null]
    });
  }


  preencherFormularioUpdate() {
    console.log('Preencher Formulario para Update EXTRA com ID:  ' + this.extra.id);
    this.updateFormFromOBJ();
    console.log("Acao a EXECUTAR--> " + this.acao);

    if(this.acao == "ver"){
      this.disalbleAllControls();
    }
  }

  updateFormFromOBJ(): void {
    console.log('Update Form From OBJECTO EXTRA.');
    this.incializarFormExtra();
    
    if(this.extra.ativo){
        this.ativarS = true;
    } else{
        this.ativarN = true;
    }

    this.formCriarAlterarExtra?.patchValue({
        id: this.extra.id,
        nome: this.extra.nome,
        descricao: this.extra.descricao,
        ativo: this.extra.ativo,

        //em principio nao sao necessarios - tirar no fim
        dataCriacao: this.extra.dataCriacao,
        dataAtualizacao: this.extra.dataUltimaActualizacao
    });
  }

  addExtra(){
    console.log("ADICIONAR UM EXTRA");

    this.extraCrudService.createExtraFromIReqExtra(this.criarObjectoExtra()).subscribe(
      success => {
        console.log('CRIADO EXTRA: sucesso: ' + success);
        alert('EXTRA criado com Sucesso: ' + success);

        //fechar o dialog pop-up
        this.dialogRef.close();

        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/extras/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO Extra: Erro no Create Extra \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(this.erroMsg);
      },
      () => {
        console.log('CRIAR Extra: request completo');
        this.requestCompleto = true;
      }
    );
  }

  editExtra(): void{
    console.log('EDITANDO EXTRA..........GUARDAR NA BD!!!!!');
    
    
    console.log("**************************** EXTRA Original ----> \n" + this.mostrarExtra(this.extra))
    
    console.log('-------------------------------------------------------------------------------------');

    let novoExtra = this.obterDadosForm();
    console.log("**************************** NOVO EXTRA ----> \n" + this.mostrarExtra(novoExtra));

    if(!this.compararExtras(this.extra, novoExtra)){
        console.log("OS DADOS DO EXTRA ORIGINAL FORAM ALTERADOS - ACTUALIZAR NA BASE DE DADOS");
        let ext= new MExtras();
        ext.id = novoExtra.id;
        ext.nome = novoExtra.nome;
        ext.descricao = novoExtra.descricao;
        ext.ativo = novoExtra.ativo;
        ext.dataCriacao = novoExtra.dataCriacao;
        ext.dataUltimaActualizacao = this.getDataActualizacao();

        this.extraCrudService.updateData(ext.id, ext).subscribe(
          success => {
            console.log('OPERACAO:: EDITAR EXTRA: SUCESSO: \n' + success);          
            //fechar o dialog pop-up
            this.dialogRef.close();  
            this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
              this.router.navigate(['/oa-admin/gestao/entidades/extras/listar']);
            });
          },
          error => {
            this.hasErroMsg = true;
            this.erroMsg = "OPERACAO:: EDITAR EXTRA: ERRO: \n" + error;
            this.requestCompleto = false;
            console.log(this.erroMsg);
            alert(this.erroMsg);
          },
          () => {
            console.log('OPERACAO:: EDITAR EXTRA: PEDIDO COMPLETO');
            this.requestCompleto = true;
          }
        );
    } else {
        console.log("NENHUMA ALTERACAO FOI REALIZADA - NAO ACTUALIZAR");
    }  
  }

  obterDadosForm(): IExtras {
    console.log('Ler dados do formulario editar');
    return{
      "id": this.extra.id,
      "nome": this.formCriarAlterarExtra?.value.nome,
      "descricao": this.formCriarAlterarExtra?.value.descricao,
      "ativo": this.formCriarAlterarExtra?.value.ativo,

      "dataCriacao": this.extra.dataCriacao,
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }

  resetFields(){
    this.formCriarAlterarExtra.reset();
    alert('CLEAN FIELDS');
  } 

  criarObjectoExtra(): IReqExtras{
    console.log('CRIANDO OBJECTO EXTRA......');    
    return {
      "id": this.formCriarAlterarExtra?.value.id,
      "nome": this.formCriarAlterarExtra?.value.nome,
      "descricao": this.formCriarAlterarExtra?.value.descricao,
      "ativo": this.formCriarAlterarExtra?.value.ativo,

      "dataCriacao": this.getDataCriacao(),
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }

  /*getSystemCurrentDateTime(): string {
    return '2022-08-30T20:10:00'
  }*/

  //passado ou presente
  getDataCriacao(): string {
    return '2022-10-18T12:10:00'
  }

  //futoro ou presente
  getDataActualizacao(): string {
    return '2022-12-31T23:10:00'
  }

  ativarControlos(): void{    
    this.acao = "editar";
    this.formCriarAlterarExtra.get('nome')?.enable();
    this.formCriarAlterarExtra.get('descricao')?.enable();
    this.formCriarAlterarExtra.get('ativo')?.enable();
  }

  disalbleAllControls(): void{
    this.formCriarAlterarExtra.get('nome')?.disable();
    //this.formCriarAlterarExtra.get('valor')?.reset();
    this.formCriarAlterarExtra.get('descricao')?.disable();
    this.formCriarAlterarExtra.get('ativo')?.disable();
  }

  compararExtras(extra: IExtras, novoExtra: IExtras): boolean {
    if(extra.ativo==novoExtra.ativo && 
       extra.descricao== novoExtra.descricao && 
       extra.nome== novoExtra.nome){
      return true;      
    } else{
      return false;
    }
  }

  mostrarExtra(extra: IExtras) {
    console.log("**************** Extra ****************");
    console.log("ID--> " + extra.id);
    console.log("NOME--> " + extra.nome);
    console.log("DESCRICAO--> " + extra.descricao);
    console.log("ATIVO--> " + extra.ativo);
    console.log("DATA CRIACAO--> " + extra.dataCriacao);
    console.log("DATA ACTUALIZACAO--> " + extra.dataUltimaActualizacao);
    console.log("****************************************");
  }

}
