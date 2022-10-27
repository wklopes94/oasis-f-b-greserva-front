import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IReqCliente } from '../../../../cliente/interfaces/i-req-cliente';
import { ClienteCrudService } from '../../../../cliente/services/cliente-crud.service';
import { IReqHospede } from '../../../interfaces/i-req-hospede';
import { HospedeCrudService } from '../../../services/hospede-crud.service';
import { ListarComponent } from '../listar/listar.component';


@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers: [
    HospedeCrudService,
    ClienteCrudService
  ]
})
export class CriaralterarComponent implements OnInit {

  formCriarAlterarHospede!: FormGroup;
  criarCliente = true;
  requestCompleto = false;
  hasErroMsg = false;
  acao = "criar";
  submitted = false;
  erroMsg?: string;

  constructor(private hospedeCrudService: HospedeCrudService,
              private clienteCrudService: ClienteCrudService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>) { }

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
    console.log('Preencher Formulario para Update Estado com ID:  ' + id);
  }


  //INCIALIZAR FORM COM DADOS PARA CRIAR
  preencherFormularioCreate(): void {
    this.acao="criar";
    console.log("ACCAO: ", this.acao);
    this.incializarFormHospede();
  }

   incializarFormHospede(): void {
    this.formCriarAlterarHospede = this.formBuilder.group({
      id: [null],
      tipoCliente: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      nomeCliente: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      apelidoCliente: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      email: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      telefone: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      ativo: [null, [Validators.required]],
      dataCriacao: [null],
      dataAtualizacao: [null],
      // hospede
      idHospede: [null],
      numeroQuarto : [null, Validators.required],
      nacionalidade : [null, Validators.required],
    });
  }


  addCliente(){
    this.clienteCrudService.createClienteFromIReqCliente(this.criarObjectoCliente()).subscribe(
      (success: any) => {
        this.hasErroMsg = false;
        //this.msgSnackBar("ITEM criado");
        console.log('CRIADO cliente: sucesso: ' + success);
        console.log('CRIADO cliente: sucesso: ' + success.nome);
        console.log('CRIADO cliente com ID: ' + success.id + " sucesso");
        if(success.id){
          console.log("ID TEM QUALQUER COISA DIDERETENF DE NULL: " + success.id);

          let urlCliente = "http://localhost:8080/clientes/" + success.id;
          console.log("URL CLIENTE INSERIDO!!!!!!  " + urlCliente);

          console.log('ADICIONAR HOSPEDE APOS ADICIONARR UM CLIENTE !!!!!!!!!!!!!');
          this.addHospede(urlCliente);

          //fechar o dialog pop-up
          this.dialogRef.close();
          this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
            this.router.navigate(['/oa-admin/gestao/entidades/hospede/listar']);
          });

        } else {
          console.log('DEU BOOOOOOOOOOOOOOOOOOOOOOSTAAAAAAAAAAAAAAAAAA');
        }
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO Cliente: Erro no Create Cliente \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(this.erroMsg);
      },
      () => {
        console.log('CRIAR Cliente: request completo');
        alert('CRIAR Cliente: request completo');
        this.requestCompleto = true;
      }
    );

  }



  addHospede(urlCliente: string){
    this.hospedeCrudService.createHospedeFromIReqHospede(this.criarObjectoHospede(urlCliente)).subscribe(
      (success: any) => {
        this.hasErroMsg = false;
        //this.msgSnackBar("HOSPEDE criado");
        console.log('CRIADO cliente: sucesso: ' + success);
        console.log('CRIADO cliente: sucesso: ' + success.nome);
        console.log('CRIADO Hospde com ID: ' + success.id + " sucesso");
        if(success.id){
          console.log("ID TEM QUALQUER COISA DIDERETENF DE NULL: " + success.id);
          alert("Registo Hospede inserido com SUCESSO!!!1");
        } else {
          console.log('DEU BOOOOOOOOOOOOOOOOOOOOOOSTAAAAAAAAAAAAAAAAAA');
        }
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO hOSPEDE: Erro no Create HOSPEDE \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(this.erroMsg);
      },
      () => {
        console.log('CRIAR hOSPEDE: request completo');
        alert('CRIAR HOSPEDE: request completo');
        this.requestCompleto = true;
      }
    );
  }

  criarObjectoCliente(): IReqCliente{
    console.log('CRIANDO OBJECTO Cliente......');

    return {
      "id": this.formCriarAlterarHospede?.value.id,
      "nome": this.formCriarAlterarHospede?.value.nomeCliente,
      "apelido": this.formCriarAlterarHospede?.value.apelidoCliente,
      "email": this.formCriarAlterarHospede?.value.email,
      "telefone": this.formCriarAlterarHospede?.value.telefone,
      "tipo": 'hospede',
      "ativo": this.formCriarAlterarHospede?.value.ativo,
      "dataCriacao": this.getSystemCurrentDateTime(),
      "dataUltimaActualizacao": this.getSystemCurrentDateTime()
     }
  }

  criarObjectoHospede(_url: string): IReqHospede{
    console.log('CRIANDO OBJECTO HOSPDE......');

    return {
      "id": this.formCriarAlterarHospede?.value.idHospede,
      "numeroQuarto": this.formCriarAlterarHospede?.value.numeroQuarto,
      "nacionalidade": this.formCriarAlterarHospede?.value.nacionalidade,
      "cliente": _url
     }
  }



  resetFields(){
    this.formCriarAlterarHospede.reset();
    alert('CLEAN FIELDS');
  }

  getSystemCurrentDateTime(): string {
    return '2022-08-30T20:10:00'
  }

}
