import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IReqGrupo } from '../../../../grupo/interfaces/i-req-grupo';
import { GrupoCrudService } from '../../../../grupo/services/grupo-crud.service';
import { IReqHospede } from '../../../../hospede/interfaces/i-req-hospede';
import { HospedeCrudService } from '../../../../hospede/services/hospede-crud.service';
import { IReqParticular } from '../../../../particular/interfaces/i-req-particular';
import { ParticularCrudService } from '../../../../particular/services/particular-crud.service';
import { IReqCliente } from '../../../interfaces/i-req-cliente';
import { ClienteCrudService } from '../../../services/cliente-crud.service';
import { ListarComponent } from '../listar/listar.component';

@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers: [
    ClienteCrudService,
    HospedeCrudService,
    ParticularCrudService,
    GrupoCrudService
  ]
})
export class CriaralterarComponent implements OnInit {

  formCriarAlterarCliente!: FormGroup;
  tipoCliente = ''; //colocar como hospede por defeito
  criarCliente = true;
  requestCompleto = false;
  hasErroMsg = false;
  acao = "criar"; 
  submitted = false;  
  erroMsg?: string;
  

  constructor(private clienteCrudService: ClienteCrudService,
              private hospedeCrudService: HospedeCrudService,
              private particularCrudservice: ParticularCrudService,
              private grupoCrudService: GrupoCrudService,
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
    this.incializarFormCliente();
  }

   incializarFormCliente(): void {
    this.formCriarAlterarCliente = this.formBuilder.group({
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
      //prticular
      idParticular: [null],
      observacaoPartb : [null, Validators.required],
      // grupo
      idGrupo: [null],
      instituicao : [null, Validators.required],
      observacaoGrupo : [null, Validators.required],
      descricaoGrupo : [null, Validators.required]
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

          if(this.tipoCliente=='hospede' && this.criarCliente==true){
            console.log('ADICIONAR HOSPEDE APOS ADICIONARR UM CLIENTE !!!!!!!!!!!!!');
            this.addHospede(urlCliente);

          } else if(this.tipoCliente=='particular' && this.criarCliente==true){
            console.log('ADICIONAR PARTICULAR APOS ADICIONARR UM CLIENTE !!!!!!!!!!!!!');
            this.addParticular(urlCliente);

          } else if(this.tipoCliente=='grupo'  && this.criarCliente==true){
            console.log('ADICIONAR GRUPO APOS ADICIONARR UM CLIENTE !!!!!!!!!!!!!');
            this.addGrupo(urlCliente);

          } else {
            console.log('POR FAVOR ESCOLHER UM TIPO DE cLIENTE!!!')
            alert("POR FAVOR ESCOLHER UM TIPO DE cLIENTE!!!");
          }

          //fechar o dialog pop-up
          this.dialogRef.close();
          this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
            this.router.navigate(['/oa-admin/gestao/entidades/cliente/listar']);
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

  addParticular(urlCliente: string){
    this.particularCrudservice.createParticularFromIReqParticular(this.criarObjectoParticular(urlCliente)).subscribe(
      (success: any) => {
        this.hasErroMsg = false;
        //this.msgSnackBar("ITEM criado");
        console.log('CRIADO cliente: sucesso: ' + success);
        console.log('CRIADO cliente: sucesso: ' + success.nome);
        console.log('CRIADO Particular com ID: ' + success.id + " sucesso");
        if(success.id){
          console.log("ID TEM QUALQUER COISA DIDERETENF DE NULL: " + success.id);
          alert("Registo Particular inserido com SUCESSO!!!1");

        } else {
          //apresentar uma mensagem de erro num pop up ou alerts()
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
        this.requestCompleto = true;
      }
    );
  }
  
  addGrupo(urlCliente: string){

    console.log(" ID---> " + this.formCriarAlterarCliente?.value.id);
    console.log(" Instituicao---> " + this.formCriarAlterarCliente?.value.instituicao);
    console.log(" Descricao---> " + this.formCriarAlterarCliente?.value.descricaoGrupo);
    console.log(" Observacao---> " + this.formCriarAlterarCliente?.value.observacaoGrupo);

    this.grupoCrudService.createGrupoFromIReqGrupo(this.criarObjectoGrupo(urlCliente)).subscribe(
      (success: any) => {
        this.hasErroMsg = false;
        //this.msgSnackBar("ITEM criado");
        console.log('CRIADO GRUPO: sucesso: ' + success);
        console.log('CRIADO GRUPO: sucesso: ' + success.nome);
        console.log('CRIADO GRUPO com ID: ' + success.id + " sucesso");
        if(success.id){
          console.log("ID TEM QUALQUER COISA DIDERETENF DE NULL: " + success.id);
          alert("Registo GRUPO inserido com SUCESSO!!!1");

        } else {
          console.log('DEU BOOOOOOOOOOOOOOOOOOOOOOSTAAAAAAAAAAAAAAAAAA');
        }
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO GRUPO: Erro no Create GRUPO \n"+error;
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
    return {
      "id": this.formCriarAlterarCliente?.value.id,
      "nome": this.formCriarAlterarCliente?.value.nomeCliente, 
      "apelido": this.formCriarAlterarCliente?.value.apelidoCliente, 
      "email": this.formCriarAlterarCliente?.value.email,
      "telefone": this.formCriarAlterarCliente?.value.telefone, 
      "tipo": this.formCriarAlterarCliente?.value.tipoCliente,      
      "ativo": this.formCriarAlterarCliente?.value.ativo,
      "dataCriacao": this.getSystemCurrentDateTime(),
      "dataUltimaActualizacao": this.getSystemCurrentDateTime()
     }
  }

  criarObjectoHospede(_url: string): IReqHospede{    
    return {
      "id": this.formCriarAlterarCliente?.value.idHospede,
      "numeroQuarto": this.formCriarAlterarCliente?.value.numeroQuarto, 
      "nacionalidade": this.formCriarAlterarCliente?.value.nacionalidade, 
      "cliente": _url
     }
  }

  criarObjectoParticular(_url: string): IReqParticular{    
    return {
      "id": this.formCriarAlterarCliente?.value.idParticular,
      "observacao": this.formCriarAlterarCliente?.value.observacaoPartb,
      "cliente": _url
     }
  }

  criarObjectoGrupo(_url: string): IReqGrupo{    
    return {
      "id": this.formCriarAlterarCliente?.value.idGrupo,
      "instituicao": this.formCriarAlterarCliente?.value.instituicao,
      "descricao": this.formCriarAlterarCliente?.value.descricaoGrupo,
      "observacao": this.formCriarAlterarCliente?.value.observacaoGrupo,
      "cliente": _url
     }
  }

  resetFields(){
    this.formCriarAlterarCliente.reset();
    alert('CLEAN FIELDS');
  }

  getSystemCurrentDateTime(): string {
    return '2022-08-30T20:10:00'
  }

  setTipoCliente(): void{
      this.tipoCliente = this.formCriarAlterarCliente.controls['tipoCliente'].value;
      console.log(this.tipoCliente);
  }

}