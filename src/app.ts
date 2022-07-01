class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "userr-inputt";
    // comment add 
    //comment 2 add
    
    this.attach();
  }
  attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
  }
}

const newIns = new ProjectInput();
