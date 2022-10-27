import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IMenu } from '../../../interfaces/i-menu';
import { IReqMenu } from '../../../interfaces/i-req-menu';
import { MMenu } from '../../../models/m-menu';
import { MenuCrudService } from '../../../services/menu-crud.service';
import { ListarComponent } from '../listar/listar.component';

export interface Parametros {
  acao: 'criar' | 'ver' | 'editar';
  menu: IMenu;
}

@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers: [
    MenuCrudService
  ]
})
export class CriaralterarComponent implements OnInit {

  formCriarAlterarMenu !: FormGroup;
  acao = "criar";
  ativarS = false;
  ativarN = false;
  requestCompleto= false;
  submitted = false;
  erroMsg?: string;
  hasErroMsg: boolean = false;
  menu!: IMenu;
  
  constructor(private menuCrudService: MenuCrudService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Parametros) { }

  ngOnInit(): void {
    this.acao = this.data.acao;
    this.menu = this.data.menu;
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
  
  preencherFormularioCreate(): void {
    this.acao="criar";
    console.log("ACCAO: ", this.acao);
    this.incializarFormMenu();
  }


  incializarFormMenu(): void {
    this.formCriarAlterarMenu = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      descricao: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      ativo: [null, [Validators.required]],
      dataCriacao: [null],
      dataAtualizacao: [null]
    });
  }



  preencherFormularioUpdate(): void {
    console.log('Preencher Formulario para Update MENU com ID:  ' + this.menu.id);
    this.updateFormFromOBJ();
    console.log("Acao a EXECUTAR--> " + this.acao);

    if(this.acao == "ver"){
      this.disalbleAllControls();
    }    
  } 

  updateFormFromOBJ(): void {
    console.log('Update Form From OBJECTO MENU.');
    this.incializarFormMenu();

    if(this.menu.ativo){
        this.ativarS = true;
    } else{
        this.ativarN = true;
    }

    this.formCriarAlterarMenu?.patchValue({
        id: this.menu.id,
        nome: this.menu.nome,
        descricao: this.menu.descricao,
        ativo: this.menu.ativo,

        //em principio nao sao necessarios - tirar no fim
        dataCriacao: this.menu.dataCriacao,
        dataAtualizacao: this.menu.dataUltimaActualizacao
    });
  }

  addMenu(){
    console.log("ADICIONAR UM Menu");

    this.menuCrudService.createMenuFromIReqMenu(this.criarObjectoMenu()).subscribe(
      success => {
        console.log('CRIADO MENU: sucesso: ' + success);
        alert('MENU criado com Sucesso: ' + success);

        //fechar o dialog pop-up
        this.dialogRef.close();

        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/menu/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO MENU: Erro no Create MENU \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(this.erroMsg);
      },

      () => {
        console.log('CRIAR MENU: request completo');
        this.requestCompleto = true;
      }
    );
  }

  editMenu(): void{
    console.log('EDITANDO MENU..........GUARDAR NA BD!!!!!');
    console.log("**************************** MENU Original ----> \n" + this.mostrarMenu(this.menu))
    console.log('-------------------------------------------------------------------------------------');
    let novoMenu = this.obterDadosForm();
    console.log("**************************** NOVO Menu ----> \n" + this.mostrarMenu(novoMenu));
    if(!this.compararMenu(this.menu, novoMenu)){
        console.log("OS DADOS DO Menu ORIGINAL FORAM ALTERADOS - ACTUALIZAR NA BASE DE DADOS");
        let men= new MMenu();
        men.id = novoMenu.id;
        men.nome = novoMenu.nome;
        men.descricao = novoMenu.descricao;
        men.ativo = novoMenu.ativo;
        men.dataCriacao = novoMenu.dataCriacao;
        men.dataUltimaActualizacao = this.getDataActualizacao();

        console.log("Menu Alterado--> " + men);
        this.menuCrudService.updateData(men.id, men).subscribe(
          success => {
            console.log('OPERACAO:: EDITAR MENUuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu: SUCESSO: \n' + success);
            //fechar o dialog pop-up
            this.dialogRef.close();
            this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
              this.router.navigate(['/oa-admin/gestao/entidades/menu/listar']);
            });
          },
          error => {
            this.hasErroMsg = true;
            this.erroMsg = "OPERACAO:: EDITAR MENU: ERRO: \n" + error;
            this.requestCompleto = false;
            console.log(this.erroMsg);
            alert(this.erroMsg);
          },
          () => {
            console.log('OPERACAO:: EDITAR MENU: PEDIDO COMPLETO');
            this.requestCompleto = true;
          }
        );
    } else {
        console.log("NENHUMA ALTERACAO FOI REALIZADA - NAO ACTUALIZAR");
    }
  }


  criarObjectoMenu(): IReqMenu{
    console.log('CRIANDO OBJECTO MENU......');    
    return {
      "id": this.formCriarAlterarMenu?.value.id,
      "nome": this.formCriarAlterarMenu?.value.nome,
      "descricao": this.formCriarAlterarMenu?.value.descricao,
      "ativo": this.formCriarAlterarMenu?.value.ativo,
      "dataCriacao": this.getDataCriacao(),
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }


  compararMenu(menu: IMenu, novoMenu: IMenu): boolean {
    if(menu.ativo==novoMenu.ativo &&
       menu.descricao== novoMenu.descricao &&
       menu.nome== novoMenu.nome){
      return true;
    } else{
      return false;
    }
  }

  mostrarMenu(menu: IMenu) {
    console.log("**************** MENU ****************");
    console.log("ID--> " + menu.id);
    console.log("NOME--> " + menu.nome);
    console.log("DESCRICAO--> " + menu.descricao);
    console.log("ATIVO--> " + menu.ativo);
    console.log("DATA CRIACAO--> " + menu.dataCriacao);
    console.log("DATA ACTUALIZACAO--> " + menu.dataUltimaActualizacao);
    console.log("****************************************");
  }

  obterDadosForm(): IMenu {
    console.log('Ler dados do formulario editar');
    return{
      "id": this.menu.id,
      "nome": this.formCriarAlterarMenu?.value.nome,
      "descricao": this.formCriarAlterarMenu?.value.descricao,
      "ativo": this.formCriarAlterarMenu?.value.ativo,

      "dataCriacao": this.menu.dataCriacao,
      "dataUltimaActualizacao": this.getDataActualizacao()
     }
  }

  ativarControlos(): void{
    this.acao = "editar";
    this.formCriarAlterarMenu.get('nome')?.enable();
    this.formCriarAlterarMenu.get('descricao')?.enable();
    this.formCriarAlterarMenu.get('ativo')?.enable();
  }

  disalbleAllControls(): void{
    this.formCriarAlterarMenu.get('nome')?.disable();
    //this.formCriarAlterarMenu.get('valor')?.reset();
    this.formCriarAlterarMenu.get('descricao')?.disable();
    this.formCriarAlterarMenu.get('ativo')?.disable();
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
    this.formCriarAlterarMenu.reset();
    alert('OS CAMPOS FORAM LIMPOS');
  } 

}