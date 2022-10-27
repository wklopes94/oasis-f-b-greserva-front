import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IReqCliente } from '../../../../cliente/interfaces/i-req-cliente';
import { ClienteCrudService } from '../../../../cliente/services/cliente-crud.service';
import { IReqParticular } from '../../../../particular/interfaces/i-req-particular';
import { ParticularCrudService } from '../../../../particular/services/particular-crud.service';
import { ListarComponent } from '../listar/listar.component';

@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers: [
    ParticularCrudService,
    ClienteCrudService
  ]
})

export class CriaralterarComponent implements OnInit {

  formCriarAlterarParticular!: FormGroup;
  criarCliente = true;
  requestCompleto = false;
  hasErroMsg = false;
  //criarCliente = true;   
  acao = "criar"; 
  submitted = false;  
  erroMsg?: string;

  constructor(private particularCrudService: ParticularCrudService,
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
    console.log('Preencher Formulario para Update Particular com ID:  ' + id);
  }


  //INCIALIZAR FORM COM DADOS PARA CRIAR
  preencherFormularioCreate(): void {
    this.acao="criar";
    console.log("ACCAO: ", this.acao);
    this.incializarFormCliente();
  }

   incializarFormCliente(): void {
    this.formCriarAlterarParticular = this.formBuilder.group({
      id: [null],
      tipoCliente: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      nomeCliente: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      apelidoCliente: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      email: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      telefone: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      ativo: [null, [Validators.required]],
      dataCriacao: [null],
      dataAtualizacao: [null],
      // Particular
      idParticular: [null],
      observacaoPartb : [null, Validators.required],      
    });
  }



  addCliente(){
    console.log("ADICIONAR UM CLIENTE");
    console.log('Estou AQUI!!!!!');
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
          
          console.log('ADICIONAR Particular APOS ADICIONARR UM CLIENTE !!!!!!!!!!!!!');
          this.addParticular(urlCliente);         

          //fechar o dialog pop-up
          this.dialogRef.close();
          this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
            this.router.navigate(['/oa-admin/gestao/entidades/particular/listar']);
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


  addParticular(urlCliente: string){
    console.log('Metodo para inseirir um Particular aops inserir um cliente....' + urlCliente);

    this.particularCrudService.createParticularFromIReqParticular(this.criarObjectoParticular(urlCliente)).subscribe(
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
          
          console.log('ADICIONAR Particular APOS ADICIONARR UM CLIENTE !!!!!!!!!!!!!');
          this.addParticular(urlCliente);         

          
        } else {
          console.log('DEU BOOOOOOOOOOOOOOOOOOOOOOSTAAAAAAAAAAAAAAAAAA');
        }
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO PARTICULAR: Erro no Create PARTICULAR \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(this.erroMsg);
      },

      () => {
        console.log('CRIAR PARTICULAR: request completo');
        alert('CRIAR PARTICULAR: request completo');
        this.requestCompleto = true;
      }
    );

  }

  criarObjectoCliente(): IReqCliente{
    console.log('CRIANDO OBJECTO Cliente......');
    
    return {
      "id": this.formCriarAlterarParticular?.value.id,
      "nome": this.formCriarAlterarParticular?.value.nomeCliente, 
      "apelido": this.formCriarAlterarParticular?.value.apelidoCliente, 
      "email": this.formCriarAlterarParticular?.value.email,
      "telefone": this.formCriarAlterarParticular?.value.telefone, 
      "tipo": 'particular',      
      "ativo": this.formCriarAlterarParticular?.value.ativo,
      "dataCriacao": this.getSystemCurrentDateTime(),
      "dataUltimaActualizacao": this.getSystemCurrentDateTime()      
     }
  }

  criarObjectoParticular(_url: string): IReqParticular{
    console.log('CRIANDO OBJECTO PARTICULAR......');
    
    return {
      "id": this.formCriarAlterarParticular?.value.idParticular,
      "observacao": this.formCriarAlterarParticular?.value.observacaoPartb,
      "cliente": _url
     }
  }

  resetFields(){
    this.formCriarAlterarParticular.reset();
    alert('CLEAN FIELDS');
  }

  getSystemCurrentDateTime(): string {
    return '2022-08-30T20:10:00'
  }

}