import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IReqUtilizador } from '../../../interfaces/i-req-utilizador';
import { UtilizadorCrudService } from '../../../services/utilizador-crud.service';
import { ListarComponent } from '../listar/listar.component';

@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers: [
    UtilizadorCrudService
  ]
})
export class CriaralterarComponent implements OnInit {
  
  formCriarAlterarUtilizador !: FormGroup;

  acao = "criar";
  requestCompleto= false;
  submitted = false;
  erroMsg?: string;
  hasErroMsg: boolean = false;
  constructor(private utilizadorCrudService: UtilizadorCrudService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>
    ) { }

  ngOnInit(): void {
    this.preencherFormulario();
  }

  preencherFormulario(): void {
    //LER DADOS URL: SABER ID e ACCAO
    this.route.params.subscribe((params: any) =>{
      console.log(params);
      const id = params['id'];
      if(id){
        this.preencherFormularioUpdate(id);
      }else{
        this.preencherFormularioCreate();
      }
    });
  }

  //CARREGAR FORM COM DADOS DE OBJECTO
  preencherFormularioUpdate(id: number): void {
    console.log('Preencher Formulario para Update Utilizador com ID:  ' + id);
  }


  //INCIALIZAR FORM COM DADOS PARA CRIAR
  preencherFormularioCreate(): void {
    this.acao="criar";
    console.log("ACCAO: ", this.acao);
    this.incializarFormEstado();
  }

   incializarFormEstado(): void {
    this.formCriarAlterarUtilizador = this.formBuilder.group({
      id: [null],
      userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      password: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      confPassword: [null, [Validators.required]],
      email: [null, [Validators.required]],      
      ativo: [null, [Validators.required]],
      dataCriacao: [null],
      dataAtualizacao: [null]
    });
  }

  addUtilizador(){
    console.log("ADICIONAR UM UTILIZADOR");

    this.utilizadorCrudService.createUtilizadorFromIReqUtilizador(this.criarObjectoUtilizador()).subscribe(
      success => {
        console.log('CRIADO Utilizador: sucesso: ' + success);
        alert('UTILIZADOR criado com Sucesso: ' + success);

        //fechar o dialog pop-up
        this.dialogRef.close();

        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/utilizador/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO UTILIZADOR: Erro no Create UTILIZADOR \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(this.erroMsg);
      },

      () => {
        console.log('CRIAR UTILIZADOR: request completo');
        this.requestCompleto = true;
      }
    );
  }

  

  criarObjectoUtilizador(): IReqUtilizador{
    console.log('CRIANDO OBJECTO UTLIZADOR......');    
    return {
      "id": this.formCriarAlterarUtilizador?.value.id,
      "userName": this.formCriarAlterarUtilizador?.value.userName,
      "password": this.formCriarAlterarUtilizador?.value.password,
      "email": this.formCriarAlterarUtilizador?.value.email,
      "ativo": this.formCriarAlterarUtilizador?.value.ativo,
      "dataCriacao": this.getSystemCurrentDateTime(),
      "dataUltimaActualizacao": this.getSystemCurrentDateTime()
     }
  }

  getSystemCurrentDateTime(): string {
    return '2022-08-30T20:10:00'
  }

  resetFields(){
    this.formCriarAlterarUtilizador.reset();
    alert('CLEAN FIELDS');
  }

}
