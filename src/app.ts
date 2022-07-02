enum ProjectStatus{Active, Finished}

// Project Class
class Project{
  constructor(public id: string, public title:string, public description: string, public people: number, public status: ProjectStatus){

  }
}

type Listener = (item:Project[]) => void

//Project State Management
class ProjectState{

  private listeners : Listener [] = []
  private projects: Project [] = []
  private static instance:ProjectState

  static getInstance(){
    if(this.instance){
      return this.instance
    }
    return this.instance = new ProjectState();
  }

  private constructor(){

  }

  addListener(fnListener: Listener){
    this.listeners.push(fnListener)
  }

  addProject(title:string, description:string, numberOfPeople:number){
    const newProject = new Project(Math.random().toString(), title, description, numberOfPeople, ProjectStatus.Active)
    this.projects.push(newProject);
    for(const listenerFn of this.listeners){
      listenerFn(this.projects.slice())
    }
  }
  
}
const projectState = ProjectState.getInstance();


interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
function validate(validatableInput: Validatable) {
  
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length > 0;
    
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length > validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLength;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value < validatableInput.max;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value > validatableInput.min;
  }
  return isValid;
}

//Project List Class
class ProjectList{
  templateElement: HTMLTemplateElement;
  hostElement:HTMLDivElement;
  sectionElement:HTMLElement;
  assignedProjects!:Project[];
  

  constructor(private type: "active" | "finished"){
    this.templateElement = document.querySelector("#project-list")! as HTMLTemplateElement;
    this.hostElement = document.querySelector("#app")! as HTMLDivElement;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.sectionElement = importedNode.firstElementChild as HTMLElement;
    this.sectionElement.id = `${type}-projects`;
    this.assignedProjects= []

    projectState.addListener((projects: Project[])=>{
      this.assignedProjects = projects;
      this.renderProjects();
    })
    this.attach();
    this.renderContent();

  }
  private renderProjects(){
    const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
    for(const projectItem of this.assignedProjects){
      const listItem = document.createElement("li") as HTMLLIElement
      listItem.textContent = projectItem.title;
      listEl?.appendChild(listItem)

    }
    
  
  }

 private renderContent(){
  const ListId = `${this.type}-projects-list`;
   const ulList = this.sectionElement.querySelector("ul")! as HTMLUListElement;
   ulList.id = ListId;
   const sectionHeaderH2 = this.sectionElement.querySelector("h2")! as HTMLElement;
   sectionHeaderH2.textContent = `${this.type.toUpperCase()} PROJECTS`

 } 
  private attach(){
    this.hostElement.insertAdjacentElement("beforeend",this.sectionElement)
  }

}

//Project Input Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  // for error handling
  

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
    this.titleInputElement = this.formElement.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherInput(): [string, string, number] | void {
    const gatheredTitle = this.titleInputElement.value;
    const gatheredDescription = this.descriptionInputElement.value;
    const gatheredPeople = this.peopleInputElement.value;

    const validateTitle: Validatable = {
      value: gatheredTitle,
      required: true,
      minLength: 5,
      maxLength: 30,
    };

    const validateDescription: Validatable = {
      value: gatheredDescription,
      required: true,
      minLength: 5,
      maxLength: 100,
    };
    const validatePeople = {
      value: gatheredPeople,
      min: 1,
      max: 5,
      required: true,
    };
    if (
      validate(validateTitle) &&
      validate(validateDescription) &&
      validate(validatePeople)
    ) {
      return [gatheredTitle, gatheredDescription, +gatheredPeople];
    } else {
      alert("Fill all areas");
      return;
    }
  }

  private clearInput() {
    this.titleInputElement.value = "";
    this.peopleInputElement.value = "";
    this.descriptionInputElement.value = "";
  }

  submitHandler(event: Event) {
    event.preventDefault();
    const formInputs = this.gatherInput();
    if (Array.isArray(formInputs)) {
      const [title, description, people] = formInputs;
      projectState.addProject(title, description, people)
      console.log(title, description, people);
      this.clearInput();
    }
  }
  configure() {
    this.formElement.addEventListener("submit", this.submitHandler.bind(this));
  }
  attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
  }
}

const newIns = new ProjectInput();
const activeProjectsList = new ProjectList("active");
const finishedProjectsList = new ProjectList("finished")

