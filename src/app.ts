

//Project Input Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;


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
    this.formElement.id = "user-input";    
    this.titleInputElement = this.formElement.querySelector("#title")! as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector("#description")! as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector("#people")! as HTMLInputElement;
    
    this.configure();
    this.attach();
  }

  private gatherInput() : [string, string, number] | void{
    const gatheredTitle = this.titleInputElement.value
    const gatheredDescription = this.descriptionInputElement.value
    const gatheredPeople = this.peopleInputElement.value;
    if(gatheredTitle.trim() === "" || gatheredDescription.trim() === "" || gatheredPeople.trim() === ""){
      alert("Please fill all areas")
      return;
    }else{
      return [gatheredTitle, gatheredDescription, +gatheredPeople]
    }
  }

  private clearInput(){
    this.titleInputElement.value = ""
    this.peopleInputElement.value = ""
    this. descriptionInputElement.value = ""
  }

  submitHandler(event: Event){
    event.preventDefault();
    const formInputs = this.gatherInput();
    if(Array.isArray(formInputs)){
      const [title, description, people] = formInputs
      console.log(title, description, people)
      this.clearInput()
    }
   
  }
  configure(){
    this.formElement.addEventListener("submit", this.submitHandler.bind(this))
  }
  attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
  }



}

const newIns = new ProjectInput();
