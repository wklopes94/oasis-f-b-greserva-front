import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IReqCliente } from '../../../../cliente/interfaces/i-req-cliente';
import { ClienteCrudService } from '../../../../cliente/services/cliente-crud.service';
import { IReqGrupo } from '../../../interfaces/i-req-grupo';
import { GrupoCrudService } from '../../../services/grupo-crud.service';
import { ListarComponent } from '../listar/listar.component';

@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers: [
    GrupoCrudService,
    ClienteCrudService
  ]
})
export class CriaralterarComponent implements OnInit {

  formCriarAlterarGrupo!: FormGroup;
  criarCliente = true;
  requestCompleto = false;
  hasErroMsg = false;  
  acao = "criar"; 
  submitted = false;  
  erroMsg?: string;

  constructor(private grupoCrudService: GrupoCrudService,
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
    this.incializarFormGrupo();
  }

   incializarFormGrupo(): void {
    this.formCriarAlterarGrupo = this.formBuilder.group({
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
      idGrupo: [null],
      instituicao : [null, Validators.required],
      observacaoGrupo : [null, Validators.required],
      descricaoGrupo : [null, Validators.required]
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

          console.log('ADICIONAR HOSPEDE APOS ADICIONARR UM CLIENTE !!!!!!!!!!!!!');
          this.addGrupo(urlCliente);

          //fechar o dialog pop-up
          this.dialogRef.close();
          this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
            this.router.navigate(['/oa-admin/gestao/entidades/grupo/listar']);
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


  addGrupo(urlCliente: string){
    console.log('Metodo para inseirir um GRUPO aops inserir um cliente....' + urlCliente);

    this.grupoCrudService.createGrupoFromIReqGrupo(this.criarObjectoGrupo(urlCliente)).subscribe(
      (success: any) => {
        this.hasErroMsg = false;
        //this.msgSnackBar("ITEM criado");
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
        let erroMsg = "CRIADO GRUPO: Erro no Create GRUPO \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(erroMsg);
      },

      () => {
        console.log('CRIAR GRUPO: request completo');
        alert('CRIAR GRUPO: request completo');
        this.requestCompleto = true;
      }
    );

  }

  criarObjectoCliente(): IReqCliente{
    console.log('CRIANDO OBJECTO Cliente......');
    
    return {
      "id": this.formCriarAlterarGrupo?.value.id,
      "nome": this.formCriarAlterarGrupo?.value.nomeCliente, 
      "apelido": this.formCriarAlterarGrupo?.value.apelidoCliente, 
      "email": this.formCriarAlterarGrupo?.value.email,
      "telefone": this.formCriarAlterarGrupo?.value.telefone, 
      "tipo": "grupo",
      
      "ativo": this.formCriarAlterarGrupo?.value.ativo,
      "dataCriacao": this.getSystemCurrentDateTime(),
      "dataUltimaActualizacao": this.getSystemCurrentDateTime()
     }
  }

  criarObjectoGrupo(_url: string): IReqGrupo{
    console.log('CRIANDO OBJECTO GRUPO......');
    
    return {
      "id": this.formCriarAlterarGrupo?.value.idGrupo,
      "instituicao": this.formCriarAlterarGrupo?.value.instituicao,
      "descricao": this.formCriarAlterarGrupo?.value.descricaoGrupo,
      "observacao": this.formCriarAlterarGrupo?.value.observacaoGrupo,

      "cliente": _url
     }
  }

  resetFields(){
    this.formCriarAlterarGrupo.reset();
    alert('CLEAN FIELDS');
  }

  getSystemCurrentDateTime(): string {
    return '2022-08-30T20:10:00'
  }

}
