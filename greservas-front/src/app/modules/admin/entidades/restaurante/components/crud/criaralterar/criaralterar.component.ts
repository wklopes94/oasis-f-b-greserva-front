import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IReqRestaurante } from '../../../interfaces/i-req-restaurante';
import { IRestaurante } from '../../../interfaces/i-restaurante';
import { MRestaurante } from '../../../models/m-restaurante';
import { RestauranteCrudService } from '../../../services/restaurante-crud.service';
import { ListarComponent } from '../listar/listar.component';

export interface Parametros {
  acao: 'criar' | 'ver' | 'editar';
  restaurante: IRestaurante;
}

@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers: [
    RestauranteCrudService
  ]
})export class CriaralterarComponent implements OnInit {

  formCriarAlterarRestaurante !: FormGroup;

  acao = "criar";
  ativarS = false;
  ativarN = false;
  requestCompleto= false;
  submitted = false;
  erroMsg?: string;
  hasErroMsg: boolean = false;
  restaurante!: IRestaurante;

  constructor(private restauranteCrudService: RestauranteCrudService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Parametros
    ) { }

  ngOnInit(): void {
    this.acao = this.data.acao;
    this.restaurante = this.data.restaurante;
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
    console.log('Preencher Formulario para Update RESTAURANTE com ID:  ' + this.restaurante.id);
    this.updateFormFromOBJ();
    console.log("Acao a EXECUTAR--> " + this.acao);

    if(this.acao == "ver"){
      this.disalbleAllControls();
    }
  }

  updateFormFromOBJ(): void {
    console.log('Update Form From OBJECTO RESYAURANTE.');
    this.incializarFormRestaurante();

    if(this.restaurante.ativo){
        this.ativarS = true;
    } else{
        this.ativarN = true;
    }

    this.formCriarAlterarRestaurante?.patchValue({
        id: this.restaurante.id,
        nome: this.restaurante.nome,
        lotacaoMaxima: this.restaurante.lotacaoMaxima,
        ativo: this.restaurante.ativo,

        //em principio nao sao necessarios - tirar no fim
        dataCriacao: this.restaurante.dataCriacao,
        dataAtualizacao: this.restaurante.dataUltimaActualizacao
    });
  }
  //INCIALIZAR FORM COM DADOS PARA CRIAR
  preencherFormularioCreate(): void {
    this.acao="criar";
    console.log("ACCAO: ", this.acao);
    this.incializarFormRestaurante();
  }

  incializarFormRestaurante(): void {
    this.formCriarAlterarRestaurante = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      lotacaoMaxima: [null, [Validators.required]],
      ativo: [null, [Validators.required]],
      dataCriacao: [null],
      dataAtualizacao: [null]
    });
  }

  addRestaurante(){
    console.log("ADICIONAR UM Restaurante");

    this.restauranteCrudService.createRestauranteFromIReqRestaurante(this.criarObjectoRestaurante()).subscribe(
      success => {
        console.log('CRIADO RESTAURANTE: sucesso: ' + success);
        //alert('RESTAURANTE criado com Sucesso: ' + success);

        //fechar o dialog pop-up
        this.dialogRef.close();

        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/restaurante/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO RESTAURANTE: Erro no Create RESTAURANTE \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(this.erroMsg);
      },
      () => {
        console.log('CRIAR RESTAURANTE: request completo');
        this.requestCompleto = true;
      }
    );
  }

  editRestaurante(): void{
    console.log('EDITANDO RESTAURANTE..........GUARDAR NA BD!!!!!');


    console.log("**************************** ESTADO Original ----> \n" + this.mostrarRestaurante(this.restaurante))

    console.log('-------------------------------------------------------------------------------------');

    let novoRestaurante = this.obterDadosForm();
    console.log("**************************** NOVO RESTAURANTE ----> \n" + this.mostrarRestaurante(novoRestaurante));

    if(!this.compararRestaurante(this.restaurante, novoRestaurante)){
        console.log("OS DADOS DO RESTAURANTE ORIGINAL FORAM ALTERADOS - ACTUALIZAR NA BASE DE DADOS");
        let rest= new MRestaurante();
        rest.id = novoRestaurante.id;
        rest.nome = novoRestaurante.nome;
        rest.lotacaoMaxima = novoRestaurante.lotacaoMaxima;
        rest.ativo = novoRestaurante.ativo;
        rest.dataCriacao = novoRestaurante.dataCriacao;
        rest.dataUltimaActualizacao = this.getDataActualizacao();

        this.restauranteCrudService.updateData(rest.id, rest).subscribe(
          success => {
            console.log('OPERACAO:: EDITAR RESTAURANTE: SUCESSO: \n' + success);
            //fechar o dialog pop-up
            this.dialogRef.close();
            this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
              this.router.navigate(['/oa-admin/gestao/entidades/restaurante/listar']);
            });
          },
          error => {
            this.hasErroMsg = true;
            this.erroMsg = "OPERACAO:: EDITAR RESTAURANTE: ERRO: \n" + error;
            this.requestCompleto = false;
            console.log(this.erroMsg);
            alert(this.erroMsg);
          },
          () => {
            console.log('OPERACAO:: EDITAR RESTAURANTE: PEDIDO COMPLETO');
            this.requestCompleto = true;
          }
        );
    } else {
        console.log("NENHUMA ALTERACAO FOI REALIZADA - NAO ACTUALIZAR");
    }
  }



  criarObjectoRestaurante(): IReqRestaurante{
    console.log('CRIANDO OBJECTO Restaurante......');
    
    return {
      "id": this.formCriarAlterarRestaurante?.value.id,
      "nome": this.formCriarAlterarRestaurante?.value.nome,
      "lotacaoMaxima": this.formCriarAlterarRestaurante?.value.lotacaoMaxima,
      "ativo": this.formCriarAlterarRestaurante?.value.ativo,
      "dataCriacao": this.getDataCriacao(),
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }

  compararRestaurante(restaurante: IRestaurante, novoRestaurante: IRestaurante): boolean {
    if(restaurante.ativo==novoRestaurante.ativo &&
      restaurante.lotacaoMaxima== novoRestaurante.lotacaoMaxima &&
      restaurante.nome== novoRestaurante.nome){
      return true;
    } else{
      return false;
    }
  }

  mostrarRestaurante(restaurante: IRestaurante) {
    console.log("**************** Restaurante ****************");
    console.log("ID--> " + restaurante.id);
    console.log("Nome--> " + restaurante.nome);
    console.log("LOTAÇÃO MAXIMA--> " + restaurante.lotacaoMaxima);
    console.log("ATIVO--> " + restaurante.ativo);
    console.log("DATA CRIACAO--> " + restaurante.dataCriacao);
    console.log("DATA ACTUALIZACAO--> " + restaurante.dataUltimaActualizacao);
    console.log("****************************************");
  }

  obterDadosForm(): IRestaurante {
    console.log('Ler dados do formulario editar');
    return{
      "id": this.restaurante.id,
      "nome": this.formCriarAlterarRestaurante?.value.nome,
      "lotacaoMaxima": this.formCriarAlterarRestaurante?.value.lotacaoMaxima,
      "ativo": this.formCriarAlterarRestaurante?.value.ativo,

      "dataCriacao": this.restaurante.dataCriacao,
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }

  ativarControlos(): void{
    this.acao = "editar";
    this.formCriarAlterarRestaurante.get('nome')?.enable();
    this.formCriarAlterarRestaurante.get('lotacaoMaxima')?.enable();
    this.formCriarAlterarRestaurante.get('ativo')?.enable();
  }

  disalbleAllControls(): void{
    this.formCriarAlterarRestaurante.get('nome')?.disable();
    this.formCriarAlterarRestaurante.get('lotacaoMaxima')?.disable();
    this.formCriarAlterarRestaurante.get('ativo')?.disable();
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
    this.formCriarAlterarRestaurante.reset();
    alert('OS CAMPOS FORAM LIMPOS');
  }

}