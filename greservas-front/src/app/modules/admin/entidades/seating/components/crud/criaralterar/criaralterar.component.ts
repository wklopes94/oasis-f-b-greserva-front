import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IReqSeating } from '../../../interfaces/i-req-seating';
import { ISeating } from '../../../interfaces/i-seating';
import { MSeating } from '../../../models/m-seating';
import { SeatingCrudService } from '../../../services/seating-crud.service';
import { ListarComponent } from '../listar/listar.component';

export interface Parametros {
  acao: 'criar' | 'ver' | 'editar';
  seating: ISeating;
}
@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers: [
    SeatingCrudService
  ]
})export class CriaralterarComponent implements OnInit {

  formCriarAlterarSeating!: FormGroup;

  acao = "criar";
  ativarS = false;
  ativarN = false;
  ativarCS = false;
  ativarCN = false;
  requestCompleto= false;
  submitted = false;
  erroMsg?: string;
  hasErroMsg: boolean = false;

  seating!: ISeating;


  constructor(private seatingCrudService: SeatingCrudService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Parametros) { }

  ngOnInit(): void {
    this.acao = this.data.acao;
    this.seating = this.data.seating;
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
    console.log('Preencher Formulario para Update SEATING com ID:  ' + this.seating.id);
    this.updateFormFromOBJ();
    console.log("Acao a EXECUTAR--> " + this.acao);

    if(this.acao == "ver"){
      this.disalbleAllControls();
    }
  }

  updateFormFromOBJ(): void {
    console.log('Update Form From OBJECTO SEATING.');
    this.incializarFormSeating();

    if(this.seating.ativo){
        this.ativarS = true;
    } else{
        this.ativarN = true;
    }

    if(this.seating.completo){
        this.ativarCS = true;
    } else{
        this.ativarCN = true;
    }

    this.formCriarAlterarSeating?.patchValue({
        id: this.seating.id,
        horaInicio: this.seating.horaInicio,
        horaFim: this.seating.horaFim,
        completo: this.seating.completo,
        ativo: this.seating.ativo,

        //em principio nao sao necessarios - tirar no fim
        dataCriacao: this.seating.dataCriacao,
        dataAtualizacao: this.seating.dataUltimaActualizacao
    });
  }

  //INCIALIZAR FORM COM DADOS PARA CRIAR
  preencherFormularioCreate(): void {
    this.acao="criar";
    console.log("ACCAO: ", this.acao);
    this.incializarFormSeating();
  }

   incializarFormSeating(): void {
    this.formCriarAlterarSeating = this.formBuilder.group({
      id: [null],
      horaInicio: [null, [Validators.required]],
      horaFim: [null, [Validators.required]],
      completo: [null, [Validators.required]],
      ativo: [null, [Validators.required]],
      dataCriacao: [null],
      dataAtualizacao: [null]
    });
  }



  addSeating(){
    console.log("ADICIONAR UM  SEATING");

    this.seatingCrudService.createSeatingFromIReqSeating(this.criarObjectoSeating()).subscribe(
      success => {
        console.log('CRIADO ESSEATINGTADO: sucesso: ' + success);
        

        //fechar o dialog pop-up
        this.dialogRef.close();

        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/seating/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO SEATING: Erro no Create SEATING \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(this.erroMsg);
      },

      () => {
        console.log('CRIAR SEATING: request completo');
        this.requestCompleto = true;
      }
    );
  }

  editSeating(): void{
    console.log('EDITANDO SEATING..........GUARDAR NA BD!!!!!');


    console.log("**************************** SEATING Original ----> \n" + this.mostrarSeating(this.seating))

    console.log('-------------------------------------------------------------------------------------');

    let novoSeating = this.obterDadosForm();
    console.log("**************************** NOVO SEATING ----> \n" + this.mostrarSeating(novoSeating));

    if(!this.compararSeating(this.seating, novoSeating)){
        console.log("OS DADOS DO ESTADO ORIGINAL FORAM ALTERADOS - ACTUALIZAR NA BASE DE DADOS");
        let seat= new MSeating();
        seat.id = novoSeating.id;
        seat.horaInicio = novoSeating.horaInicio;
        seat.horaFim = novoSeating.horaFim;
        seat.completo = novoSeating.completo;
        seat.ativo = novoSeating.ativo;
        seat.dataCriacao = novoSeating.dataCriacao;
        seat.dataUltimaActualizacao = this.getDataActualizacao();

        this.seatingCrudService.updateData(seat.id, seat).subscribe(
          success => {
            console.log('OPERACAO:: EDITAR SEATING: SUCESSO: \n' + success);
            //fechar o dialog pop-up
            this.dialogRef.close();
            this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
              this.router.navigate(['/oa-admin/gestao/entidades/seating/listar']);
            });
          },
          error => {
            this.hasErroMsg = true;
            this.erroMsg = "OPERACAO:: EDITAR SEATING: ERRO: \n" + error;
            this.requestCompleto = false;
            console.log(this.erroMsg);
            alert(this.erroMsg);
          },
          () => {
            console.log('OPERACAO:: EDITAR SEATING: PEDIDO COMPLETO');
            this.requestCompleto = true;
          }
        );
    } else {
        console.log("NENHUMA ALTERACAO FOI REALIZADA - NAO ACTUALIZAR");
    }
  }


  criarObjectoSeating(): IReqSeating{
    console.log('CRIANDO OBJECTO SEATING......');
    
    return {
      "id": this.formCriarAlterarSeating?.value.id,
      "horaInicio": this.formCriarAlterarSeating?.value.horaInicio,
      "horaFim": this.formCriarAlterarSeating?.value.horaFim,
      "completo": this.formCriarAlterarSeating?.value.completo,

      "ativo": this.formCriarAlterarSeating?.value.ativo,
      "dataCriacao": this.getDataCriacao(),
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }

  compararSeating(seating: ISeating, novoSeating: ISeating): boolean {
    if(seating.ativo==novoSeating.ativo &&
      seating.completo==novoSeating.completo &&
      seating.horaInicio== novoSeating.horaInicio &&
      seating.horaFim== novoSeating.horaFim){
      return true;
    } else{
      return false;
    }
  }

  mostrarSeating(seating: ISeating) {
    console.log("**************** Estado ****************");
    console.log("ID--> " + seating.id);
    console.log("HORA INICIO--> " + seating.horaInicio);
    console.log("HORA FIM--> " + seating.horaFim);
    console.log("COMPLETO--> " + seating.completo);
    console.log("ATIVO--> " + seating.ativo);
    console.log("DATA CRIACAO--> " + seating.dataCriacao);
    console.log("DATA ACTUALIZACAO--> " + seating.dataUltimaActualizacao);
    console.log("****************************************");
  }

  obterDadosForm(): ISeating {
    console.log('Ler dados do formulario editar');
    return{
      "id": this.seating.id,
      "horaInicio": this.formCriarAlterarSeating?.value.horaInicio,
      "horaFim": this.formCriarAlterarSeating?.value.horaFim,
      "completo": this.formCriarAlterarSeating?.value.completo,
      "ativo": this.formCriarAlterarSeating?.value.ativo,

      "dataCriacao": this.seating.dataCriacao,
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }

  ativarControlos(): void{
    this.acao = "editar";
    this.formCriarAlterarSeating.get('horaInicio')?.enable();
    this.formCriarAlterarSeating.get('horaFim')?.enable();
    this.formCriarAlterarSeating.get('completo')?.enable();
    this.formCriarAlterarSeating.get('ativo')?.enable();
  }

  disalbleAllControls(): void{
    this.formCriarAlterarSeating.get('horaInicio')?.disable();
    this.formCriarAlterarSeating.get('horaFim')?.disable();
    this.formCriarAlterarSeating.get('completo')?.disable();
    this.formCriarAlterarSeating.get('ativo')?.disable();
  }

  //passado ou presente
  getDataCriacao(): string {
    return '2022-10-11T12:10:00'
  }

  //futoro ou presente
  getDataActualizacao(): string {
    return '2022-12-10T23:10:00'
  }

  resetFields(): void{
    this.formCriarAlterarSeating.reset();
    alert('OS CAMPOS FORAM LIMPOS');
  }

}
 