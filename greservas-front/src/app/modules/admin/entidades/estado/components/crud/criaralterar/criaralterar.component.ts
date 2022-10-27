import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListarComponent } from '../../../../estado/components/crud/listar/listar.component';
import { IEstado } from '../../../interfaces/i-estado';
import { IReqEstado } from '../../../interfaces/i-req-estado';
import { MEstado } from '../../../models/m-estado';
import { EstadoCrudService } from '../../../services/estado-crud.service';

export interface Parametros {
  acao: 'criar' | 'ver' | 'editar';
  estado: IEstado;
}

@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers: [
    EstadoCrudService
  ]
})
export class CriaralterarComponent implements OnInit {

  acao = "criar";
  ativarS = false;
  ativarN = false;
  formCriarAlterarEstado!: FormGroup;
  requestCompleto= false;
  submitted = false;
  erroMsg?: string;
  hasErroMsg: boolean = false;
  estado!: IEstado;

  constructor(private estadoCrudService: EstadoCrudService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Parametros) { }

  ngOnInit(): void {
      this.acao = this.data.acao;
      this.estado = this.data.estado;
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
    console.log('Preencher Formulario para Update Estado com ID:  ' + this.estado.id);
    this.updateFormFromOBJ();
    console.log("Acao a EXECUTAR--> " + this.acao);

    if(this.acao == "ver"){
      this.disalbleAllControls();
    }
  }

  updateFormFromOBJ(): void {
    console.log('Update Form From OBJECTO ESTADO.');
    this.incializarFormEstado();

    if(this.estado.ativo){
        this.ativarS = true;
    } else{
        this.ativarN = true;
    }

    this.formCriarAlterarEstado?.patchValue({
        id: this.estado.id,
        valor: this.estado.valor,
        descricao: this.estado.descricao,
        ativo: this.estado.ativo,

        //em principio nao sao necessarios - tirar no fim
        dataCriacao: this.estado.dataCriacao,
        dataAtualizacao: this.estado.dataUltimaActualizacao
    });
  }


  //INCIALIZAR FORM COM DADOS PARA CRIAR
  preencherFormularioCreate(): void {
    this.acao="criar";
     console.log("ACCAO: ", this.acao);
    this.incializarFormEstado();
  }

   incializarFormEstado(): void {
    this.formCriarAlterarEstado = this.formBuilder.group({
      id: [null],
      valor: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      descricao: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      ativo: [null, [Validators.required]],

      dataCriacao: [null],
      dataAtualizacao: [null]
    });
  }

  addEstado(): void{
    console.log("crearObjecto", this.criarObjectoEstado());

    this.estadoCrudService.createExtraFromIReqEstado(this.criarObjectoEstado()).subscribe(
      success => {
        console.log('CRIADO ESTADO: sucesso: ' + success);

        //fechar o dialog pop-up
        this.dialogRef.close();

        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/estado/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO ITEM: Erro no Create Estado \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(this.erroMsg);
      },
      () => {
        console.log('CRIAR ITEM: request completo');
        this.requestCompleto = true;
      }
    );
  }

  //CRIAR OBJECTO COM OS DADOS DE FORMULARIO, S/ ID, PARA SER ENVIADO NO PEDIDO
  criarObjectoEstado(): IReqEstado{
    return {
      "id": this.formCriarAlterarEstado?.value.id,
      "valor": this.formCriarAlterarEstado?.value.valor,
      "descricao": this.formCriarAlterarEstado?.value.descricao,
      "ativo": this.formCriarAlterarEstado?.value.ativo,

      "dataCriacao": this.getDataCriacao(),
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }



  editEstado(): void{
    console.log('EDITANDO ESTADO..........GUARDAR NA BD!!!!!');


    console.log("**************************** ESTADO Original ----> \n" + this.mostrarEstado(this.estado))

    console.log('-------------------------------------------------------------------------------------');

    let novoEstado = this.obterDadosForm();
    console.log("**************************** NOVO ESTADO ----> \n" + this.mostrarEstado(novoEstado));

    if(!this.compararEstados(this.estado, novoEstado)){
        console.log("OS DADOS DO ESTADO ORIGINAL FORAM ALTERADOS - ACTUALIZAR NA BASE DE DADOS");
        let est= new MEstado();
        est.id = novoEstado.id;
        est.valor = novoEstado.valor;
        est.descricao = novoEstado.descricao;
        est.ativo = novoEstado.ativo;
        est.dataCriacao = novoEstado.dataCriacao;
        est.dataUltimaActualizacao = this.getDataActualizacao();

        this.estadoCrudService.updateData(est.id, est).subscribe(
          success => {
            console.log('OPERACAO:: EDITAR ESTADO: SUCESSO: \n' + success);
            //fechar o dialog pop-up
            this.dialogRef.close();
            this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
              this.router.navigate(['/oa-admin/gestao/entidades/estado/listar']);
            });
          },
          error => {
            this.hasErroMsg = true;
            this.erroMsg = "OPERACAO:: EDITAR ESTADO: ERRO: \n" + error;
            this.requestCompleto = false;
            console.log(this.erroMsg);
            alert(this.erroMsg);
          },
          () => {
            console.log('OPERACAO:: EDITAR ESTADO: PEDIDO COMPLETO');
            this.requestCompleto = true;
          }
        );
    } else {
        console.log("NENHUMA ALTERACAO FOI REALIZADA - NAO ACTUALIZAR");
    }
  }

  compararEstados(estado: IEstado, novoEstado: IEstado): boolean {
    if(estado.ativo==novoEstado.ativo &&
       estado.descricao== novoEstado.descricao &&
       estado.valor== novoEstado.valor){
      return true;
    } else{
      return false;
    }
  }

  mostrarEstado(estado: IEstado) {
    console.log("**************** Estado ****************");
    console.log("ID--> " + estado.id);
    console.log("VALOR--> " + estado.valor);
    console.log("DESCRICAO--> " + estado.descricao);
    console.log("ATIVO--> " + estado.ativo);
    console.log("DATA CRIACAO--> " + estado.dataCriacao);
    console.log("DATA ACTUALIZACAO--> " + estado.dataUltimaActualizacao);
    console.log("****************************************");
  }

  obterDadosForm(): IEstado {
    console.log('Ler dados do formulario editar');
    return{
      "id": this.estado.id,
      "valor": this.formCriarAlterarEstado?.value.valor,
      "descricao": this.formCriarAlterarEstado?.value.descricao,
      "ativo": this.formCriarAlterarEstado?.value.ativo,

      "dataCriacao": this.estado.dataCriacao,
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }

  ativarControlos(): void{
    this.acao = "editar";
    this.formCriarAlterarEstado.get('valor')?.enable();
    this.formCriarAlterarEstado.get('descricao')?.enable();
    this.formCriarAlterarEstado.get('ativo')?.enable();
  }

  disalbleAllControls(): void{
    this.formCriarAlterarEstado.get('valor')?.disable();
    //this.formCriarAlterarEstado.get('valor')?.reset();
    this.formCriarAlterarEstado.get('descricao')?.disable();
    this.formCriarAlterarEstado.get('ativo')?.disable();
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
    this.formCriarAlterarEstado.reset();
    alert('OS CAMPOS FORAM LIMPOS');
  }

}
